'use client';

import { useRef } from 'react';
import styles from '@/styles/VideoHero.module.css';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function VideoHero() {
    const containerRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const separatorRef = useRef<HTMLDivElement>(null);
    const subtitleRef = useRef<HTMLParagraphElement>(null);
    const aboutRef = useRef<HTMLDivElement>(null);

    // 1. Entrance Animation (GSAP Staggered Reveal)
    useGSAP(() => {
        const tl = gsap.timeline({ 
            defaults: { 
                ease: "power4.out", 
                duration: 1.5,
                force3D: true // Force GPU acceleration
            } 
        });

        tl.fromTo(titleRef.current, 
            { y: 40, opacity: 0 }, 
            { y: 0, opacity: 1, delay: 0.5 }
        )
        .fromTo(separatorRef.current,
            { width: 0, opacity: 0 },
            { width: "4rem", opacity: 0.15 },
            "-=1.1"
        )
        .fromTo(subtitleRef.current,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 0.45 },
            "-=1.2"
        )
        .fromTo(aboutRef.current,
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1 },
            "-=1.3"
        );
    }, { scope: containerRef });

    // 2. Subtle Mouse & Gyroscope Parallax
    useGSAP(() => {
        // Desktop Mouse Interaction
        const handleMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e;
            const xPos = (clientX / window.innerWidth - 0.5) * 15; 
            const yPos = (clientY / window.innerHeight - 0.5) * 15;

            gsap.to(gridRef.current, {
                x: xPos,
                y: yPos,
                duration: 2,
                ease: "power2.out",
                force3D: true // Ensure GPU smooth parallax
            });
        };

        // Mobile Gyroscope (Tilt-Shift) Interaction
        const handleOrientation = (e: DeviceOrientationEvent) => {
            if (e.gamma === null || e.beta === null) return;
            
            // gamma: left-to-right tilt (-90 to 90)
            // beta: front-to-back tilt (-180 to 180) -> Assuming 45deg is neutral viewing angle
            const gamma = Math.max(-45, Math.min(45, e.gamma)); 
            const beta = Math.max(0, Math.min(90, e.beta)) - 45; 

            // Convert tilt degrees to pixel shifts (max 15px)
            const xPos = (gamma / 45) * 15; 
            const yPos = (beta / 45) * 15;

            gsap.to(gridRef.current, {
                x: xPos,
                y: yPos,
                duration: 1.5, // Slightly faster response for hardware sensors
                ease: "power2.out",
                force3D: true
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('deviceorientation', handleOrientation, { passive: true });

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('deviceorientation', handleOrientation);
        };
    }, { scope: containerRef });

    return (
        <section ref={containerRef} className={styles.hero}>
            {/* ── Background Video ── */}
            <video
                autoPlay
                muted
                loop
                playsInline
                className={styles.video}
            >
                <source src="/videos/nebula6.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            {/* ── Cinematic Blur Overlay ── */}
            <div className={styles.blurOverlay} />

            {/* ── Architectural 2x2 Grid ── */}
            <div ref={gridRef} className={styles.gridContainer}>

                {/* 1. Top Left: Identity */}
                <div className={styles.gridItemTopLeft}>
                    <h1 ref={titleRef} className={styles.title}>MOHAMED SALEH</h1>
                    <div ref={separatorRef} className={styles.separator} />
                    <p ref={subtitleRef} className={styles.subtitle}>CRAFTED CODE</p>
                </div>

                {/* 2. Top Right: Empty Space */}
                <div className={styles.gridItemEmpty} />

                {/* 3. Bottom Left: Empty Space */}
                <div className={styles.gridItemEmpty} />

                {/* 4. Bottom Right: About Me Section ── */}
                <div className={styles.gridItemBottomRight}>
                    <div ref={aboutRef} className={styles.aboutContent}>
                        <h2 className={styles.aboutHeader}>ABOUT ME</h2>
                        <p className={styles.aboutText}>
                            A developer focused on high-end digital experiences.
                            Crafting clean code and cinematic interfaces with
                            a passion for modern web architecture and seamless animations.
                        </p>
                    </div>
                </div>

            </div>
        </section>
    );
}
