"use client";

/**
 * DotGrid — شبکه‌ی نقطه‌ای canvas برای هیرو
 *
 * - ماوس: با pointer events دنبال می‌شه.
 * - موبایل: با touch events دنبال می‌شه (pointer events موقع اسکرول
 *   با pointercancel قطع می‌شن، برای همین لمس جدا هندل شده).
 * - فقط نقطه‌های «فعال» آپدیت می‌شن؛ وقتی همه آروم شدن، حلقه متوقف می‌شه.
 * - وقتی هیرو توی دید نیست، انیمیشن خاموشه.
 * - با prefers-reduced-motion فقط یه شبکه‌ی ثابت رسم می‌شه.
 * - رنگ نقطه‌ها از `color` والد (CSS) گرفته می‌شه.
 * - `edgeFade`: عرض محو شدن لبه‌ها (روی صفحه‌های کوچیک خودکار کمتر می‌شه).
 * - دافعه‌ی بیرونی (مثلاً دایره‌ی اسکرول):
 *     gridRef.current?.setRepeller({ x, y, radius })   // نسبت به هیرو
 *     gridRef.current?.setRepeller(null)
 */

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

export type Repeller = { x: number; y: number; radius: number };

export type DotGridHandle = {
    setRepeller: (repeller: Repeller | null) => void;
};

type Props = {
    /** عرض ناحیه‌ی محو شدن لبه‌ها (px) */
    edgeFade?: number;
    /** فاصله‌ی نقطه‌ها (px) */
    spacing?: number;
    /** شعاع هر نقطه (px) */
    dotRadius?: number;
    /** شعاع اثر ماوس (px) */
    influence?: number;
    /** ضریب بزرگ‌تر شدن شعاع اثر برای لمس (انگشت جلوی نقطه‌ها رو می‌گیره) */
    touchScale?: number;
    /** بیشترین جابه‌جایی نقطه‌ها (px) */
    push?: number;
    /** شفافیت عادی نقطه‌ها */
    baseAlpha?: number;
    /** شفافیت نقطه‌ها وقتی درست زیر ماوس هستن */
    minAlpha?: number;
    /** رفتار: کنار رفتن، محو شدن، یا هر دو */
    mode?: "push" | "fade" | "both";
    className?: string;
};

