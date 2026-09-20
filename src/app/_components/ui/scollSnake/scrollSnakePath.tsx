"use client";
import { useEffect, useState } from "react";
import { measureSnakePoints, pointsToPathD, SnakePoint } from "./scrollSnakePath2";

const ScrollSnakePath = () => {
    const [points, setPoints] = useState<SnakePoint[] | null>(null);

    useEffect(() => {
        const measure = () => setPoints(measureSnakePoints());
        measure();
        window.addEventListener("resize", measure);
        window.addEventListener("load", measure);
        return () => {
            window.removeEventListener("resize", measure);
            window.removeEventListener("load", measure);
        };
    }, []);

    if (!points || points.length === 0) return null;

    const height = points[points.length - 1].y;

    return (
        <svg
            className="pointer-events-none fixed left-0 top-0 z-[-1] hidden md:block"
            width="100%"
            height={height}
            style={{ position: "absolute" }}
        >
            <path
                d={pointsToPathD(points)}
                fill="none"
                stroke="white"
                strokeWidth={2}
                strokeOpacity={0.5}
            />
        </svg>
    );
};

export default ScrollSnakePath;