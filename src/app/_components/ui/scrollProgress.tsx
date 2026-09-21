"use client"
import { useEffect, useRef } from "react";

const ScrollProgress = () => {
    const progressRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let ticking = false;

        const updateProgress = () => {
            const scrollTop = window.scrollY;
            const scrollHeight =
                document.documentElement.scrollHeight - window.innerHeight;

            const progress =
                scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

            if (progressRef.current) {
                progressRef.current.style.width = `${progress}%`;
            }

            ticking = false;
        };

        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(updateProgress);
                ticking = true;
            }
        };

        updateProgress();

        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <div className="fixed top-0 left-0 z-[9999] h-[2px] w-full">
            <div
                ref={progressRef}
                className="h-full bg-primary transition"
                style={{ width: "0%" }}
            />
        </div>
    );
};

export default ScrollProgress;