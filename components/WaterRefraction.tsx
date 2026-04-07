'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function WaterRefraction() {
    const filterRef = useRef<SVGFEDisplacementMapElement>(null);
    const turbulenceRef = useRef<SVGFETurbulenceElement>(null);
    const mouseRef = useRef({ x: 0, y: 0, v: 0 });

    useEffect(() => {
        const filter = filterRef.current;
        const turbulence = turbulenceRef.current;
        if (!filter || !turbulence) return;

        // 1. Initial State
        gsap.set(filter, { attr: { scale: 0 } });

        let lastX = 0;
        let lastY = 0;
        let velocity = 0;

        // 2. Track Mouse Velocity for Refraction Intensity
        const onMouseMove = (e: MouseEvent) => {
            const dx = e.clientX - lastX;
            const dy = e.clientY - lastY;
            velocity = Math.sqrt(dx * dx + dy * dy);

            lastX = e.clientX;
            lastY = e.clientY;

            // Update mouse ref for potential positional logic
            mouseRef.current = { x: e.clientX, y: e.clientY, v: velocity };

            // React to movement: Spike the displacement scale
            gsap.to(filter, {
                attr: { scale: Math.min(velocity * 1.5, 80) }, // Cap the intensity
                duration: 0.2,
                ease: "power2.out"
            });

            // Settle back to calm
            gsap.to(filter, {
                attr: { scale: 0 },
                duration: 1.2,
                delay: 0.1,
                ease: "sine.inOut"
            });
        };

        // 3. Subtle "Organic" Baseline Movement
        gsap.to(turbulence, {
            attr: { baseFrequency: "0.015 0.02" },
            repeat: -1,
            yoyo: true,
            duration: 10,
            ease: "sine.inOut"
        });

        window.addEventListener('mousemove', onMouseMove);
        return () => window.removeEventListener('mousemove', onMouseMove);
    }, []);

    return (
        <svg style={{ position: 'absolute', width: 0, height: 0 }}>
            <filter id="water-refraction">
                <feTurbulence 
                    ref={turbulenceRef}
                    type="fractalNoise" 
                    baseFrequency="0.01 0.01" 
                    numOctaves="2" 
                    result="noise" 
                />
                <feDisplacementMap 
                    ref={filterRef}
                    in="SourceGraphic" 
                    in2="noise" 
                    scale="0" 
                    xChannelSelector="R" 
                    yChannelSelector="G" 
                />
            </filter>
        </svg>
    );
}
