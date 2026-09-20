"use client";
import { useEffect, useRef } from "react";
import { measureSnakePoints, interpolateX, SnakePoint } from "./scrollSnakePath2";

const ScrollSnake = () => {
    const ballRef = useRef<HTMLDivElement>(null);
    const pointsRef = useRef<SnakePoint[] | null>(null);
    const rafId = useRef<number | null>(null);

    useEffect(() => {
        const measure = () => {
            pointsRef.current = measureSnakePoints();
        };

        const update = () => {
            const points = pointsRef.current;
            const ball = ballRef.current;
            if (!points || points.length === 0 || !ball) return;

            const first = points[0];
            const last = points[points.length - 1];
            const viewportCenter = window.innerHeight / 2;
            const scrollY = window.scrollY;

            const freeWorldY = scrollY + viewportCenter;
            const clampedWorldY = Math.min(Math.max(freeWorldY, first.y), last.y);

            let screenY: number;
            if (freeWorldY < first.y) {
                screenY = first.y - scrollY;
            } else if (freeWorldY > last.y) {
                screenY = last.y - scrollY;
            } else {
                screenY = viewportCenter;
            }

            const x = interpolateX(points, clampedWorldY);

            ball.style.left = `${x}px`;
            ball.style.top = `${screenY}px`;
        };

        const onScroll = () => {
            if (rafId.current) return;
            rafId.current = requestAnimationFrame(() => {
                update();
                rafId.current = null;
            });
        };

        measure();
        update();

        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", measure);

        return () => {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", measure);
            if (rafId.current) cancelAnimationFrame(rafId.current);
        };
    }, []);

    return (
        <div
            ref={ballRef}
            className="fixed z-30 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full
        bg-[linear-gradient(135deg,var(--primary),#4d5ba7)]
        shadow-lg shadow-primary/40 pointer-events-none hidden md:block"
        />
    );
};

export default ScrollSnake;