'use client'
import { useEffect, useRef } from 'react';
import styles from '@/styles/Notfoundgame.module.css';

type GameState = 'waiting' | 'playing' | 'over';

interface Brick {
    x: number;
    y: number;
    alive: boolean;
}

interface Ball {
    x: number;
    y: number;
    vx: number;
    vy: number;
    r: number;
}

interface Debris {
    x: number;
    y: number;
    vx: number;
    vy: number;
    rot: number;
    vrot: number;
    size: number;
    life: number;
    maxLife: number;
}

interface Gift {
    x: number;
    y: number;
    vy: number;
    tier: number;
}

interface Paddle {
    x: number;
    y: number;
    w: number;
    h: number;
    margin: number;
}

interface ComboMilestone {
    count: number;
    tier: number;
}

interface ArtBox {
    x: number;
    y: number;
    w: number;
    h: number;
}

const BRICK = 3;
// const INK = '#1c1b18';
const BG = '#e7e3db';
const PIERCE_COLOR = '#b3402e';
const BALL_R = 4.5;
const BALL_SPEED = 6;
const BALL_CAP = 256;
const BASE_PADDLE_W = 90;
const PADDLE_MAX_W = BASE_PADDLE_W * 2;
const GIFT_SIZE = 20;
const PIERCE_DURATION = 7000;
const COMBO_MILESTONES: ComboMilestone[] = [
    { count: 3, tier: 1 },
    { count: 6, tier: 2 },
    { count: 10, tier: 3 },
    { count: 16, tier: 4 },
    { count: 24, tier: 5 },
    { count: 34, tier: 6 },
    { count: 46, tier: 7 },
    { count: 60, tier: 8 },
    { count: 76, tier: 9 },
    { count: 94, tier: 10 },
    { count: 114, tier: 11 },
    { count: 118, tier: 12 },
];
const RANDOM_TIER_POOL = [7, 8, 9, 10, 11];

function hexToRgb(hex: string): string {
    const clean = hex.replace('#', '');
    const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean;
    const bigint = parseInt(full, 16);
    return `${(bigint >> 16) & 255}, ${(bigint >> 8) & 255}, ${bigint & 255}`;
}

