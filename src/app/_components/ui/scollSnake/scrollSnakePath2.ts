export interface SnakePoint {
    x: number;
    y: number;
}

const SECTION_ORDER = [
    { id: "about", side: "right" as const },
    { id: "services", side: "left" as const },
    { id: "works", side: "right" as const },
    { id: "contactMe", side: "left" as const },
];

const OFFSET = 48;

export function measureSnakePoints(): SnakePoint[] | null {
    const main = document.querySelector("main");
    if (!main) return null;
    const mainRect = main.getBoundingClientRect();

    const leftX = mainRect.left - OFFSET;
    const rightX = mainRect.left + mainRect.width + OFFSET;

    const points: SnakePoint[] = [];

    SECTION_ORDER.forEach(({ id, side }, index) => {
        const el = document.getElementById(id);
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const x = side === "right" ? rightX : leftX;

        const topY =
            index === 0
                ? rect.top + window.scrollY + rect.height / 2
                : rect.top + window.scrollY;
        const bottomY = rect.top + window.scrollY + rect.height;

        points.push({ x, y: topY });
        points.push({ x, y: bottomY });
    });

    return points;
}

// منحنی S-شکل: شیب صفر در ابتدا و انتها، بدون جهش ناگهانی در تغییر جهت
function smoothstep(t: number): number {
    const clamped = Math.min(Math.max(t, 0), 1);
    return clamped * clamped * (3 - 2 * clamped);
}

export function interpolateX(points: SnakePoint[], y: number): number {
    if (points.length === 0) return 0;
    const first = points[0];
    const last = points[points.length - 1];
    const clampedY = Math.min(Math.max(y, first.y), last.y);

    for (let i = 0; i < points.length - 1; i++) {
        const a = points[i];
        const b = points[i + 1];
        if (clampedY >= a.y && clampedY <= b.y) {
            const t = (clampedY - a.y) / (b.y - a.y || 1);
            const eased = smoothstep(t);
            return a.x + (b.x - a.x) * eased;
        }
    }
    return last.x;
}

export function pointsToPathD(points: SnakePoint[], samplesPerSegment = 20): string {
    if (points.length === 0) return "";
    if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

    let d = `M ${points[0].x} ${points[0].y}`;

    for (let i = 0; i < points.length - 1; i++) {
        const a = points[i];
        const b = points[i + 1];
        for (let s = 1; s <= samplesPerSegment; s++) {
            const t = s / samplesPerSegment;
            const eased = t * t * (3 - 2 * t);
            const x = a.x + (b.x - a.x) * eased;
            const y = a.y + (b.y - a.y) * t;
            d += ` L ${x} ${y}`;
        }
    }

    return d;
}