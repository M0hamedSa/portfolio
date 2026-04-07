'use client';

import { useEffect, useRef } from 'react';
import styles from '@/styles/Constellation.module.css';

interface Point {
    x: number;
    y: number;
    vx: number;
    vy: number;
}

export default function Constellation() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const pointsRef = useRef<Point[]>([]);
    const mouseRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // 1. Initial Seeding of 140 Stars (Optimized Density)
        const numPoints = 140;
        const resize = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2); // Cap at 2 for performance
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            ctx.scale(dpr, dpr);
            canvas.style.width = `${window.innerWidth}px`;
            canvas.style.height = `${window.innerHeight}px`;

            // Reset points on resize to fill new screen
            pointsRef.current = Array.from({ length: numPoints }, () => ({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                vx: (Math.random() - 0.5) * 0.12, // Slower drift for smoothness
                vy: (Math.random() - 0.5) * 0.12,
            }));
        };

        resize();
        window.addEventListener('resize', resize);

        // 2. Mouse Tracking
        const updatePointer = (x: number, y: number) => {
            mouseRef.current = { x, y };
        };

        const onMouseMove = (e: MouseEvent) => updatePointer(e.clientX, e.clientY);

        window.addEventListener('mousemove', onMouseMove);

        // 3. Animation Loop
        let animationFrame: number;
        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const points = pointsRef.current;
            const mouse = mouseRef.current;

            // Update positions (slight drift)
            points.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0 || p.x > window.innerWidth) p.vx *= -1;
                if (p.y < 0 || p.y > window.innerHeight) p.vy *= -1;

                // Draw Star Dot (1px)
                ctx.beginPath();
                ctx.arc(p.x, p.y, 0.6, 0, Math.PI * 2);
                ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
                ctx.fill();
            });

            // 4. Global Proximity Connections (150px reach)
            for (let i = 0; i < points.length; i++) {
                for (let j = i + 1; j < points.length; j++) {
                    const p1 = points[i];
                    const p2 = points[j];
                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 150) {
                        const opacity = 1 - dist / 150;
                        ctx.beginPath();
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.12})`;
                        ctx.lineWidth = 0.4;
                        ctx.stroke();
                    }
                }
            }

            // 5. Special Cursor Connections (Nearest 8 stars)
            const sortedByDist = points
                .map(p => ({
                    p,
                    dist: Math.sqrt((p.x - mouse.x) ** 2 + (p.y - mouse.y) ** 2)
                }))
                .sort((a, b) => a.dist - b.dist)
                .slice(0, 8);

            sortedByDist.forEach(({ p, dist }) => {
                const opacity = Math.max(0, 1 - dist / 300); // Larger reach for cursor
                ctx.beginPath();
                ctx.moveTo(mouse.x, mouse.y);
                ctx.lineTo(p.x, p.y);
                ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.4})`;
                ctx.lineWidth = 0.8;
                ctx.stroke();
            });

            animationFrame = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', onMouseMove);
            cancelAnimationFrame(animationFrame);
        };
    }, []);

    return <canvas ref={canvasRef} className={styles.canvas} />;
}
