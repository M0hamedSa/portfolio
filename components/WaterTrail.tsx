'use client';

import { useEffect, useRef } from 'react';
import styles from '@/styles/WaterTrail.module.css';

interface Ripple {
    x: number;
    y: number;
    r: number;
    opacity: number;
}

export default function WaterTrail() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const ripplesRef = useRef<Ripple[]>([]);
    const lastPosRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // 1. Handle Resize
        const resize = () => {
            const dpr = window.devicePixelRatio || 1;
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            ctx.scale(dpr, dpr);
            canvas.style.width = `${window.innerWidth}px`;
            canvas.style.height = `${window.innerHeight}px`;
        };
        resize();
        window.addEventListener('resize', resize);

        // 2. Distance-Based Spawning (Much cleaner)
        const onMouseMove = (e: MouseEvent) => {
            const dx = e.clientX - lastPosRef.current.x;
            const dy = e.clientY - lastPosRef.current.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // ONLY SPAWN if mouse has moved a significant distance (120px)
            if (distance > 120) {
                ripplesRef.current.push({
                    x: e.clientX,
                    y: e.clientY,
                    r: 15,
                    opacity: 0.4,
                });
                lastPosRef.current = { x: e.clientX, y: e.clientY };
            }
        };
        window.addEventListener('mousemove', onMouseMove);

        // 3. Animation Loop
        let animationFrame: number;
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // ADD BLUR FOR FLUID FEEL
            ctx.filter = 'blur(12px)';

            for (let i = ripplesRef.current.length - 1; i >= 0; i--) {
                const ripple = ripplesRef.current[i];
                
                // PHYSICS: Subtle expand and rapid fade
                ripple.r += 1.5;
                ripple.opacity -= 0.015;

                // DRAW
                ctx.beginPath();
                ctx.arc(ripple.x, ripple.y, ripple.r, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(255, 255, 255, ${ripple.opacity})`;
                ctx.lineWidth = 2;
                ctx.stroke();

                if (ripple.opacity <= 0) {
                    ripplesRef.current.splice(i, 1);
                }
            }

            animationFrame = requestAnimationFrame(animate);
        };
        animate();

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', onMouseMove);
            cancelAnimationFrame(animationFrame);
        };
    }, []);

    return <canvas ref={canvasRef} className={styles.canvas} />;
}
