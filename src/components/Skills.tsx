'use client';

import { useEffect, useRef, useState } from 'react';
import { skillCategories } from '../data/skills';

const Skills = () => {
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.querySelectorAll('.reveal').forEach((el, i) => {
                            setTimeout(() => el.classList.add('active'), i * 150);
                        });
                    }
                });
            },
            { threshold: 0.1 }
        );

        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <section className="section" id="skills" ref={sectionRef}>
            <div className="container">
                <div className="section-header reveal">
                    <span className="section-label">My Skills</span>
                    <h2 className="section-title">Technologies & Expertise</h2>
                    <p className="section-subtitle">
                        A diverse toolkit for building modern, full-stack web applications
                    </p>
                </div>

                <div className="skills-grid">
                    {skillCategories.map((category, index) => (
                        <SkillCard key={index} category={category} />
                    ))}
                </div>
            </div>
        </section>
    );
};

const SkillCard = ({ category }: { category: { title: string; icon: React.ReactNode; iconBg: string; skills: string[] } }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [style, setStyle] = useState<React.CSSProperties & Record<string, string>>({});

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const { left, top, width, height } = cardRef.current.getBoundingClientRect();
        const x = (e.clientX - left - width / 2) / 25;
        const y = (e.clientY - top - height / 2) / 25;
        const glareX = ((e.clientX - left) / width) * 100;
        const glareY = ((e.clientY - top) / height) * 100;

        setStyle({
            transform: `rotateY(${x}deg) rotateX(${y * -1}deg) scale(1.02)`,
            '--glare-x': `${glareX}%`,
            '--glare-y': `${glareY}%`,
        });
    };

    const handleMouseLeave = () => {
        setStyle({ transform: 'rotateY(0deg) rotateX(0deg) scale(1)' });
    };

    return (
        <div
            className="skill-category reveal"
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                ...style,
                transition: 'transform 0.1s ease-out',
                transformStyle: 'preserve-3d',
                perspective: '1000px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-glass)',
                borderRadius: '20px',
                padding: '32px',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            <div
                className="card-glare"
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: `radial-gradient(circle at var(--glare-x, 50%) var(--glare-y, 50%), rgba(255,255,255,0.1), transparent 60%)`,
                    pointerEvents: 'none',
                    zIndex: 10,
                    opacity: style.transform ? 1 : 0,
                    transition: 'opacity 0.3s',
                    borderRadius: '20px',
                }}
            />
            <div className="skill-category-header" style={{ transform: 'translateZ(20px)', zIndex: 3 }}>
                <div className="skill-category-icon" style={{ background: category.iconBg }}>
                    {category.icon}
                </div>
                <h3 className="skill-category-title">{category.title}</h3>
            </div>
            <div className="skill-tags" style={{ transform: 'translateZ(10px)', zIndex: 3 }}>
                {category.skills.map((skill, i) => (
                    <span className="skill-tag" key={i}>{skill}</span>
                ))}
            </div>
        </div>
    );
};

export default Skills;
