"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
    const cursorRef = useRef<HTMLDivElement>(null);
    const mousePosition = useRef({ x: 0, y: 0 });
    const currentPosition = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            mousePosition.current = {
                x: event.clientX,
                y: event.clientY,
            };
        };

        window.addEventListener("mousemove", handleMouseMove);

        let animationFrame: number;

        const animate = () => {
            const current = currentPosition.current;
            const target = mousePosition.current;

            current.x += (target.x - current.x) * 0.15;
            current.y += (target.y - current.y) * 0.15;

            if (cursorRef.current) {
                cursorRef.current.style.transform = `translate3d(${current.x}px, ${current.y}px, 0)`;
            }

            animationFrame = requestAnimationFrame(animate);
        };

        animationFrame = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            cancelAnimationFrame(animationFrame);
        };
    }, []);

    return (
        <div
            ref={cursorRef}
            aria-hidden="true"
            className="pointer-events-none fixed left-0 top-0 z-[9999] hidden md:block
                h-4
                w-4
                -translate-x-1/2
                -translate-y-1/2 rounded-full border border-white/70 bg-white/10 backdrop-blur-sm"
        />
    );
}