'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import styles from '@/styles/CustomCursor.module.css';

export default function CustomCursor() {
    const cursorRef = useRef<HTMLDivElement>(null);
    const followerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const cursor = cursorRef.current;
        const follower = followerRef.current;

        if (!cursor || !follower) return;

        // 1. Mouse Movement Tracking
        const onMouseMove = (e: MouseEvent) => {
            const { clientX: x, clientY: y } = e;

            // Immediate dot follow
            gsap.to(cursor, {
                x: x,
                y: y,
                duration: 0, 
            });

            // Smooth circle lag follow
            gsap.to(follower, {
                x: x,
                y: y,
                duration: 0.5,
                ease: "power2.out"
            });
        };

        // 2. Hover Interactions
        const onMouseEnter = () => {
            gsap.to(follower, {
                scale: 2.5,
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                borderColor: "rgba(255, 255, 255, 0.8)",
                duration: 0.3
            });
            gsap.to(cursor, {
                scale: 0,
                duration: 0.2
            });
        };

        const onMouseLeave = () => {
            gsap.to(follower, {
                scale: 1,
                backgroundColor: "transparent",
                borderColor: "rgba(255, 255, 255, 0.4)",
                duration: 0.3
            });
            gsap.to(cursor, {
                scale: 1,
                duration: 0.2
            });
        };

        // Attach listeners to all interactive elements
        const interactiveElements = document.querySelectorAll('a, button, [role="button"]');
        
        interactiveElements.forEach((el) => {
            el.addEventListener('mouseenter', onMouseEnter);
            el.addEventListener('mouseleave', onMouseLeave);
        });

        window.addEventListener('mousemove', onMouseMove);

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            interactiveElements.forEach((el) => {
                el.removeEventListener('mouseenter', onMouseEnter);
                el.removeEventListener('mouseleave', onMouseLeave);
            });
        };
    }, []);

    return (
        <div className={styles.cursorWrapper}>
            <div ref={cursorRef} className={styles.cursorDot} />
            <div ref={followerRef} className={styles.cursorFollower} />
        </div>
    );
}
