'use client';

import { useEffect, useRef, useState } from 'react';
import { CartIcon, CarIcon, CameraIcon, GlobeIcon, FilmIcon, ServerIcon, GithubIcon, CodeIcon } from './Icons';

const Projects = () => {
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

    const projects = [
        {
            title: 'E-Commerce Platform',
            desc: 'A full-featured e-commerce platform built with MERN Stack fundamentals. Includes user registration & login, product catalog, shopping cart, checkout process, and payment gateway integration with a responsive UI.',
            tags: ['MongoDB', 'Express', 'React.js', 'Node.js', 'Tailwind CSS'],
            gradient: 'linear-gradient(135deg, rgba(108, 92, 231, 0.4), rgba(0, 206, 201, 0.2))',
            icon: <CartIcon size={48} />,
        },
        {
            title: 'Driver Drowsiness Detection System',
            desc: 'An IoT-based system aimed at tackling road accidents caused by driver fatigue. Detects driver fatigue and responds in a predefined procedure using IoT sensors and real-time monitoring.',
            tags: ['IoT', 'Python', 'Sensors', 'Real-time'],
            gradient: 'linear-gradient(135deg, rgba(253, 121, 168, 0.4), rgba(225, 112, 85, 0.2))',
            icon: <CarIcon size={48} />,
        },
        {
            title: 'Pedagogue Attendance Tracking',
            desc: 'A robust system to track attendance and punctuality in real time, enhancing accountability. Utilizes face recognition through live webcam and processing against available datasets.',
            tags: ['PHP', 'XAMP', 'HTML', 'CSS', 'JS', 'MySQL', 'Python'],
            gradient: 'linear-gradient(135deg, rgba(0, 184, 148, 0.4), rgba(0, 206, 201, 0.2))',
            icon: <CameraIcon size={48} />,
        },
        {
            title: 'Al Reem Business Website',
            desc: 'Developed and maintained a professional business website using WordPress. Implemented SEO best practices and digital marketing strategies for increased traffic and visibility.',
            tags: ['WordPress', 'SEO', 'Digital Marketing', 'CSS'],
            gradient: 'linear-gradient(135deg, rgba(162, 155, 254, 0.4), rgba(108, 92, 231, 0.2))',
            icon: <GlobeIcon size={48} />,
        },
        {
            title: 'Rawmax Media Website',
            desc: 'Designed and implemented user-friendly interfaces ensuring seamless user experience across various devices and platforms with cross-browser compatibility.',
            tags: ['React.js', 'HTML', 'CSS', 'JavaScript'],
            gradient: 'linear-gradient(135deg, rgba(0, 206, 201, 0.4), rgba(108, 92, 231, 0.2))',
            icon: <FilmIcon size={48} />,
        },
        {
            title: 'Company Email Server',
            desc: 'Configured and set up a secure, efficient email server for Sabha Technology. Managed email protocols (SMTP, IMAP, POP3) with robust security features including spam filtering and encryption.',
            tags: ['SMTP', 'IMAP', 'POP3', 'Security', 'Linux'],
            gradient: 'linear-gradient(135deg, rgba(225, 112, 85, 0.4), rgba(253, 121, 168, 0.2))',
            icon: <ServerIcon size={48} />,
        },
    ];

    return (
        <section className="section" id="projects" ref={sectionRef}>
            <div className="container">
                <div className="section-header reveal">
                    <span className="section-label">Portfolio</span>
                    <h2 className="section-title">Featured Projects</h2>
                    <p className="section-subtitle">
                        A selection of projects that demonstrate my skills and experience
                    </p>
                </div>

                <div className="projects-grid">
                    {projects.map((project, index) => (
                        <ProjectCard key={index} project={project} />
                    ))}
                </div>
            </div>
        </section>
    );
};

const ProjectCard = ({ project }: { project: { title: string; desc: string; tags: string[]; gradient: string; icon: React.ReactNode } }) => {
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
            className="project-card reveal"
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                ...style,
                transition: 'transform 0.1s ease-out',
                transformStyle: 'preserve-3d',
                perspective: '1000px',
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
                    background: `radial-gradient(circle at var(--glare-x, 50%) var(--glare-y, 50%), rgba(255,255,255,0.15), transparent 60%)`,
                    pointerEvents: 'none',
                    zIndex: 10,
                    opacity: style.transform ? 1 : 0,
                    transition: 'opacity 0.3s',
                    borderRadius: '20px',
                }}
            />
            <div className="project-image" style={{ background: project.gradient, transform: 'translateZ(20px)' }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    color: 'rgba(255, 255, 255, 0.9)',
                    transform: 'translateZ(30px)',
                    filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.2))'
                }}>
                    {project.icon}
                </div>
            </div>
            <div className="project-body" style={{ transform: 'translateZ(10px)', background: 'var(--bg-card)' }}>
                <div className="project-tags">
                    {project.tags.map((tag, i) => (
                        <span className="project-tag" key={i}>{tag}</span>
                    ))}
                </div>
                <h3 className="project-title">{project.title}</h3>
                <p className="project-desc">{project.desc}</p>
                <div className="project-links">
                    <a href="https://github.com/anvar010" target="_blank" rel="noopener noreferrer" className="project-link" aria-label={`View code for ${project.title} on GitHub`}>
                        <CodeIcon size={18} /> View Code
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Projects;
