'use client';

import { useEffect, useRef } from 'react';

const ParticleCanvas = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d', { alpha: true });
        if (!ctx) return;

        let animationId: number;
        let time = 0;
        let isVisible = true;

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);

        // Smooth mouse tracking
        const mouse = {
            x: width * 0.5,
            y: height * 0.6,
            targetX: width * 0.5,
            targetY: height * 0.6,
            normX: 0,
            normY: 0,
            active: false,
        };

        // Click ripples traveling across terrain
        interface Ripple {
            x: number;
            y: number;
            radius: number;
            maxRadius: number;
            strength: number;
        }
        const ripples: Ripple[] = [];

        // Grid resolution
        let cols = Math.floor(Math.max(38, Math.min(56, width / 24)));
        let rows = 32;

        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            cols = Math.floor(Math.max(38, Math.min(56, width / 24)));
        };

        const handleMouseMove = (e: MouseEvent) => {
            mouse.targetX = e.clientX;
            mouse.targetY = e.clientY;
            mouse.active = true;
        };

        const handleMouseLeave = () => {
            mouse.targetX = width * 0.5;
            mouse.targetY = height * 0.6;
            mouse.active = false;
        };

        const handleMouseDown = (e: MouseEvent) => {
            ripples.push({
                x: e.clientX,
                y: e.clientY,
                radius: 5,
                maxRadius: 280,
                strength: 40,
            });
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        window.addEventListener('mouseleave', handleMouseLeave);
        window.addEventListener('mousedown', handleMouseDown);

        const handleVisibilityChange = () => {
            isVisible = !document.hidden;
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);

        // Ambient cyber sparks drifting upward
        interface Spark {
            x: number;
            y: number;
            vx: number;
            vy: number;
            size: number;
            alpha: number;
            hue: 'cyan' | 'purple';
        }
        const sparks: Spark[] = [];
        const sparkCount = 40;

        for (let i = 0; i < sparkCount; i++) {
            sparks.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.4,
                vy: -Math.random() * 0.5 - 0.2,
                size: Math.random() * 1.8 + 0.8,
                alpha: Math.random() * 0.6 + 0.3,
                hue: Math.random() > 0.5 ? 'cyan' : 'purple',
            });
        }

        // ==========================================
        // Render Loop: 3D Topographic Mesh Wave
        // ==========================================
        const render = () => {
            animationId = requestAnimationFrame(render);
            if (!isVisible) return;

            // Ease mouse position
            mouse.x += (mouse.targetX - mouse.x) * 0.06;
            mouse.y += (mouse.targetY - mouse.y) * 0.06;
            mouse.normX = (mouse.x / width - 0.5) * 2;
            mouse.normY = (mouse.y / height - 0.5) * 2;

            const speed = prefersReducedMotion ? 0.003 : 0.015;
            time += speed;

            ctx.clearRect(0, 0, width, height);

            // ----------------------------------------------------
            // 1. Ambient Horizon & Mouse Lighting
            // ----------------------------------------------------
            const horizonY = height * 0.48 + mouse.normY * 18;

            // Ethereal horizon glow beam
            const horizonGrad = ctx.createLinearGradient(0, horizonY - 100, 0, horizonY + 240);
            horizonGrad.addColorStop(0, 'rgba(10, 10, 15, 0)');
            horizonGrad.addColorStop(0.3, 'rgba(108, 92, 231, 0.08)');
            horizonGrad.addColorStop(0.5, 'rgba(0, 206, 201, 0.12)');
            horizonGrad.addColorStop(0.7, 'rgba(108, 92, 231, 0.04)');
            horizonGrad.addColorStop(1, 'rgba(10, 10, 15, 0)');
            ctx.fillStyle = horizonGrad;
            ctx.fillRect(0, horizonY - 100, width, 340);

            // Interactive mouse spotlight
            if (mouse.active) {
                const spotGrad = ctx.createRadialGradient(
                    mouse.x,
                    mouse.y,
                    0,
                    mouse.x,
                    mouse.y,
                    360
                );
                spotGrad.addColorStop(0, 'rgba(0, 206, 201, 0.10)');
                spotGrad.addColorStop(0.4, 'rgba(108, 92, 231, 0.05)');
                spotGrad.addColorStop(1, 'rgba(10, 10, 15, 0)');
                ctx.fillStyle = spotGrad;
                ctx.fillRect(0, 0, width, height);
            }

            // Update ripples
            for (let i = ripples.length - 1; i >= 0; i--) {
                const rip = ripples[i];
                rip.radius += 3.2;
                rip.strength *= 0.965;
                if (rip.radius > rip.maxRadius || rip.strength < 0.5) {
                    ripples.splice(i, 1);
                }
            }

            // ----------------------------------------------------
            // 2. Compute 3D Topographic Perspective Grid
            // ----------------------------------------------------
            interface GridPoint {
                x: number;
                y: number;
                elevationNorm: number;
                depth: number;
                alpha: number;
            }

            const grid: GridPoint[][] = [];

            for (let r = 0; r < rows; r++) {
                grid[r] = [];
                // depth: 0 at horizon, 1 at bottom foreground
                const depth = r / (rows - 1);
                const perspective = 0.28 + depth * 0.88;

                // Ground plane position with exponential perspective compression
                const baseY = horizonY + Math.pow(depth, 1.25) * (height * 0.58);
                const spreadWidth = width * 1.55 * perspective;
                const startX = width * 0.5 - spreadWidth * 0.5 + mouse.normX * (1 - depth) * 35;
                const endX = width * 0.5 + spreadWidth * 0.5 + mouse.normX * (1 - depth) * 35;

                for (let c = 0; c < cols; c++) {
                    const cNorm = c / (cols - 1);
                    const posX = startX + cNorm * (endX - startX);

                    // Multi-octave wave elevation
                    const freqX = cNorm * 7.5;
                    const freqZ = depth * 6.0;

                    const w1 = Math.sin(freqX * 1.0 + time * 1.8) * Math.cos(freqZ * 0.8 - time * 1.4);
                    const w2 = Math.sin(freqX * 2.2 - freqZ * 1.6 + time * 2.4) * 0.45;
                    const w3 = Math.cos((freqX + freqZ) * 1.3 - time * 1.1) * 0.35;

                    // Mouse gravitational attraction/lift
                    const dx = posX - mouse.x;
                    const dy = baseY - mouse.y;
                    const distToMouse = Math.sqrt(dx * dx + dy * dy);
                    const mouseLift = Math.exp(-distToMouse / 110) * 48 * Math.pow(depth, 0.5);

                    // Ripple impact
                    let ripLift = 0;
                    ripples.forEach((rip) => {
                        const distToRip = Math.sqrt(Math.pow(posX - rip.x, 2) + Math.pow(baseY - rip.y, 2));
                        const waveDist = Math.abs(distToRip - rip.radius);
                        if (waveDist < 30) {
                            ripLift += Math.sin((waveDist / 30) * Math.PI) * rip.strength * (1 - depth * 0.3);
                        }
                    });

                    // Height amplitude scales with depth (taller waves in foreground)
                    const amp = (28 + depth * 42);
                    const totalElevation = (w1 + w2 + w3) * amp + mouseLift + ripLift;
                    const posY = baseY - totalElevation;

                    // Edge fading to softly vignette the left and right borders
                    const edgeFade = Math.sin(cNorm * Math.PI);
                    const depthAlpha = Math.pow(depth, 0.75);
                    const alpha = Math.max(0.04, Math.min(0.9, depthAlpha * edgeFade));

                    grid[r][c] = {
                        x: posX,
                        y: posY,
                        elevationNorm: Math.max(-1, Math.min(1, totalElevation / amp)),
                        depth,
                        alpha,
                    };
                }
            }

            // ----------------------------------------------------
            // 3. Draw Perspective Wireframe Mesh
            // ----------------------------------------------------
            // A. Draw Horizontal Terrain Ridges (Latitude lines)
            for (let r = 0; r < rows; r++) {
                const depth = r / (rows - 1);
                ctx.beginPath();

                for (let c = 0; c < cols; c++) {
                    const pt = grid[r][c];
                    if (c === 0) {
                        ctx.moveTo(pt.x, pt.y);
                    } else {
                        ctx.lineTo(pt.x, pt.y);
                    }
                }

                // Vibrant cyan on crest rows, electric purple on alternates
                const lineAlpha = (0.05 + depth * 0.38) * 0.95;
                const isCyan = r % 3 === 0;

                ctx.strokeStyle = isCyan
                    ? `rgba(0, 206, 201, ${lineAlpha})`
                    : `rgba(108, 92, 231, ${lineAlpha * 0.85})`;
                ctx.lineWidth = Math.max(0.8, depth * 1.7);
                ctx.stroke();
            }

            // B. Draw Longitudinal Lines (Connecting depth columns)
            const colStep = cols > 45 ? 2 : 1;
            for (let c = 0; c < cols; c += colStep) {
                ctx.beginPath();
                for (let r = 0; r < rows; r++) {
                    const pt = grid[r][c];
                    if (r === 0) {
                        ctx.moveTo(pt.x, pt.y);
                    } else {
                        ctx.lineTo(pt.x, pt.y);
                    }
                }
                ctx.strokeStyle = 'rgba(162, 155, 254, 0.09)';
                ctx.lineWidth = 0.75;
                ctx.stroke();
            }

            // C. Matrix Crest Spark Nodes
            for (let r = 0; r < rows; r += 2) {
                for (let c = 0; c < cols; c += 2) {
                    const pt = grid[r][c];
                    if (pt.elevationNorm > 0.35 && pt.depth > 0.2) {
                        const intensity = (pt.elevationNorm - 0.35) * 1.5;
                        const nodeSize = (1.0 + intensity * 2.2) * (0.6 + pt.depth * 0.6);
                        const nodeAlpha = Math.min(0.9, intensity * pt.alpha);

                        ctx.beginPath();
                        ctx.arc(pt.x, pt.y, Math.max(1, nodeSize), 0, Math.PI * 2);
                        ctx.fillStyle = `rgba(0, 206, 201, ${nodeAlpha})`;
                        ctx.fill();

                        // Soft halo on highest peaks
                        if (intensity > 0.6) {
                            ctx.beginPath();
                            ctx.arc(pt.x, pt.y, nodeSize * 2.6, 0, Math.PI * 2);
                            ctx.fillStyle = `rgba(108, 92, 231, ${nodeAlpha * 0.4})`;
                            ctx.fill();
                        }
                    }
                }
            }

            // ----------------------------------------------------
            // 4. Floating Ambient Cyber Dust Sparks
            // ----------------------------------------------------
            sparks.forEach((s) => {
                s.x += s.vx;
                s.y += s.vy;

                if (s.y < horizonY - 140) {
                    s.y = height * 0.95;
                    s.x = Math.random() * width;
                }
                if (s.x < 0) s.x = width;
                if (s.x > width) s.x = 0;

                const color = s.hue === 'cyan' ? '0, 206, 201' : '162, 155, 254';

                ctx.beginPath();
                ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${color}, ${s.alpha * 0.6})`;
                ctx.fill();
            });
        };

        render();

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseleave', handleMouseLeave);
            window.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            cancelAnimationFrame(animationId);
        };
    }, []);

    return (
        <div className="canvas-container" aria-hidden="true">
            <canvas ref={canvasRef} />
        </div>
    );
};

export default ParticleCanvas;
