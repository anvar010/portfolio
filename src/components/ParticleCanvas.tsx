'use client';

import { useEffect, useRef } from 'react';

const ParticleCanvas = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current as HTMLCanvasElement;
        if (!canvas) return;
        const ctx = canvas.getContext('2d')!;
        let animationId: number;
        let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
        let time = 0;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        resize();
        window.addEventListener('resize', resize);
        window.addEventListener('mousemove', (e: MouseEvent) => {
            mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
            mouse.targetY = (e.clientY / window.innerHeight - 0.5) * 2;
        });

        // ===== 3D Math Helpers =====
        const project = (x: number, y: number, z: number, cx: number, cy: number) => {
            const fov = 600;
            const scale = fov / (fov + z);
            return {
                x: x * scale + cx,
                y: y * scale + cy,
                scale: scale,
            };
        };

        const rotateX = (y: number, z: number, angle: number) => {
            const cos = Math.cos(angle);
            const sin = Math.sin(angle);
            return { y: y * cos - z * sin, z: y * sin + z * cos };
        };

        const rotateY = (x: number, z: number, angle: number) => {
            const cos = Math.cos(angle);
            const sin = Math.sin(angle);
            return { x: x * cos - z * sin, z: x * sin + z * cos };
        };

        // ===== 3D Sphere Wireframe =====
        class WireframeSphere {
            radius: number;
            vertices: { x: number; y: number; z: number }[];
            edges: [number, number][];
            rotX: number;
            rotY: number;

            constructor(radius: number, latLines: number, lonLines: number) {
                this.radius = radius;
                this.vertices = [];
                this.edges = [];
                this.rotX = 0;
                this.rotY = 0;

                for (let lat = 0; lat <= latLines; lat++) {
                    const theta = (lat / latLines) * Math.PI;
                    for (let lon = 0; lon <= lonLines; lon++) {
                        const phi = (lon / lonLines) * Math.PI * 2;
                        const x = radius * Math.sin(theta) * Math.cos(phi);
                        const y = radius * Math.cos(theta);
                        const z = radius * Math.sin(theta) * Math.sin(phi);
                        this.vertices.push({ x, y, z });
                    }
                }

                for (let lat = 0; lat <= latLines; lat++) {
                    for (let lon = 0; lon < lonLines; lon++) {
                        const i = lat * (lonLines + 1) + lon;
                        this.edges.push([i, i + 1]);
                    }
                }

                for (let lon = 0; lon <= lonLines; lon++) {
                    for (let lat = 0; lat < latLines; lat++) {
                        const i = lat * (lonLines + 1) + lon;
                        this.edges.push([i, i + lonLines + 1]);
                    }
                }
            }

            draw(cx: number, cy: number) {
                this.rotX += (mouse.targetY * 0.3 - this.rotX) * 0.02;
                this.rotY += (mouse.targetX * 0.3 - this.rotY) * 0.02;

                const autoRotY = time * 0.15;
                const autoRotX = Math.sin(time * 0.08) * 0.1;

                const projected = this.vertices.map((v) => {
                    let { x, y, z } = v;
                    const ry = rotateY(x, z, autoRotY + this.rotY);
                    x = ry.x; z = ry.z;
                    const rx = rotateX(y, z, autoRotX + this.rotX);
                    y = rx.y; z = rx.z;
                    return project(x, y, z, cx, cy);
                });

                this.edges.forEach(([i, j]) => {
                    const a = projected[i];
                    const b = projected[j];
                    if (!a || !b) return;
                    const avgScale = (a.scale + b.scale) / 2;
                    const opacity = Math.max(0, Math.min(0.25, avgScale * 0.3));
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.strokeStyle = `rgba(108, 92, 231, ${opacity})`;
                    ctx.lineWidth = avgScale * 0.8;
                    ctx.stroke();
                });

                projected.forEach((p) => {
                    const glowSize = p.scale * 2;
                    const opacity = Math.max(0, Math.min(0.6, p.scale * 0.5));
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, glowSize, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(162, 155, 254, ${opacity})`;
                    ctx.fill();
                });
            }
        }

        // ===== Orbiting Ring Particles =====
        class OrbitParticle {
            radius: number;
            speed: number;
            angle: number;
            tilt: number;
            size: number;
            hue: number;
            brightness: number;

            constructor(radius: number, speed: number, offset: number, tilt: number) {
                this.radius = radius;
                this.speed = speed;
                this.angle = offset;
                this.tilt = tilt;
                this.size = Math.random() * 2.5 + 1;
                this.hue = Math.random() > 0.5 ? 260 : 180;
                this.brightness = Math.random() * 30 + 50;
            }

            update() {
                this.angle += this.speed;
            }

            draw(cx: number, cy: number) {
                let x = Math.cos(this.angle) * this.radius;
                let y = Math.sin(this.angle) * this.radius * 0.3;
                let z = Math.sin(this.angle) * this.radius;

                const rx = rotateX(y, z, this.tilt);
                y = rx.y; z = rx.z;

                const autoRotY = time * 0.15;
                const ry = rotateY(x, z, autoRotY + mouse.targetX * 0.3);
                x = ry.x; z = ry.z;
                const rx2 = rotateX(y, z, Math.sin(time * 0.08) * 0.1 + mouse.targetY * 0.3 * 0.02);
                y = rx2.y; z = rx2.z;

                const p = project(x, y, z, cx, cy);
                const opacity = Math.max(0, Math.min(1, p.scale * 0.8));
                const size = this.size * p.scale;

                const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, size * 4);
                gradient.addColorStop(0, `hsla(${this.hue}, 70%, ${this.brightness}%, ${opacity})`);
                gradient.addColorStop(1, `hsla(${this.hue}, 70%, ${this.brightness}%, 0)`);
                ctx.beginPath();
                ctx.arc(p.x, p.y, size * 4, 0, Math.PI * 2);
                ctx.fillStyle = gradient;
                ctx.fill();

                ctx.beginPath();
                ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${this.hue}, 80%, 75%, ${opacity})`;
                ctx.fill();
            }
        }

        // ===== Background Stars =====
        class Star {
            x!: number;
            y!: number;
            z!: number;
            prevZ!: number;
            speed!: number;

            constructor() {
                this.reset();
            }

            reset() {
                this.x = (Math.random() - 0.5) * 2000;
                this.y = (Math.random() - 0.5) * 2000;
                this.z = Math.random() * 2000;
                this.prevZ = this.z;
                this.speed = Math.random() * 1.5 + 0.3;
            }

            update() {
                this.prevZ = this.z;
                this.z -= this.speed;
                if (this.z < 1) this.reset();
            }

            draw(cx: number, cy: number) {
                const p = project(this.x, this.y, this.z, cx, cy);
                const pp = project(this.x, this.y, this.prevZ, cx, cy);
                const size = (1 - this.z / 2000) * 1.5;
                const opacity = (1 - this.z / 2000) * 0.7;

                ctx.beginPath();
                ctx.moveTo(pp.x, pp.y);
                ctx.lineTo(p.x, p.y);
                ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.3})`;
                ctx.lineWidth = size * 0.5;
                ctx.stroke();

                ctx.beginPath();
                ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
                ctx.fill();
            }
        }

        // ===== Nebula Clouds =====
        class NebulaCloud {
            x: number;
            y: number;
            radius: number;
            speedX: number;
            speedY: number;
            hue: number;
            opacity: number;

            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.radius = Math.random() * 200 + 100;
                this.speedX = (Math.random() - 0.5) * 0.15;
                this.speedY = (Math.random() - 0.5) * 0.15;
                this.hue = [260, 180, 310, 200][Math.floor(Math.random() * 4)];
                this.opacity = Math.random() * 0.03 + 0.01;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.x < -this.radius) this.x = canvas.width + this.radius;
                if (this.x > canvas.width + this.radius) this.x = -this.radius;
                if (this.y < -this.radius) this.y = canvas.height + this.radius;
                if (this.y > canvas.height + this.radius) this.y = -this.radius;
            }

            draw() {
                const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
                gradient.addColorStop(0, `hsla(${this.hue}, 60%, 50%, ${this.opacity * 1.5})`);
                gradient.addColorStop(0.5, `hsla(${this.hue}, 50%, 40%, ${this.opacity})`);
                gradient.addColorStop(1, `hsla(${this.hue}, 40%, 30%, 0)`);
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = gradient;
                ctx.fill();
            }
        }

        // ===== Initialize =====
        const sphere = new WireframeSphere(180, 12, 16);

        const orbitParticles: OrbitParticle[] = [];
        for (let i = 0; i < 40; i++) {
            orbitParticles.push(
                new OrbitParticle(
                    Math.random() * 80 + 200,
                    (Math.random() * 0.008 + 0.003) * (Math.random() > 0.5 ? 1 : -1),
                    Math.random() * Math.PI * 2,
                    Math.random() * Math.PI * 0.8 - Math.PI * 0.4
                )
            );
        }

        const stars: Star[] = [];
        for (let i = 0; i < 200; i++) {
            stars.push(new Star());
        }

        const nebulae: NebulaCloud[] = [];
        for (let i = 0; i < 5; i++) {
            nebulae.push(new NebulaCloud());
        }

        // ===== Animation Loop =====
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            time += 0.01;

            mouse.x += (mouse.targetX - mouse.x) * 0.05;
            mouse.y += (mouse.targetY - mouse.y) * 0.05;

            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;

            nebulae.forEach((n) => { n.update(); n.draw(); });
            stars.forEach((s) => { s.update(); s.draw(centerX, centerY); });
            sphere.draw(centerX, centerY);
            orbitParticles.forEach((p) => { p.update(); p.draw(centerX, centerY); });

            animationId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationId);
        };
    }, []);

    return (
        <div className="canvas-container">
            <canvas ref={canvasRef} />
        </div>
    );
};

export default ParticleCanvas;
