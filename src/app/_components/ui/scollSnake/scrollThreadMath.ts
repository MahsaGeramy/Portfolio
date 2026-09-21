export interface ThreadNode {
    id: string;
    /** مرکز عنوان بخش، نسبت به بالای main */
    y: number;
}

export interface ThreadLayout {
    width: number;
    height: number;
    /** مسیر اصلی (از روش سرِ نخ حرکت می‌کنه) */
    d: string;
    /** مسیر دوم، خیلی کم‌رنگ، برای حس خط‌خطیِ مداد */
    sketchD: string;
    nodes: ThreadNode[];
}

type Pt = { x: number; y: number };

const SECTIONS: { id: string; side: "left" | "right" }[] = [
    { id: "about", side: "right" },
    { id: "services", side: "left" },
    { id: "works", side: "right" },
    { id: "contactMe", side: "left" },
];

/** حداقل عرض حاشیه (px) که نخ توش جا بشه؛ کمتر از این نخ نمایش داده نمی‌شه */
const MIN_GUTTER = 40;
/** فاصله‌ی نمونه‌برداری روی محور y */
const STEP = 22;

function mulberry32(seed: number) {
    return function () {
        seed |= 0;
        seed = (seed + 0x6d2b79f5) | 0;
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

const clamp01 = (n: number) => Math.min(Math.max(n, 0), 1);

const smoother = (t: number) => {
    const c = clamp01(t);
    return c * c * c * (c * (c * 6 - 15) + 10);
};

/** فاصله‌ی عمودی المان تا بالای root؛ از offsetTop استفاده می‌کنه تا transform انیمیشن‌ها (مثل Reveal) خطا نندازن */
function yIn(el: HTMLElement, root: HTMLElement, rootRect: DOMRect): number {
    let y = 0;
    let node: HTMLElement | null = el;
    while (node && node !== root) {
        y += node.offsetTop;
        node = node.offsetParent as HTMLElement | null;
    }
    if (node === root) return y;
    return el.getBoundingClientRect().top - rootRect.top;
}

function toBezier(p: Pt[]): string {
    if (p.length < 2) return "";
    const f = (n: number) => n.toFixed(1);
    let d = `M ${f(p[0].x)} ${f(p[0].y)}`;
    for (let i = 0; i < p.length - 1; i++) {
        const p0 = p[i - 1] ?? p[i];
        const p1 = p[i];
        const p2 = p[i + 1];
        const p3 = p[i + 2] ?? p2;
        const c1x = p1.x + (p2.x - p0.x) / 6;
        const c1y = p1.y + (p2.y - p0.y) / 6;
        const c2x = p2.x - (p3.x - p1.x) / 6;
        const c2y = p2.y - (p3.y - p1.y) / 6;
        d += ` C ${f(c1x)} ${f(c1y)} ${f(c2x)} ${f(c2y)} ${f(p2.x)} ${f(p2.y)}`;
    }
    return d;
}

type Key = { x: number; y: number };

// function buildPath(keys: Key[], amp: number, seed: number): string {
//     const rnd = mulberry32(seed);
//     const p1 = rnd() * Math.PI * 2;
//     const p2 = rnd() * Math.PI * 2;
//     const p3 = rnd() * Math.PI * 2;
//
//     const startY = keys[0].y;
//     const endY = keys[keys.length - 1].y;
//     const pts: Pt[] = [];
//
//     let k = 0;
//     for (let y = startY; ; y += STEP) {
//         const yy = Math.min(y, endY);
//         while (k < keys.length - 2 && yy > keys[k + 1].y) k++;
//         const a = keys[k];
//         const b = keys[k + 1];
//
//         let x = a.x;
//         if (a.x !== b.x) {
//             const t = clamp01((yy - a.y) / (b.y - a.y || 1));
//             const dir = Math.sign(b.x - a.x);
//             // عبور نرم به طرف دیگه + یه «عقب‌کشیدن و پیش‌رفتنِ» کوچیک مثل حرکت دست
//             x =
//                 a.x +
//                 (b.x - a.x) * smoother(t) -
//                 dir * amp * 0.35 * Math.sin(Math.PI * 2 * t);
//         }
//
//         // موج آروم + موج ریزتر + لرزش خیلی کم دست
//         const wobble =
//             0.5 * Math.sin(yy / 140 + p1) +
//             0.3 * Math.sin(yy / 57 + p2) +
//             0.2 * Math.sin(yy / 23 + p3);
//         x += wobble * amp * 0.65 + (rnd() - 0.5) * 1.6;
//
//         pts.push({ x, y: yy + (rnd() - 0.5) * 2 });
//         if (yy >= endY) break;
//     }
//     return toBezier(pts);
// }

function buildPath(keys: Key[]): string {
    if (keys.length < 2) return "";

    const x = keys[0].x;

    return `M ${x.toFixed(1)} ${keys[0].y.toFixed(1)}
            L ${x.toFixed(1)} ${keys[keys.length - 1].y.toFixed(1)}`;
}

export function measureLayout(): ThreadLayout | null {
    const main = document.querySelector("main") as HTMLElement | null;
    if (!main) return null;

    const mainRect = main.getBoundingClientRect();
    const viewportW = document.documentElement.clientWidth;
    const gutterL = mainRect.left;
    const gutterR = viewportW - mainRect.right;
    const gutter = Math.min(gutterL, gutterR);
    if (gutter < MIN_GUTTER) return null;

    // نخ (موج + عبور) همیشه داخل حاشیه می‌مونه
    const amp = Math.min(26, gutter / 2 - 8);
    const leftX = -gutterL / 2;
    const rightX = mainRect.width + gutterR / 2;

    const keys: Key[] = [];
    const nodes: ThreadNode[] = [];

    for (const { id, side } of SECTIONS) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = yIn(el, main, mainRect);
        const bottom = top + el.offsetHeight;
        // const x = side === "right" ? rightX : leftX;
        // keys.push({ x, y: top }, { x, y: bottom });
        const x = leftX;
        keys.push({ x, y: top }, { x, y: bottom });

        const title = el.querySelector("p") as HTMLElement | null;
        const ty = title
            ? yIn(title, main, mainRect) + Math.min(title.offsetHeight / 2, 22)
            : top + 24;
        nodes.push({ id, y: ty });
    }
    if (keys.length < 2) return null;

    return {
        width: mainRect.width,
        height: mainRect.height,
        // d: buildPath(keys, amp, 7),
        // sketchD: buildPath(keys, amp * 0.9, 21),
        d: buildPath(keys),
        sketchD: buildPath(keys),
        nodes,
    };
}

export function sameLayout(a: ThreadLayout | null, b: ThreadLayout | null): boolean {
    if (a === b) return true;
    if (!a || !b) return false;
    return (
        a.d === b.d &&
        a.width === b.width &&
        a.height === b.height &&
        a.nodes.length === b.nodes.length &&
        a.nodes.every((n, i) => n.y === b.nodes[i].y)
    );
}

/** جدول تبدیل «y» به «طول روی مسیر» */
export interface Lut {
    ys: Float32Array;
    ls: Float32Array;
    total: number;
}

export function buildLut(path: SVGPathElement, samples = 700): Lut {
    const total = path.getTotalLength();
    const ys = new Float32Array(samples + 1);
    const ls = new Float32Array(samples + 1);
    let maxY = -Infinity;
    for (let i = 0; i <= samples; i++) {
        const l = (total * i) / samples;
        const pt = path.getPointAtLength(l);
        // ماکسیمم تجمعی: حتی با لرزش ریز y جدول یکنواخت می‌مونه
        maxY = Math.max(maxY, pt.y);
        ys[i] = maxY;
        ls[i] = l;
    }
    return { ys, ls, total };
}

export function lengthAtY(lut: Lut, y: number): number {
    const { ys, ls } = lut;
    const n = ys.length;
    if (y <= ys[0]) return 0;
    if (y >= ys[n - 1]) return lut.total;
    let lo = 0;
    let hi = n - 1;
    while (hi - lo > 1) {
        const mid = (lo + hi) >> 1;
        if (ys[mid] <= y) lo = mid;
        else hi = mid;
    }
    const span = ys[hi] - ys[lo];
    const t = span > 0 ? (y - ys[lo]) / span : 0;
    return ls[lo] + (ls[hi] - ls[lo]) * t;
}