const DotGrid = forwardRef<DotGridHandle, Props>(function DotGrid(
    {
        spacing = 28,
        dotRadius = 1.4,
        influence = 130,
        touchScale = 1.3,
        push = 22,
        baseAlpha = 0.35,
        minAlpha = 0,
        mode = "both",
        edgeFade = 80,
        className,
    },
    ref
) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const wakeRef = useRef<() => void>(() => {});
    const externalRef = useRef<Repeller | null>(null);

    useImperativeHandle(ref, () => ({
        setRepeller(repeller) {
            externalRef.current = repeller;
            wakeRef.current();
        },
    }));

    // min(..., 25%) باعث می‌شه روی صفحه‌ی کوچیک موبایل محو شدن کل شبکه رو نخوره
    const fade = `min(${edgeFade}px, 25%)`;
    const mask = `linear-gradient(to right, transparent, #000 ${fade}, #000 calc(100% - ${fade}), transparent),
    linear-gradient(to bottom, transparent, #000 ${fade}, #000 calc(100% - ${fade}), transparent)`;

    useEffect(() => {
        const canvas = canvasRef.current;
        const host = canvas?.parentElement;
        const ctx = canvas?.getContext("2d");
        if (!canvas || !host || !ctx) return;

        const reduceMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        let w = 0;
        let h = 0;
        let cols = 0;
        let count = 0;
        let bx = new Float32Array(0); // موقعیت پایه
        let by = new Float32Array(0);
        let ox = new Float32Array(0); // جابه‌جایی فعلی
        let oy = new Float32Array(0);
        let alpha = new Float32Array(0);
        let isActive = new Uint8Array(0);
        const active = new Set<number>();

        let pointer: Repeller | null = null;
        let raf = 0;
        let visible = true;
        let color = "#888";

        const readColor = () => {
            color = getComputedStyle(canvas).color || color;
        };

        const build = () => {
            const rect = host.getBoundingClientRect();
            w = rect.width;
            h = rect.height;
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = Math.round(w * dpr);
            canvas.height = Math.round(h * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            cols = Math.max(1, Math.floor(w / spacing));
            const rows = Math.max(1, Math.floor(h / spacing));
            count = cols * rows;
            // شبکه وسط هیرو قرار می‌گیره
            const padX = (w - (cols - 1) * spacing) / 2;
            const padY = (h - (rows - 1) * spacing) / 2;

            bx = new Float32Array(count);
            by = new Float32Array(count);
            ox = new Float32Array(count);
            oy = new Float32Array(count);
            alpha = new Float32Array(count).fill(baseAlpha);
            isActive = new Uint8Array(count);
            active.clear();

            for (let i = 0; i < count; i++) {
                bx[i] = padX + (i % cols) * spacing;
                by[i] = padY + Math.floor(i / cols) * spacing;
            }
            readColor();
            draw();
        };

        const draw = () => {
            ctx.clearRect(0, 0, w, h);
            ctx.fillStyle = color;

            // نقطه‌های آروم: همه با هم توی یک path
            ctx.globalAlpha = baseAlpha;
            ctx.beginPath();
            for (let i = 0; i < count; i++) {
                if (isActive[i]) continue;
                ctx.moveTo(bx[i] + dotRadius, by[i]);
                ctx.arc(bx[i], by[i], dotRadius, 0, Math.PI * 2);
            }
            ctx.fill();

            // نقطه‌های فعال: هرکدوم با شفافیت خودش
            active.forEach((i) => {
                if (alpha[i] < 0.02) return;
                ctx.globalAlpha = alpha[i];
                ctx.beginPath();
                ctx.arc(bx[i] + ox[i], by[i] + oy[i], dotRadius, 0, Math.PI * 2);
                ctx.fill();
            });
            ctx.globalAlpha = 1;
        };

        const markNear = (s: Repeller) => {
            const c0 = Math.max(0, Math.floor((s.x - s.radius - bx[0]) / spacing));
            const c1 = Math.min(
                cols - 1,
                Math.ceil((s.x + s.radius - bx[0]) / spacing)
            );
            const r0 = Math.max(0, Math.floor((s.y - s.radius - by[0]) / spacing));
            const r1 = Math.ceil((s.y + s.radius - by[0]) / spacing);
            for (let r = r0; r <= r1; r++) {
                for (let c = c0; c <= c1; c++) {
                    const i = r * cols + c;
                    if (i < 0 || i >= count) continue;
                    if (!isActive[i]) {
                        isActive[i] = 1;
                        active.add(i);
                    }
                }
            }
        };

        const tick = () => {
            raf = 0;
            const sources: Repeller[] = [];
            if (pointer) sources.push(pointer);
            if (externalRef.current) sources.push(externalRef.current);
            sources.forEach(markNear);

            const doPush = mode !== "fade";
            const doFade = mode !== "push";

            active.forEach((i) => {
                let tx = 0;
                let ty = 0;
                let ta = baseAlpha;

                for (const s of sources) {
                    const dx = bx[i] - s.x;
                    const dy = by[i] - s.y;
                    const d = Math.hypot(dx, dy);
                    if (d >= s.radius) continue;
                    const t = 1 - d / s.radius;
                    const e = t * t;
                    if (doPush && d > 0.001) {
                        tx += (dx / d) * e * push;
                        ty += (dy / d) * e * push;
                    }
                    if (doFade) {
                        ta = Math.min(ta, baseAlpha + (minAlpha - baseAlpha) * e);
                    }
                }

                ox[i] += (tx - ox[i]) * 0.14;
                oy[i] += (ty - oy[i]) * 0.14;
                alpha[i] += (ta - alpha[i]) * 0.14;

                const settled =
                    Math.abs(ox[i]) < 0.05 &&
                    Math.abs(oy[i]) < 0.05 &&
                    Math.abs(alpha[i] - baseAlpha) < 0.01 &&
                    tx === 0 &&
                    ty === 0 &&
                    ta === baseAlpha;
                if (settled) {
                    ox[i] = 0;
                    oy[i] = 0;
                    alpha[i] = baseAlpha;
                    isActive[i] = 0;
                    active.delete(i);
                }
            });

            draw();

            if (visible && (active.size > 0 || sources.length > 0)) {
                raf = requestAnimationFrame(tick);
            }
        };

        const wake = () => {
            if (reduceMotion || !visible || raf) return;
            readColor();
            raf = requestAnimationFrame(tick);
        };
        wakeRef.current = wake;

        const setPointer = (clientX: number, clientY: number, radius: number) => {
            const rect = canvas.getBoundingClientRect();
            pointer = { x: clientX - rect.left, y: clientY - rect.top, radius };
            wake();
        };
        const clearPointer = () => {
            pointer = null;
            wake();
        };

        // ماوس / قلم — لمس رو نادیده می‌گیره چون موقع اسکرول pointercancel می‌شه
        const onPointerMove = (e: PointerEvent) => {
            if (e.pointerType === "touch") return;
            setPointer(e.clientX, e.clientY, influence);
        };
        const onPointerLeave = (e: PointerEvent) => {
            if (e.pointerType === "touch") return;
            clearPointer();
        };

        // لمس — touchmove موقع اسکرول هم ادامه پیدا می‌کنه
        const onTouch = (e: TouchEvent) => {
            const t = e.touches[0];
            if (!t) return;
            setPointer(t.clientX, t.clientY, influence * touchScale);
        };

        const ro = new ResizeObserver(build);
        ro.observe(host);

        const io = new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting;
            if (visible) wake();
            else if (raf) {
                cancelAnimationFrame(raf);
                raf = 0;
            }
        });
        io.observe(host);

        if (!reduceMotion) {
            host.addEventListener("pointermove", onPointerMove, { passive: true });
            host.addEventListener("pointerleave", onPointerLeave);
            host.addEventListener("touchstart", onTouch, { passive: true });
            host.addEventListener("touchmove", onTouch, { passive: true });
            host.addEventListener("touchend", clearPointer, { passive: true });
            host.addEventListener("touchcancel", clearPointer, { passive: true });
        }

        return () => {
            ro.disconnect();
            io.disconnect();
            if (raf) cancelAnimationFrame(raf);
            host.removeEventListener("pointermove", onPointerMove);
            host.removeEventListener("pointerleave", onPointerLeave);
            host.removeEventListener("touchstart", onTouch);
            host.removeEventListener("touchmove", onTouch);
            host.removeEventListener("touchend", clearPointer);
            host.removeEventListener("touchcancel", clearPointer);
            wakeRef.current = () => {};
        };
    }, [spacing, dotRadius, influence, touchScale, push, baseAlpha, minAlpha, mode]);

    return (
        <canvas
            ref={canvasRef}
            aria-hidden="true"
            className={className}
            style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
                maskImage: mask,
                WebkitMaskImage: mask,
                maskComposite: "intersect",
                WebkitMaskComposite: "source-in",
            }}
        />
    );
});

export default DotGrid;