"use client";
import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import {ChevronLeft, ChevronRight} from "lucide-react";

interface SliderWrapperProps {
    targetId: string;
    children: React.ReactNode;
    showNavigationButtons?: boolean;
}

export default function SliderWrapper({
                                          targetId,
                                          children,
                                          showNavigationButtons = true,
                                      }: SliderWrapperProps) {
    const isDown = useRef(false);
    const startX = useRef(0);
    const scrollLeft = useRef(0);
    const [showControls, setShowControls] = useState(false);

    useEffect(() => {
        const slider = document.getElementById(targetId);
        if (!slider) return;

        const handleMouseDown = (e: MouseEvent) => {
            isDown.current = true;
            startX.current = e.pageX - slider.offsetLeft;
            scrollLeft.current = slider.scrollLeft;
        };

        const handleMouseLeave = () => (isDown.current = false);
        const handleMouseUp = () => (isDown.current = false);

        const handleMouseMove = (e: MouseEvent) => {
            if (!isDown.current) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX.current) * 2;
            slider.scrollLeft = scrollLeft.current - walk;
        };

        slider.addEventListener("mousedown", handleMouseDown);
        slider.addEventListener("mouseleave", handleMouseLeave);
        slider.addEventListener("mouseup", handleMouseUp);
        slider.addEventListener("mousemove", handleMouseMove);

        return () => {
            slider.removeEventListener("mousedown", handleMouseDown);
            slider.removeEventListener("mouseleave", handleMouseLeave);
            slider.removeEventListener("mouseup", handleMouseUp);
            slider.removeEventListener("mousemove", handleMouseMove);
        };
    }, [targetId]);

    useEffect(() => {
        const checkScrollable = () => {
            const el = document.getElementById(targetId);
            if (el) {
                setShowControls(el.scrollWidth > el.clientWidth);
            }
        };

        checkScrollable();
        window.addEventListener("resize", checkScrollable);
        return () => window.removeEventListener("resize", checkScrollable);
    }, [targetId]);

    return (
        <div className="w-full relative">
            {showControls && showNavigationButtons && (
                <>
                    <div className="absolute top-1/2 -translate-y-1/2 right-3 z-10">
                        <button
                            onClick={() => {
                                const el = document.getElementById(targetId);
                                if (el) el.scrollLeft += 250;
                            }}
                            className="cursor-pointer flex justify-center items-center w-[3rem] h-[3rem] p-[.9rem] bg-white/40 shadow-md rounded-full"
                        >
                            <ChevronRight size={25} color="black"/>
                        </button>
                    </div>
                    <div className="absolute top-1/2 -translate-y-1/2 left-3 z-10">
                        <button
                            onClick={() => {
                                const el = document.getElementById(targetId);
                                if (el) el.scrollLeft -= 250;
                            }}
                            className="cursor-pointer flex justify-center items-center w-[3rem] h-[3rem] p-[.9rem] bg-white/40 shadow-md rounded-full"
                        >
                            <ChevronLeft size={25} color="black"/>
                        </button>
                    </div>
                </>
            )}
            {children}
        </div>
    );
}
