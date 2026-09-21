"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const ScrollThread = dynamic(() => import("./scrollThread"), { ssr: false });

const ScrollSnakeLoader = () => {
    const [shouldLoad, setShouldLoad] = useState(false);

    useEffect(() => {
        if (shouldLoad) return;
        const onScroll = () => {
            setShouldLoad(true);
            window.removeEventListener("scroll", onScroll);
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, [shouldLoad]);

    return shouldLoad ? <ScrollThread /> : null;
};

export default ScrollSnakeLoader;