"use client"
import { useEffect, useRef, useState } from "react";
import {
    buildLut,
    lengthAtY,
    measureLayout,
    sameLayout,
    Lut,
    ThreadLayout,
} from "./scrollThreadMath";

const TAU = 0.3;
const MAX_SPEED = 1500;
const EPS = 0.3;

const ScrollThread = () => {
    const [layout, setLayout] = useState<ThreadLayout | null>(null);

    const svgRef = useRef<SVGSVGElement>(null);
    const pathRef = useRef<SVGPathElement>(null);
    const headRef = useRef<SVGGElement>(null);
    const nodeRefs = useRef<(SVGGElement | null)[]>([]);

    useEffect(() => {
        let raf = 0;
        const measure = () => {
            raf = 0;
            const next = measureLayout();
            setLayout((prev) => (sameLayout(prev, next) ? prev : next));
        };
        const schedule = () => {
            if (!raf) raf = requestAnimationFrame(measure);
        };

        measure();

        const main = document.querySelector("main");
        const ro = new ResizeObserver(schedule);
        if (main) ro.observe(main);
        window.addEventListener("resize", schedule);
        window.addEventListener("load", schedule);

        return () => {
            ro.disconnect();
            window.removeEventListener("resize", schedule);
            window.removeEventListener("load", schedule);
            if (raf) cancelAnimationFrame(raf);
        };
    }, []);

    useEffect(() => {
        const svg = svgRef.current;
        const path = pathRef.current;
        const head = headRef.current;
        const main = document.querySelector("main");
        if (!layout || !svg || !path || !head || !main) return;

        const lut: Lut = buildLut(path);
        const total = lut.total;
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const mainDocTop = main.getBoundingClientRect().top + window.scrollY;

        path.style.strokeDasharray = `${total}`;

        const nodeLens = layout.nodes.map((n, i) => {
            const len = lengthAtY(lut, n.y);
            const pt = path.getPointAtLength(len);
            const inner = nodeRefs.current[i];
            (inner?.parentNode as SVGGElement | null)?.setAttribute(
                "transform",
                `translate(${pt.x.toFixed(1)} ${pt.y.toFixed(1)})`
            );
            return len;
        });

        let cur = 0;
        let target = 0;
        let raf = 0;
        let last = 0;
        const on: (boolean | undefined)[] = [];

        const apply = () => {
            const visible = cur > 0.5;
            path.style.strokeDashoffset = `${total - cur}`;
            path.style.opacity = visible ? "1" : "0";
            head.style.opacity = reduce ? "0" : visible ? "1" : "0";

            const pt = path.getPointAtLength(cur);
            head.setAttribute(
                "transform",
                `translate(${pt.x.toFixed(1)} ${pt.y.toFixed(1)})`
            );

            nodeLens.forEach((len, i) => {
                const isOn = cur >= len - 2;
                if (isOn === on[i]) return;
                on[i] = isOn;
                const el = nodeRefs.current[i];
                if (!el) return;
                el.style.opacity = isOn ? "1" : "0.28";
                el.style.transform = isOn ? "scale(1)" : "scale(0.55)";
            });
        };

        const updateTarget = () => {
            const vh = window.innerHeight;
            const maxScroll = document.documentElement.scrollHeight - vh;
            const p =
                maxScroll > 0
                    ? Math.min(Math.max(window.scrollY / maxScroll, 0), 1)
                    : 0;
            const probe = window.scrollY + vh * (0.4 + 0.6 * p) - mainDocTop;
            target = lengthAtY(lut, probe);
        };

        const tick = (now: number) => {
            raf = 0;
            if (!last) last = now;
            const dt = Math.min((now - last) / 1000, 0.05);
            last = now;

            const diff = target - cur;
            let step = diff * (1 - Math.exp(-dt / TAU));
            const cap = MAX_SPEED * dt;
            step = Math.max(-cap, Math.min(cap, step));
            cur += step;

            if (Math.abs(target - cur) < EPS) {
                cur = target;
                last = 0;
                apply();
                return;
            }
            apply();
            raf = requestAnimationFrame(tick);
        };

        const wake = () => {
            if (!raf) raf = requestAnimationFrame(tick);
        };

        const onScroll = () => {
            updateTarget();
            wake();
        };

        if (reduce) {
            cur = total;
        } else {
            updateTarget();
            cur = target;
        }
        apply();

        const fade = requestAnimationFrame(() => {
            svg.style.opacity = "1";
        });

        if (!reduce) {
            window.addEventListener("scroll", onScroll, { passive: true });
        }

        return () => {
            cancelAnimationFrame(fade);
            if (raf) cancelAnimationFrame(raf);
            window.removeEventListener("scroll", onScroll);
        };
    }, [layout]);

    if (!layout) return null;

    return (
        <svg
            ref={svgRef}
            aria-hidden="true"
            width={layout.width}
            height={layout.height}
            className="pointer-events-none absolute left-0 top-0 overflow-visible"
            style={{ opacity: 0, transition: "opacity 900ms ease" }}
        >
            <defs>
                <filter id="thread-glow" x="-100%" y="-100%" width="300%" height="300%">
                    <feGaussianBlur stdDeviation="5" />
                </filter>
            </defs>

            <path
                d={layout.sketchD}
                fill="none"
                stroke="#fff"
                strokeOpacity={0.05}
                strokeWidth={1}
                strokeLinecap="round"
            />

            <path
                d={layout.d}
                fill="none"
                stroke="#fff"
                strokeOpacity={0.1}
                strokeWidth={1.5}
                strokeLinecap="round"
            />

            <path
                ref={pathRef}
                d={layout.d}
                fill="none"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ stroke: "var(--primary)", opacity: 0 }}
            />

            {layout.nodes.map((n, i) => (
                <g key={n.id}>
                    <g
                        ref={(el) => {
                            nodeRefs.current[i] = el;
                        }}
                        style={{
                            opacity: 0.28,
                            transform: "scale(0.55)",
                            transformBox: "fill-box",
                            transformOrigin: "center",
                            transition:
                                "opacity 700ms ease, transform 700ms cubic-bezier(.34,1.56,.64,1)",
                        }}
                    >
                        <circle
                            r={9}
                            fill="none"
                            strokeWidth={1}
                            strokeOpacity={0.6}
                            style={{ stroke: "var(--primary)" }}
                        />
                        <circle r={3.5} style={{ fill: "var(--primary)" }} />
                    </g>
                </g>
            ))}

            <g ref={headRef} style={{ opacity: 0, transition: "opacity 500ms ease" }}>
                <circle
                    r={14}
                    fillOpacity={0.3}
                    filter="url(#thread-glow)"
                    style={{ fill: "var(--primary)" }}
                />
                <circle r={5} style={{ fill: "var(--primary)" }} />
                <circle r={2} fill="#fff" fillOpacity={0.9} />
            </g>
        </svg>
    );
};

export default ScrollThread;