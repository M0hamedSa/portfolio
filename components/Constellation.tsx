'use client';

import { useEffect, useRef } from 'react';
import styles from '@/styles/Constellation.module.css';

interface Point {
    x: number;
    y: number;
    vx: number;
    vy: number;
    z: number; // Z-index for 3D Holographic Parallax
}

export default function Constellation() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const pointsRef = useRef<Point[]>([]);
    const mouseRef = useRef({ x: 0, y: 0 });
    const tiltRef = useRef({ gx: 0, gy: 0 }); // Gyroscope tilt values
    const isMobileRef = useRef(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // 1. Initial Seeding of 140 Stars
        const numPoints = 140;
        const resize = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2); 
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            ctx.scale(dpr, dpr);
            canvas.style.width = `${window.innerWidth}px`;
            canvas.style.height = `${window.innerHeight}px`;

            // Detect mobile for architectural branching
            isMobileRef.current = window.innerWidth <= 768;

            // Seed particles with 'z' depth for 3D parallax
            pointsRef.current = Array.from({ length: numPoints }, () => ({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                vx: (Math.random() - 0.5) * 0.12, 
                vy: (Math.random() - 0.5) * 0.12,
                z: Math.random() * 2 + 0.5 // Layer depth (0.5 far, 2.5 near)
            }));
        };

        resize();
        window.addEventListener('resize', resize);

        // 2. Desktop Mouse Tracking
        const onMouseMove = (e: MouseEvent) => {
            if (!isMobileRef.current) {
                mouseRef.current = { x: e.clientX, y: e.clientY };
            }
        };
        window.addEventListener('mousemove', onMouseMove);

        // 3. Mobile Gyroscope Tracking (The Graphic Snowglobe Gravity)
        const handleOrientation = (e: DeviceOrientationEvent) => {
            if (!isMobileRef.current || e.gamma === null || e.beta === null) return;
            
            // Map physical tilt to a "wind/gravity" force factor
            // gamma (left-right) -90 to 90
            // beta (front-back) mapping 45deg as 'flat/neutral'
            const gamma = Math.max(-45, Math.min(45, e.gamma)); 
            const beta = Math.max(0, Math.min(90, e.beta)) - 45; 

            // Update global tilt forces. We multiply by a small factor for smooth cinematic drift
            tiltRef.current.gx = (gamma / 45) * 0.8; 
            tiltRef.current.gy = (beta / 45) * 0.8;
        };
        window.addEventListener('deviceorientation', handleOrientation, { passive: true });

        // 4. Multi-Architectural Animation Loop
        let animationFrame: number;
        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const points = pointsRef.current;
            const mouse = mouseRef.current;
            const isMobile = isMobileRef.current;
            const tilt = tiltRef.current;

            points.forEach(p => {
                // Apply physics based on device type
                if (isMobile) {
                    // Holographic Snowglobe Physics: Add tilt 'gravity' scaled by the 'z' depth (parallax)
                    p.x += p.vx + (tilt.gx * p.z);
                    p.y += p.vy + (tilt.gy * p.z);
                } else {
                    // Standard desktop drift
                    p.x += p.vx;
                    p.y += p.vy;
                }

                // Boundary bounce physics
                if (p.x < 0 || p.x > window.innerWidth) p.vx *= -1;
                if (p.y < 0 || p.y > window.innerHeight) p.vy *= -1;

                // Screen-wrap logic for gravity on mobile (so stars don't get 'stuck' pushing against walls continuously)
                if (isMobile) {
                    if (p.x < -10) p.x = window.innerWidth + 10;
                    if (p.x > window.innerWidth + 10) p.x = -10;
                    if (p.y < -10) p.y = window.innerHeight + 10;
                    if (p.y > window.innerHeight + 10) p.y = -10;
                }

                // Draw Particle (scale slightly based on depth layer)
                ctx.beginPath();
                const radius = isMobile ? (0.6 * p.z * 0.8) : 0.6; // Give closer particles slightly larger radius on mobile
                ctx.arc(Math.max(0, p.x), Math.max(0, p.y), radius, 0, Math.PI * 2);
                
                // Color variation: Closer particles are slightly brighter
                const baseOpacity = isMobile ? (0.2 + p.z * 0.15) : 0.4;
                ctx.fillStyle = `rgba(255, 255, 255, ${baseOpacity})`;
                ctx.fill();
            });

            // 5. Desktop-Only Connection Web Structure
            if (!isMobile) {
                // Global Proximity Connections (150px reach)
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

                // Special Cursor Magnetic Connections (Nearest 8 stars)
                const sortedByDist = points
                    .map(p => ({
                        p,
                        dist: Math.sqrt((p.x - mouse.x) ** 2 + (p.y - mouse.y) ** 2)
                    }))
                    .sort((a, b) => a.dist - b.dist)
                    .slice(0, 8);

                sortedByDist.forEach(({ p, dist }) => {
                    const opacity = Math.max(0, 1 - dist / 300); 
                    ctx.beginPath();
                    ctx.moveTo(mouse.x, mouse.y);
                    ctx.lineTo(p.x, p.y);
                    ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.4})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                });
            }

            animationFrame = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('deviceorientation', handleOrientation);
            cancelAnimationFrame(animationFrame);
        };
    }, []);

    return <canvas ref={canvasRef} className={styles.canvas} />;
}
