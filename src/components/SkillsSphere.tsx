'use client';

import { useEffect, useRef } from 'react';

const SkillsSphere = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current as HTMLCanvasElement;
        if (!canvas) return;
        const ctx = canvas.getContext('2d')!;
        let animationId: number;
        let time = 0;
        let mouse = { x: 0.5, y: 0.5 };
        let hoveredSkill: number | null = null;

        const dpr = window.devicePixelRatio || 1;
        const S = 500;
        canvas.width = S * dpr;
        canvas.height = S * dpr;
        canvas.style.width = '100%';
        canvas.style.maxWidth = S + 'px';
        canvas.style.height = 'auto';
        canvas.style.aspectRatio = '1';
        ctx.scale(dpr, dpr);

        const cx = S / 2;
        const cy = S / 2;

        canvas.addEventListener('mousemove', (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = (e.clientX - rect.left) / rect.width;
            mouse.y = (e.clientY - rect.top) / rect.height;
        });
        canvas.addEventListener('mouseleave', () => {
            mouse.x = 0.5;
            mouse.y = 0.5;
            hoveredSkill = null;
        });

        // Skill nodes with positions in polar coordinates
        const skillData = [
            // Core ring (innermost)
            { name: 'React.js', angle: 0, ring: 0, hue: 200, icon: '⚛️' },
            { name: 'Node.js', angle: 90, ring: 0, hue: 120, icon: '🟢' },
            { name: 'MongoDB', angle: 180, ring: 0, hue: 130, icon: '🍃' },
            { name: 'Express', angle: 270, ring: 0, hue: 0, icon: '⚡' },
            // Middle ring
            { name: 'JavaScript', angle: 30, ring: 1, hue: 50, icon: '📜' },
            { name: 'HTML5', angle: 85, ring: 1, hue: 20, icon: '🌐' },
            { name: 'CSS3', angle: 145, ring: 1, hue: 210, icon: '🎨' },
            { name: 'Python', angle: 210, ring: 1, hue: 55, icon: '🐍' },
            { name: 'PHP', angle: 280, ring: 1, hue: 240, icon: '🐘' },
            { name: 'MySQL', angle: 340, ring: 1, hue: 30, icon: '🗄️' },
            // Outer ring
            { name: 'Bootstrap', angle: 15, ring: 2, hue: 270, icon: '🅱️' },
            { name: 'Tailwind', angle: 65, ring: 2, hue: 190, icon: '💨' },
            { name: 'Git', angle: 110, ring: 2, hue: 15, icon: '📦' },
            { name: 'WordPress', angle: 160, ring: 2, hue: 210, icon: '📝' },
            { name: 'React Native', angle: 205, ring: 2, hue: 200, icon: '📱' },
            { name: 'SEO', angle: 250, ring: 2, hue: 140, icon: '🔍' },
            { name: 'Postman', angle: 300, ring: 2, hue: 25, icon: '🚀' },
            { name: 'GitHub', angle: 345, ring: 2, hue: 0, icon: '🐙' },
        ];

        const ringRadii = [70, 120, 175];

        // Connections between related skills
        const connections = [
            [0, 4], [0, 10], [0, 14], // React connections
            [1, 4], [1, 3], [1, 12],  // Node connections
            [2, 5], [2, 9],           // MongoDB
            [3, 1], [3, 7],           // Express
            [4, 6], [4, 7],           // JS connections
            [5, 6], [5, 13],          // HTML-CSS
            [11, 6],                  // Tailwind-CSS
        ];

        // Precompute positions
        const getPos = (skill: { angle: number; ring: number }, t: number) => {
            const baseAngle = (skill.angle * Math.PI) / 180;
            const wobble = Math.sin(t * 0.5 + skill.angle * 0.02) * 3;
            const r = ringRadii[skill.ring] + wobble;
            const mx = (mouse.x - 0.5) * 12;
            const my = (mouse.y - 0.5) * 12;
            return {
                x: cx + Math.cos(baseAngle + t * 0.05) * r + mx * (0.3 - skill.ring * 0.08),
                y: cy + Math.sin(baseAngle + t * 0.05) * r + my * (0.3 - skill.ring * 0.08),
            };
        };

        // Sweep angle for radar effect
        let sweepAngle = 0;

        const animate = () => {
            ctx.clearRect(0, 0, S, S);
            time += 0.016;
            sweepAngle = (time * 0.8) % (Math.PI * 2);

            const mx = (mouse.x - 0.5) * 12;
            const my = (mouse.y - 0.5) * 12;
            const centerX = cx + mx * 0.3;
            const centerY = cy + my * 0.3;

            // ===== Ring circles =====
            ringRadii.forEach((r, i) => {
                // Solid ring
                ctx.beginPath();
                ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(108, 92, 231, ${0.08 - i * 0.015})`;
                ctx.lineWidth = 1;
                ctx.stroke();

                // Pulsing ring
                const pulseR = r + Math.sin(time * 1.5 + i) * 3;
                ctx.beginPath();
                ctx.arc(centerX, centerY, pulseR, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(108, 92, 231, ${0.03})`;
                ctx.lineWidth = 0.5;
                ctx.setLineDash([3, 6]);
                ctx.stroke();
                ctx.setLineDash([]);
            });

            // ===== Cross-hair lines =====
            for (let i = 0; i < 8; i++) {
                const a = (i / 8) * Math.PI * 2;
                ctx.beginPath();
                ctx.moveTo(centerX, centerY);
                ctx.lineTo(
                    centerX + Math.cos(a) * 195,
                    centerY + Math.sin(a) * 195
                );
                ctx.strokeStyle = `rgba(108, 92, 231, ${i % 2 === 0 ? 0.04 : 0.02})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }

            // ===== Radar sweep =====
            const sweepGrad = (ctx as any).createConicalGradient
                ? null
                : (() => {
                    // Fallback arc sweep
                    ctx.beginPath();
                    ctx.moveTo(centerX, centerY);
                    ctx.arc(centerX, centerY, 195, sweepAngle - 0.6, sweepAngle, false);
                    ctx.closePath();
                    const grad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 195);
                    grad.addColorStop(0, 'rgba(108, 92, 231, 0.08)');
                    grad.addColorStop(1, 'rgba(108, 92, 231, 0.02)');
                    ctx.fillStyle = grad;
                    ctx.fill();
                    return null;
                })();

            // Sweep line
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(
                centerX + Math.cos(sweepAngle) * 195,
                centerY + Math.sin(sweepAngle) * 195
            );
            ctx.strokeStyle = 'rgba(108, 92, 231, 0.25)';
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Sweep trail
            for (let t = 0; t < 10; t++) {
                const trailAngle = sweepAngle - t * 0.06;
                const alpha = 0.12 * (1 - t / 10);
                ctx.beginPath();
                ctx.moveTo(centerX, centerY);
                ctx.lineTo(
                    centerX + Math.cos(trailAngle) * 195,
                    centerY + Math.sin(trailAngle) * 195
                );
                ctx.strokeStyle = `rgba(108, 92, 231, ${alpha})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }

            // ===== Connections =====
            connections.forEach(([i, j]) => {
                const a = getPos(skillData[i], time);
                const b = getPos(skillData[j], time);

                // Animated dash
                const dashOffset = time * 20;
                ctx.beginPath();
                ctx.moveTo(a.x, a.y);

                // Curved connection
                const midX = (a.x + b.x) / 2 + (a.y - b.y) * 0.1;
                const midY = (a.y + b.y) / 2 + (b.x - a.x) * 0.1;
                ctx.quadraticCurveTo(midX, midY, b.x, b.y);

                ctx.strokeStyle = 'rgba(162, 155, 254, 0.08)';
                ctx.lineWidth = 0.8;
                ctx.setLineDash([2, 4]);
                ctx.lineDashOffset = -dashOffset;
                ctx.stroke();
                ctx.setLineDash([]);
                ctx.lineDashOffset = 0;
            });

            // ===== Skill Nodes =====
            // Check hover
            hoveredSkill = null;
            const mousePixelX = mouse.x * S;
            const mousePixelY = mouse.y * S;

            skillData.forEach((skill, idx) => {
                const pos = getPos(skill, time);
                const dx = mousePixelX - pos.x;
                const dy = mousePixelY - pos.y;
                if (Math.sqrt(dx * dx + dy * dy) < 25) {
                    hoveredSkill = idx;
                }
            });

            skillData.forEach((skill, idx) => {
                const pos = getPos(skill, time);
                const isHovered = hoveredSkill === idx;
                const isCore = skill.ring === 0;

                // Check if sweep is near this node
                const nodeAngle = Math.atan2(pos.y - centerY, pos.x - centerX);
                let angleDiff = sweepAngle - nodeAngle;
                while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
                while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
                const sweepNear = Math.abs(angleDiff) < 0.3;
                const sweepBoost = sweepNear ? 0.4 : 0;

                const baseAlpha = isCore ? 0.9 : (skill.ring === 1 ? 0.75 : 0.6);
                const alpha = Math.min(1, baseAlpha + sweepBoost + (isHovered ? 0.3 : 0));
                const nodeSize = (isCore ? 7 : skill.ring === 1 ? 5.5 : 4.5) * (isHovered ? 1.4 : 1);

                // Outer glow
                const glowSize = nodeSize * (isHovered ? 6 : 4);
                const glow = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, glowSize);
                glow.addColorStop(0, `hsla(${skill.hue}, 70%, 65%, ${alpha * 0.35})`);
                glow.addColorStop(1, `hsla(${skill.hue}, 70%, 65%, 0)`);
                ctx.beginPath();
                ctx.arc(pos.x, pos.y, glowSize, 0, Math.PI * 2);
                ctx.fillStyle = glow;
                ctx.fill();

                // Node ring
                if (isCore || isHovered) {
                    ctx.beginPath();
                    ctx.arc(pos.x, pos.y, nodeSize + 3, 0, Math.PI * 2);
                    ctx.strokeStyle = `hsla(${skill.hue}, 60%, 60%, ${alpha * 0.2})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }

                // Node dot
                ctx.beginPath();
                ctx.arc(pos.x, pos.y, nodeSize, 0, Math.PI * 2);
                const nodeGrad = ctx.createRadialGradient(pos.x - 1, pos.y - 1, 0, pos.x, pos.y, nodeSize);
                nodeGrad.addColorStop(0, `hsla(${skill.hue}, 80%, 75%, ${alpha})`);
                nodeGrad.addColorStop(1, `hsla(${skill.hue}, 70%, 55%, ${alpha})`);
                ctx.fillStyle = nodeGrad;
                ctx.fill();

                // Label
                const showLabel = isCore || isHovered || sweepNear;
                if (showLabel) {
                    const fontSize = isHovered ? 12 : (isCore ? 11 : 10);
                    ctx.font = `${isCore || isHovered ? '700' : '600'} ${fontSize}px 'Inter', sans-serif`;
                    const text = skill.name;
                    const tw = ctx.measureText(text).width;
                    const px = 8, py = 4;
                    const pillW = tw + px * 2;
                    const pillH = fontSize + py * 2;
                    const lx = pos.x;
                    const ly = pos.y - nodeSize - pillH / 2 - 8;

                    // Pill
                    const pl = lx - pillW / 2;
                    const pt = ly - pillH / 2;
                    ctx.beginPath();
                    const rr = 6;
                    ctx.moveTo(pl + rr, pt);
                    ctx.lineTo(pl + pillW - rr, pt);
                    ctx.quadraticCurveTo(pl + pillW, pt, pl + pillW, pt + rr);
                    ctx.lineTo(pl + pillW, pt + pillH - rr);
                    ctx.quadraticCurveTo(pl + pillW, pt + pillH, pl + pillW - rr, pt + pillH);
                    ctx.lineTo(pl + rr, pt + pillH);
                    ctx.quadraticCurveTo(pl, pt + pillH, pl, pt + pillH - rr);
                    ctx.lineTo(pl, pt + rr);
                    ctx.quadraticCurveTo(pl, pt, pl + rr, pt);
                    ctx.closePath();

                    ctx.fillStyle = isHovered
                        ? `rgba(108, 92, 231, 0.25)`
                        : `rgba(12, 12, 20, 0.8)`;
                    ctx.fill();
                    ctx.strokeStyle = `hsla(${skill.hue}, 60%, 60%, ${isHovered ? 0.5 : 0.25})`;
                    ctx.lineWidth = isHovered ? 1.2 : 0.7;
                    ctx.stroke();

                    // Connector line from pill to node
                    ctx.beginPath();
                    ctx.moveTo(pos.x, pos.y - nodeSize);
                    ctx.lineTo(pos.x, pt + pillH);
                    ctx.strokeStyle = `hsla(${skill.hue}, 60%, 60%, ${alpha * 0.2})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();

                    // Text
                    ctx.fillStyle = `rgba(255, 255, 255, ${isHovered ? 1 : alpha * 0.85})`;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(text, lx, ly);
                }
            });

            // ===== Center badge =====
            // Center glow
            const cGlow = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 28);
            cGlow.addColorStop(0, 'rgba(108, 92, 231, 0.15)');
            cGlow.addColorStop(1, 'rgba(108, 92, 231, 0)');
            ctx.beginPath();
            ctx.arc(centerX, centerY, 28, 0, Math.PI * 2);
            ctx.fillStyle = cGlow;
            ctx.fill();

            // Center circle
            ctx.beginPath();
            ctx.arc(centerX, centerY, 16, 0, Math.PI * 2);
            const coreGrad = ctx.createRadialGradient(centerX - 2, centerY - 2, 0, centerX, centerY, 16);
            coreGrad.addColorStop(0, 'rgba(162, 155, 254, 0.3)');
            coreGrad.addColorStop(1, 'rgba(108, 92, 231, 0.15)');
            ctx.fillStyle = coreGrad;
            ctx.fill();
            ctx.strokeStyle = 'rgba(162, 155, 254, 0.4)';
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Rotating arc around center
            ctx.beginPath();
            ctx.arc(centerX, centerY, 22, time * 0.8, time * 0.8 + Math.PI * 0.7);
            ctx.strokeStyle = 'rgba(0, 206, 201, 0.3)';
            ctx.lineWidth = 1.5;
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(centerX, centerY, 22, time * 0.8 + Math.PI, time * 0.8 + Math.PI * 1.5);
            ctx.strokeStyle = 'rgba(108, 92, 231, 0.3)';
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Center text
            ctx.font = `800 8px 'Inter', sans-serif`;
            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('FULL', centerX, centerY - 4);
            ctx.fillText('STACK', centerX, centerY + 5);

            animationId = requestAnimationFrame(animate);
        };

        animate();

        return () => cancelAnimationFrame(animationId);
    }, []);

    return <canvas ref={canvasRef} style={{ cursor: 'crosshair' }} />;
};

export default SkillsSphere;
