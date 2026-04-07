'use client';

import { useEffect, useRef } from 'react';
import styles from '@/styles/StarCanvas.module.css';

interface Star {
    x: number;
    y: number;
    r: number;
    a: number;
    p: number;
    spd: number;
}

interface ShootingStar {
    x: number;
    y: number;
    len: number;
    max: number;
}

export default function StarCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let stars: Star[] = [];
        const shoots: ShootingStar[] = [];
        let W: number, H: number;
        let animId: number;

        function resize() {
            W = canvas!.width = window.innerWidth;
            H = canvas!.height = window.innerHeight;
        }

        function mkStars(n = 300) {
            stars = Array.from({ length: n }, () => ({
                x: Math.random() * W,
                y: Math.random() * H,
                r: Math.random() * 1.4 + 0.1,
                a: Math.random() * 0.5 + 0.05,
                p: Math.random() * Math.PI * 2,
                spd: Math.random() * 0.05 + 0.008,
            }));
        }

        function addShoot() {
            shoots.push({
                x: Math.random() * W * 0.7 + W * 0.1,
                y: Math.random() * H * 0.35,
                len: 0,
                max: 100 + Math.random() * 100,
            });
        }

        function tick() {
            ctx!.clearRect(0, 0, W, H);
            const t = Date.now() * 0.0007;

            for (const s of stars) {
                const fl = 0.6 + 0.4 * Math.sin(t * 1.1 + s.p);
                ctx!.beginPath();
                ctx!.arc(s.x, s.y, s.r, 0, Math.PI * 2);
                ctx!.fillStyle = `rgba(255,255,255,${(s.a * fl).toFixed(3)})`;
                ctx!.fill();
                s.y -= s.spd;
                if (s.y < 0) { s.y = H; s.x = Math.random() * W; }
            }

            for (let i = shoots.length - 1; i >= 0; i--) {
                const s = shoots[i];
                const prog = s.len / s.max;
                const al = prog < 0.5 ? prog * 2 : (1 - prog) * 2;
                ctx!.beginPath();
                ctx!.moveTo(s.x, s.y);
                ctx!.lineTo(s.x + s.len * 1.8, s.y + s.len * 0.6);
                ctx!.strokeStyle = `rgba(255,255,255,${(al * 0.55).toFixed(3)})`;
                ctx!.lineWidth = 1;
                ctx!.stroke();
                s.len += 4;
                if (s.len > s.max) shoots.splice(i, 1);
            }

            if (Math.random() < 0.003) addShoot();
            animId = requestAnimationFrame(tick);
        }

        const handleResize = () => { resize(); mkStars(); };
        window.addEventListener('resize', handleResize);
        resize();
        mkStars();
        tick();

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animId);
        };
    }, []);

    return <canvas ref={canvasRef} className={styles.canvas} />;
}