export default function NotFoundGame() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const comboRef = useRef<HTMLDivElement | null>(null);
    const pierceRef = useRef<HTMLDivElement | null>(null);
    const muteBtnRef = useRef<HTMLButtonElement | null>(null);
    const muteSlashRef = useRef<SVGPathElement | null>(null);
    const soundWavesRef = useRef<SVGPathElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const comboEl = comboRef.current;
        const pierceEl = pierceRef.current;
        const muteBtn = muteBtnRef.current;
        const muteSlash = muteSlashRef.current;
        const soundWaves = soundWavesRef.current;
        if (!canvas || !comboEl || !pierceEl || !muteBtn || !muteSlash || !soundWaves) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const INK = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || '#1c1b18';
        const INK_RGB = hexToRgb(INK);

        let cancelled = false;
        let rafId = 0;

        let dpr = Math.max(1, window.devicePixelRatio || 1);
        let W = 0;
        let H = 0;

        let bricks: Brick[] = [];
        let artBox: ArtBox = { x: 0, y: 0, w: 0, h: 0 };
        let balls: Ball[] = [];
        let debris: Debris[] = [];
        let gifts: Gift[] = [];
        let pierceUntil = 0;
        let aliveCount = 0;
        let totalCount = 0;
        let regenTimer = 0;
        let comboCount = 0;
        let comboUntil = 0;
        let comboVisibleUntil = 0;
        let milestoneIndex = 0;
        let nextRandomMilestone = 120;

        let gameState: GameState = 'waiting';

        const paddle: Paddle = {
            x: 0,
            y: 0,
            w: BASE_PADDLE_W,
            h: 7,
            margin: 40,
        };

        let audioCtx: AudioContext | null = null;
        let muted = false;

        function beep(freq: number, dur: number, gain: number) {
            if (muted) return;
            if (!audioCtx) {
                const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
                if (!AC) return;
                audioCtx = new AC();
            }
            if (audioCtx.state === 'suspended') audioCtx.resume();
            const osc = audioCtx.createOscillator();
            const g = audioCtx.createGain();
            osc.type = 'square';
            osc.frequency.value = freq;
            g.gain.value = gain;
            osc.connect(g).connect(audioCtx.destination);
            const now = audioCtx.currentTime;
            g.gain.setValueAtTime(gain, now);
            g.gain.exponentialRampToValueAtTime(0.001, now + dur);
            osc.start(now);
            osc.stop(now + dur);
        }

        function handleMuteClick(e: MouseEvent) {
            e.stopPropagation();
            muted = !muted;
            muteBtn!.setAttribute('aria-pressed', String(muted));
            muteSlash!.style.display = muted ? '' : 'none';
            soundWaves!.style.display = muted ? 'none' : '';
        }
        muteBtn.addEventListener('click', handleMuteClick);

        // ---------- brick field generation ----------
        function buildBrickField() {
            if (W <= 0 || H <= 0) return;
            const artW = Math.min(W * 0.82, 820);
            const artH = artW * 0.88;
            const artX = (W - artW) / 2;
            const artY = Math.max(26, H * 0.05);
            artBox = { x: artX, y: artY, w: artW, h: artH };

            const off = document.createElement('canvas');
            off.width = Math.ceil(artW);
            off.height = Math.ceil(artH);
            const octx = off.getContext('2d');
            if (!octx) return;
            octx.fillStyle = '#000';

            // sad face
            const faceR = artW * 0.082;
            const faceCX = artW / 2;
            const faceCY = faceR + artH * 0.045;
            const faceStroke = Math.max(2.5, artW * 0.015);

            octx.lineWidth = faceStroke;
            octx.strokeStyle = '#000';
            octx.beginPath();
            octx.arc(faceCX, faceCY, faceR, 0, Math.PI * 2);
            octx.stroke();

            // eyes (dots)
            const eyeOffX = faceR * 0.42;
            const eyeOffY = -faceR * 0.08;
            const eyeR = faceR * 0.14;
            [-1, 1].forEach((side) => {
                const ex = faceCX + side * eyeOffX;
                const ey = faceCY + eyeOffY;
                octx.beginPath();
                octx.arc(ex, ey, eyeR, 0, Math.PI * 2);
                octx.fill();
            });

            // frown
            const mouthW = faceR * 0.62;
            const mouthY = faceCY + faceR * 0.48;
            const mouthDrop = faceR * 0.34;
            octx.lineWidth = Math.max(2.2, faceStroke * 0.8);
            octx.lineCap = 'round';
            octx.beginPath();
            octx.moveTo(faceCX - mouthW, mouthY - mouthDrop * 0.15);
            octx.quadraticCurveTo(faceCX, mouthY - mouthDrop, faceCX + mouthW, mouthY - mouthDrop * 0.15);
            octx.stroke();

            // "404"
            const fontSize = artW * 0.32;
            octx.fillStyle = '#000';
            octx.font = `900 ${fontSize}px "Helvetica Neue", Arial, sans-serif`;
            octx.textAlign = 'center';
            octx.textBaseline = 'alphabetic';
            octx.fillText('404', artW / 2, artH * 0.58);

            // "PAGE NOT FOUND"
            octx.font = `800 ${Math.max(13, artW * 0.038)}px "Helvetica Neue", Arial, sans-serif`;
            octx.fillText('PAGE NOT FOUND', artW / 2, artH * 0.7);

            const img = octx.getImageData(0, 0, off.width, off.height).data;
            const list: Brick[] = [];
            for (let gy = 0; gy * BRICK < off.height; gy++) {
                const y0 = gy * BRICK;
                const y1 = Math.min(off.height, y0 + BRICK);
                for (let gx = 0; gx * BRICK < off.width; gx++) {
                    const x0 = gx * BRICK;
                    const x1 = Math.min(off.width, x0 + BRICK);
                    let sum = 0;
                    let count = 0;
                    for (let py = y0; py < y1; py++) {
                        for (let px = x0; px < x1; px++) {
                            sum += img[(py * off.width + px) * 4 + 3];
                            count++;
                        }
                    }
                    if (count > 0 && sum / count > 90) {
                        list.push({
                            x: artX + gx * BRICK,
                            y: artY + gy * BRICK,
                            alive: true,
                        });
                    }
                }
            }
            bricks = list;
            aliveCount = list.length;
            totalCount = list.length;
        }

        // ---------- balls ----------
        function spawnBall(x?: number, y?: number) {
            if (balls.length >= BALL_CAP) return;
            const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.2;
            balls.push({
                x: x != null ? x : W / 2,
                y: y != null ? y : H * 0.55,
                vx: Math.cos(angle) * BALL_SPEED,
                vy: Math.sin(angle) * BALL_SPEED,
                r: BALL_R,
            });
        }

        function maybeSpawnExtraBall() {
            if (balls.length < 6 && Math.random() < 0.12) {
                const b = balls[0];
                spawnBall(b.x, b.y);
            }
        }

        // ---------- gifts ----------
        function spawnGift(x: number, y: number, tier: number) {
            gifts.push({ x: x + BRICK / 2, y: y + BRICK / 2, vy: 0.6, tier });
        }

        function applyGift(tier: number) {
            if (tier === 1) {
                spawnBall(paddle.x, paddle.y - 30);
            } else if (tier === 2) {
                paddle.w = Math.min(paddle.w * 1.2, PADDLE_MAX_W);
            } else if (tier === 3) {
                for (let i = 0; i < 3; i++) spawnBall(paddle.x, paddle.y - 30);
            } else if (tier === 4) {
                pierceUntil = performance.now() + PIERCE_DURATION;
            } else if (tier === 5) {
                for (let i = 0; i < 5; i++) spawnBall(paddle.x, paddle.y - 30);
            } else if (tier === 6) {
                for (let i = 0; i < 10; i++) spawnBall(paddle.x, paddle.y - 30);
            } else if (tier === 7) {
                paddle.w = Math.min(paddle.w * 1.2, PADDLE_MAX_W);
            } else if (tier === 8) {
                for (let i = 0; i < 20; i++) spawnBall(paddle.x, paddle.y - 30);
            } else if (tier === 9) {
                pierceUntil = performance.now() + PIERCE_DURATION;
            } else if (tier === 10) {
                paddle.w = Math.min(paddle.w * 1.1, PADDLE_MAX_W);
            } else if (tier === 11) {
                for (let i = 0; i < 30; i++) spawnBall(paddle.x, paddle.y - 30);
            } else if (tier === 12) {
                const current = balls.slice();
                current.forEach((b) => spawnBall(b.x, b.y));
            }
            beep(700, 0.09, 0.06);
        }

        function updateGifts(dt: number) {
            const step = dt / 16.7;
            for (let i = gifts.length - 1; i >= 0; i--) {
                const g = gifts[i];
                g.vy += 0.01 * dt;
                g.y += g.vy * step;

                const half = GIFT_SIZE / 2;
                const withinX = g.x + half > paddle.x - paddle.w / 2 && g.x - half < paddle.x + paddle.w / 2;
                const withinY = g.y + half > paddle.y - paddle.h / 2 && g.y - half < paddle.y + paddle.h / 2;
                if (withinX && withinY) {
                    applyGift(g.tier);
                    gifts.splice(i, 1);
                    continue;
                }

                if (g.y - half > H) {
                    gifts.splice(i, 1);
                }
            }
        }

        function drawGifts() {
            ctx!.save();
            ctx!.textAlign = 'center';
            ctx!.textBaseline = 'middle';
            ctx!.font = '800 12px "Helvetica Neue", Arial, sans-serif';
            gifts.forEach((g) => {
                const half = GIFT_SIZE / 2;
                ctx!.fillStyle = BG;
                ctx!.fillRect(g.x - half, g.y - half, GIFT_SIZE, GIFT_SIZE);
                ctx!.strokeStyle = INK;
                ctx!.lineWidth = 2;
                ctx!.strokeRect(g.x - half, g.y - half, GIFT_SIZE, GIFT_SIZE);
                ctx!.fillStyle = INK;
                ctx!.fillText(String(g.tier), g.x, g.y + 1);
            });
            ctx!.restore();
        }

        function placeWaitingBall() {
            balls = [
                {
                    x: paddle.x,
                    y: paddle.y - paddle.h / 2 - BALL_R,
                    vx: 0,
                    vy: 0,
                    r: BALL_R,
                },
            ];
        }

        function launchBall() {
            const ball = balls[0];
            const angle = -Math.PI / 2 + (Math.random() - 0.5) * 0.7;
            ball.vx = Math.cos(angle) * BALL_SPEED;
            ball.vy = Math.sin(angle) * BALL_SPEED;
            gameState = 'playing';
        }

        function resetToWaiting() {
            buildBrickField();
            rebuildBrickIndex();
            debris = [];
            gifts = [];
            pierceUntil = 0;
            paddle.w = BASE_PADDLE_W;
            comboCount = 0;
            comboUntil = 0;
            comboVisibleUntil = 0;
            milestoneIndex = 0;
            nextRandomMilestone = 120;
            regenTimer = 0;
            placeWaitingBall();
            gameState = 'waiting';
        }

        // ---------- debris ----------
        function spawnDebris(x: number, y: number) {
            const n = 1 + (Math.random() < 0.4 ? 1 : 0);
            for (let i = 0; i < n; i++) {
                debris.push({
                    x: x + BRICK / 2,
                    y: y + BRICK / 2,
                    vx: (Math.random() - 0.5) * 2.4,
                    vy: -Math.random() * 2 - 0.5,
                    rot: Math.random() * Math.PI,
                    vrot: (Math.random() - 0.5) * 0.3,
                    size: BRICK,
                    life: 0,
                    maxLife: 1600 + Math.random() * 800,
                });
            }
        }

        function updateDebris(dt: number) {
            for (let i = debris.length - 1; i >= 0; i--) {
                const d = debris[i];
                d.vy += 0.012 * dt;
                d.x += d.vx * (dt / 16.7);
                d.y += d.vy * (dt / 16.7);
                d.rot += d.vrot * (dt / 16.7);
                d.life += dt;
                if (d.life > d.maxLife || d.y > H + 40) debris.splice(i, 1);
            }
        }

        function drawDebris() {
            ctx!.fillStyle = INK;
            debris.forEach((d) => {
                const fade = 1 - d.life / d.maxLife;
                ctx!.save();
                ctx!.globalAlpha = Math.max(0, fade);
                ctx!.translate(d.x, d.y);
                ctx!.rotate(d.rot);
                ctx!.fillRect(-d.size / 2, -d.size / 2, d.size, d.size);
                ctx!.restore();
            });
            ctx!.globalAlpha = 1;
        }

        // ---------- combo ----------
        function registerHit(bx: number, by: number) {
            const now = performance.now();
            if (now < comboUntil) {
                comboCount++;
            } else {
                comboCount = 1;
                milestoneIndex = 0;
                nextRandomMilestone = 120;
            }
            comboUntil = now + 900;
            comboVisibleUntil = now + 1200;

            if (milestoneIndex < COMBO_MILESTONES.length && comboCount >= COMBO_MILESTONES[milestoneIndex].count) {
                spawnGift(bx, by, COMBO_MILESTONES[milestoneIndex].tier);
                milestoneIndex++;
            } else if (milestoneIndex >= COMBO_MILESTONES.length && comboCount >= nextRandomMilestone) {
                const tier = RANDOM_TIER_POOL[Math.floor(Math.random() * RANDOM_TIER_POOL.length)];
                spawnGift(bx, by, tier);
                nextRandomMilestone += 50;
            }
        }

        function updateComboDisplay() {
            const now = performance.now();
            if (comboCount >= 2 && now < comboVisibleUntil) {
                comboEl!.textContent = `COMBO ×${comboCount}`;
                comboEl!.classList.add(styles.visible);
            } else {
                comboEl!.classList.remove(styles.visible);
            }
        }

        function updatePierceDisplay() {
            const now = performance.now();
            if (now < pierceUntil) {
                const secs = Math.ceil((pierceUntil - now) / 1000);
                pierceEl!.textContent = `PIERCE ${secs}s`;
                pierceEl!.classList.add(styles.visible);
            } else {
                pierceEl!.classList.remove(styles.visible);
            }
        }

        // ---------- paddle ----------
        function onPointerX(clientX: number) {
            const rect = canvas!.getBoundingClientRect();
            paddle.x = clientX - rect.left;
        }

        function handleMouseMove(e: MouseEvent) {
            onPointerX(e.clientX);
        }

        function handleTouchMove(e: TouchEvent) {
            if (e.touches[0]) onPointerX(e.touches[0].clientX);
            e.preventDefault();
        }

        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('touchmove', handleTouchMove, { passive: false });

        function handleActivate() {
            if (gameState === 'waiting') {
                launchBall();
            } else if (gameState === 'over') {
                resetToWaiting();
            }
        }

        function handleClick() {
            handleActivate();
        }

        function handleTouchStart(e: TouchEvent) {
            if (e.touches[0]) onPointerX(e.touches[0].clientX);
            handleActivate();
        }

        canvas.addEventListener('click', handleClick);
        canvas.addEventListener('touchstart', handleTouchStart, { passive: true });

        function updatePaddle() {
            paddle.y = H - paddle.margin;
            const half = paddle.w / 2;
            paddle.x = Math.min(Math.max(paddle.x, half), W - half);
        }

        function drawPaddle() {
            ctx!.fillStyle = INK;
            ctx!.fillRect(paddle.x - paddle.w / 2, paddle.y - paddle.h / 2, paddle.w, paddle.h);
        }

        // ---------- physics ----------
        function reflectOffPaddle(ball: Ball) {
            ball.vy = -Math.abs(ball.vy);
            const speed = Math.hypot(ball.vx, ball.vy) || BALL_SPEED;
            let angle = Math.atan2(ball.vy, ball.vx);
            const jitter = ((Math.random() - 0.5) * 12) * (Math.PI / 180);
            angle += jitter;
            const minUp = -Math.PI + 0.35;
            const maxUp = -0.35;
            if (angle > maxUp) angle = maxUp;
            if (angle < minUp) angle = minUp;
            ball.vx = Math.cos(angle) * speed;
            ball.vy = Math.sin(angle) * speed;
            ball.y = paddle.y - paddle.h / 2 - ball.r - 0.5;
            beep(320, 0.05, 0.05);
        }

        function updateBalls(dt: number) {
            const step = dt / 16.7;
            const pierceActive = performance.now() < pierceUntil;
            for (let i = balls.length - 1; i >= 0; i--) {
                const ball = balls[i];
                ball.x += ball.vx * step;
                ball.y += ball.vy * step;

                if (ball.x - ball.r < 0) {
                    ball.x = ball.r;
                    ball.vx *= -1;
                    beep(220, 0.04, 0.03);
                }
                if (ball.x + ball.r > W) {
                    ball.x = W - ball.r;
                    ball.vx *= -1;
                    beep(220, 0.04, 0.03);
                }
                if (ball.y - ball.r < 0) {
                    ball.y = ball.r;
                    ball.vy *= -1;
                    beep(220, 0.04, 0.03);
                }

                const withinPaddleX = ball.x + ball.r > paddle.x - paddle.w / 2 && ball.x - ball.r < paddle.x + paddle.w / 2;
                const withinPaddleY = ball.y + ball.r > paddle.y - paddle.h / 2 && ball.y - ball.r < paddle.y + paddle.h / 2;
                if (ball.vy > 0 && withinPaddleX && withinPaddleY) {
                    reflectOffPaddle(ball);
                }

                if (ball.y - ball.r > H) {
                    balls.splice(i, 1);
                    continue;
                }

                const col = Math.floor((ball.x - artBox.x) / BRICK);
                const row = Math.floor((ball.y - artBox.y) / BRICK);
                const reach = Math.ceil(ball.r / BRICK) + 1;
                for (let r = row - reach; r <= row + reach; r++) {
                    for (let c = col - reach; c <= col + reach; c++) {
                        const brick = findBrick(c, r);
                        if (!brick || !brick.alive) continue;
                        const bx = brick.x;
                        const by = brick.y;
                        const closestX = Math.max(bx, Math.min(ball.x, bx + BRICK));
                        const closestY = Math.max(by, Math.min(ball.y, by + BRICK));
                        const distX = ball.x - closestX;
                        const distY = ball.y - closestY;
                        if (distX * distX + distY * distY < ball.r * ball.r) {
                            brick.alive = false;
                            aliveCount--;
                            spawnDebris(bx, by);
                            registerHit(bx, by);
                            maybeSpawnExtraBall();
                            if (!pierceActive) {
                                if (Math.abs(distX) > Math.abs(distY)) {
                                    ball.vx *= -1;
                                } else {
                                    ball.vy *= -1;
                                }
                                beep(560, 0.04, 0.04);
                                break;
                            }
                            beep(560, 0.04, 0.04);
                        }
                    }
                }
            }

            if (balls.length === 0) {
                gameState = 'over';
            }
        }

        let brickIndex: Map<number, Brick> | null = null;
        let brickCols = 0;

        function rebuildBrickIndex() {
            brickIndex = new Map();
            brickCols = Math.ceil(artBox.w / BRICK) + 2;
            bricks.forEach((b) => {
                const c = Math.floor((b.x - artBox.x) / BRICK);
                const r = Math.floor((b.y - artBox.y) / BRICK);
                brickIndex!.set(r * brickCols + c, b);
            });
        }

        function findBrick(c: number, r: number): Brick | null {
            if (!brickIndex) return null;
            return brickIndex.get(r * brickCols + c) ?? null;
        }

        function drawBricks() {
            ctx!.fillStyle = INK;
            bricks.forEach((b) => {
                if (b.alive) ctx!.fillRect(b.x, b.y, BRICK - 1, BRICK - 1);
            });
        }

        // ---------- overlays ----------
        function drawHint(text: string) {
            ctx!.save();
            ctx!.fillStyle = INK;
            ctx!.font = '600 12px "Helvetica Neue", Arial, sans-serif';
            ctx!.textAlign = 'center';
            ctx!.globalAlpha = 0.6;
            ctx!.fillText(text, W / 2, paddle.y - paddle.h / 2 - BALL_R * 2 - 10);
            ctx!.restore();
        }

        function drawGameOver() {
            ctx!.save();
            // ctx!.fillStyle = BG;
            ctx!.globalAlpha = 0.2;
            ctx!.fillRect(0, 0, W, H);
            ctx!.globalAlpha = 1;
            ctx!.fillStyle = INK;
            ctx!.textAlign = 'center';
            ctx!.font = '900 42px "Helvetica Neue", Arial, sans-serif';
            ctx!.fillText('GAME OVER', W / 2, H / 2 - 8);
            ctx!.font = '600 13px "Helvetica Neue", Arial, sans-serif';
            ctx!.fillText('( CLICK TO PLAY AGAIN )', W / 2, H / 2 + 22);
            ctx!.restore();
        }

        // ---------- loop ----------
        let lastTime = performance.now();

        function resize() {
            dpr = Math.max(1, window.devicePixelRatio || 1);
            const rect = canvas!.getBoundingClientRect();
            W = rect.width;
            H = rect.height;
            canvas!.width = Math.round(W * dpr);
            canvas!.height = Math.round(H * dpr);
            ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
            if (!paddle.x) paddle.x = W / 2;
            paddle.y = H - paddle.margin;
            buildBrickField();
            rebuildBrickIndex();
            if (gameState === 'waiting') placeWaitingBall();
        }

        function regenerateIfNeeded(dt: number) {
            if (aliveCount <= Math.max(2, totalCount * 0.03)) {
                regenTimer += dt;
                if (regenTimer > 900) {
                    buildBrickField();
                    rebuildBrickIndex();
                    regenTimer = 0;
                }
            } else {
                regenTimer = 0;
            }
        }

        function frame(now: number) {
            if (cancelled) return;
            const dt = Math.min(40, now - lastTime);
            lastTime = now;

            updatePaddle();

            if (gameState === 'playing') {
                updateBalls(dt);
                updateDebris(dt);
                updateGifts(dt);
                regenerateIfNeeded(dt);
            } else if (gameState === 'waiting') {
                const ball = balls[0];
                if (ball) {
                    ball.x = paddle.x;
                    ball.y = paddle.y - paddle.h / 2 - ball.r;
                }
            }
            updateComboDisplay();
            updatePierceDisplay();

            const pierceActive = performance.now() < pierceUntil;
            const ballColor = pierceActive ? PIERCE_COLOR : INK;
            const ballRgb = pierceActive ? '179, 64, 46' : INK_RGB;

            ctx!.clearRect(0, 0, W, H);
            // ctx!.fillStyle = BG;
            // ctx!.fillRect(0, 0, W, H);
            drawBricks();
            drawDebris();
            drawGifts();
            ctx!.save();
            balls.forEach((ball) => {
                const speed = Math.hypot(ball.vx, ball.vy) || 1;
                const dirX = ball.vx / speed;
                const dirY = ball.vy / speed;
                const tailLen = Math.min(30, 6 + speed * 3.2);
                const backX = ball.x - dirX * tailLen;
                const backY = ball.y - dirY * tailLen;
                const perpX = -dirY * ball.r * 0.9;
                const perpY = dirX * ball.r * 0.9;
                const grad = ctx!.createLinearGradient(ball.x, ball.y, backX, backY);
                grad.addColorStop(0, `rgba(${ballRgb}, 0.55)`);
                grad.addColorStop(1, `rgba(${ballRgb}, 0)`);
                ctx!.beginPath();
                ctx!.moveTo(ball.x + perpX, ball.y + perpY);
                ctx!.lineTo(ball.x - perpX, ball.y - perpY);
                ctx!.lineTo(backX, backY);
                ctx!.closePath();
                ctx!.fillStyle = grad;
                ctx!.fill();
            });
            ctx!.restore();

            ctx!.save();
            ctx!.fillStyle = ballColor;
            balls.forEach((ball) => {
                ctx!.beginPath();
                ctx!.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
                ctx!.fill();
            });
            ctx!.restore();
            drawPaddle();

            if (gameState === 'waiting') {
                drawHint('( CLICK TO LAUNCH )');
            } else if (gameState === 'over') {
                drawGameOver();
            }

            rafId = requestAnimationFrame(frame);
        }

        function handleResize() {
            resize();
        }
        window.addEventListener('resize', handleResize);

        function init() {
            resize();
            if (W <= 0 || H <= 0) {
                rafId = requestAnimationFrame(init);
                return;
            }
            placeWaitingBall();
            rafId = requestAnimationFrame(frame);
        }

        init();

        return () => {
            cancelled = true;
            cancelAnimationFrame(rafId);
            window.removeEventListener('resize', handleResize);
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('touchmove', handleTouchMove);
            canvas.removeEventListener('click', handleClick);
            canvas.removeEventListener('touchstart', handleTouchStart);
            muteBtn.removeEventListener('click', handleMuteClick);
            if (audioCtx) {
                audioCtx.close().catch(() => {});
            }
        };
    }, []);

    return (
        <>
            <main className={styles.hero}>
                <div ref={comboRef} className={styles.combo} />
                <div ref={pierceRef} className={styles.pierce} />
                <canvas ref={canvasRef} className={styles.game} />
            </main>

            <button
                ref={muteBtnRef}
                className={styles.muteBtn}
                aria-label="Toggle sound"
                aria-pressed="false"
                type="button"
            >
                <svg viewBox="0 0 24 24" width="18" height="18">
                    <path d="M4 9v6h4l5 5V4L8 9H4z" fill="currentColor" />
                    <path
                        ref={muteSlashRef}
                        d="M18 5 L6 19"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        style={{ display: 'none' }}
                    />
                    <path
                        ref={soundWavesRef}
                        d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.6}
                        strokeLinecap="round"
                    />
                </svg>
            </button>
        </>
    );
}