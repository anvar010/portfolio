'use client';

import { useEffect, useRef } from 'react';
import { CartIcon, CarIcon, CameraIcon, GlobeIcon, FilmIcon, ServerIcon, CodeIcon, UsersIcon, CalendarCheckIcon, ReceiptIcon } from './Icons';

type Project = {
    title: string;
    desc: string;
    points?: string[];
    tags: string[];
    icon: React.ReactNode;
};

const GITHUB_URL = 'https://github.com/anvar010';

const systems: Project[] = [
    {
        title: 'CRM',
        desc: 'A custom CRM that replaces scattered spreadsheets with one source of truth for every client.',
        points: ['Client profiles', 'Treatment history', 'Follow-up reminders', 'Communication log'],
        tags: ['MERN', 'MongoDB', 'Express', 'React.js', 'Node.js'],
        icon: <UsersIcon size={28} />,
    },
    {
        title: 'Booking Management',
        desc: 'Schedules appointments and tracks each booking from request to completion.',
        points: ['Appointment scheduling', 'Service catalog', 'Staff availability'],
        tags: ['MERN', 'MongoDB', 'Express', 'React.js', 'Node.js'],
        icon: <CalendarCheckIcon size={28} />,
    },
    {
        title: 'Point of Sale (POS)',
        desc: 'Fast billing at the counter, with the catalog, payments, receipts and sales reports in one system.',
        points: ['Quick billing', 'Product and service catalog', 'Payments and receipts', 'Sales reports'],
        tags: ['React.js', 'Node.js', 'MongoDB', 'Tailwind CSS'],
        icon: <ReceiptIcon size={28} />,
    },
];

const more: Project[] = [
    {
        title: 'E-Commerce Platform',
        desc: 'A full-featured e-commerce platform built with MERN Stack fundamentals. Includes user registration & login, product catalog, shopping cart, checkout process, and payment gateway integration with a responsive UI.',
        tags: ['MongoDB', 'Express', 'React.js', 'Node.js', 'Tailwind CSS'],
        icon: <CartIcon size={26} />,
    },
    {
        title: 'Driver Drowsiness Detection System',
        desc: 'An IoT-based system aimed at tackling road accidents caused by driver fatigue. Detects driver fatigue and responds in a predefined procedure using IoT sensors and real-time monitoring.',
        tags: ['IoT', 'Python', 'Sensors', 'Real-time'],
        icon: <CarIcon size={26} />,
    },
    {
        title: 'Pedagogue Attendance Tracking',
        desc: 'A robust system to track attendance and punctuality in real time, enhancing accountability. Utilizes face recognition through live webcam and processing against available datasets.',
        tags: ['PHP', 'XAMP', 'HTML', 'CSS', 'JS', 'MySQL', 'Python'],
        icon: <CameraIcon size={26} />,
    },
    {
        title: 'Al Reem Business Website',
        desc: 'Developed and maintained a professional business website using WordPress. Implemented SEO best practices and digital marketing strategies for increased traffic and visibility.',
        tags: ['WordPress', 'SEO', 'Digital Marketing', 'CSS'],
        icon: <GlobeIcon size={26} />,
    },
    {
        title: 'Rawmax Media Website',
        desc: 'Designed and implemented user-friendly interfaces ensuring seamless user experience across various devices and platforms with cross-browser compatibility.',
        tags: ['React.js', 'HTML', 'CSS', 'JavaScript'],
        icon: <FilmIcon size={26} />,
    },
    {
        title: 'Company Email Server',
        desc: 'Configured and set up a secure, efficient email server for Sabha Technology. Managed email protocols (SMTP, IMAP, POP3) with robust security features including spam filtering and encryption.',
        tags: ['SMTP', 'IMAP', 'POP3', 'Security', 'Linux'],
        icon: <ServerIcon size={26} />,
    },
];

const Projects = () => {
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.querySelectorAll('.reveal').forEach((el, i) => {
                            setTimeout(() => el.classList.add('active'), i * 120);
                        });
                    }
                });
            },
            { threshold: 0.1 }
        );

        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    const [crm, booking, pos] = systems;

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

                <div className="pj-lounge reveal">
                    <header className="pj-lounge-head">
                        <h3>IV Wellness Lounge Dubai</h3>
                        <p>A CRM and a booking system built to run the lounge day to day.</p>
                    </header>
                    <div className="pj-lounge-body">
                        <SystemColumn project={crm} />
                        <SystemColumn project={booking} />
                    </div>
                </div>

                <Spotlight className="pj-pos reveal">
                    <div className="pj-pos-main">
                        <span className="pj-system-icon" aria-hidden="true">{pos.icon}</span>
                        <h3 className="pj-system-title">{pos.title}</h3>
                        <p className="pj-system-desc">{pos.desc}</p>
                        <div className="project-tags">
                            {pos.tags.map((t) => (
                                <span className="project-tag" key={t}>{t}</span>
                            ))}
                        </div>
                        <CodeLink title={pos.title} />
                    </div>
                    <PointTiles points={pos.points ?? []} />
                </Spotlight>

                <h3 className="pj-group reveal">More work</h3>
                <div className="pj-grid">
                    {more.map((p) => (
                        <Spotlight key={p.title} className="pj-card reveal">
                            <span className="pj-card-icon" aria-hidden="true">{p.icon}</span>
                            <h4 className="pj-card-title">{p.title}</h4>
                            <p className="pj-card-desc">{p.desc}</p>
                            <div className="pj-card-foot">
                                <div className="project-tags">
                                    {p.tags.map((t) => (
                                        <span className="project-tag" key={t}>{t}</span>
                                    ))}
                                </div>
                                <CodeLink title={p.title} />
                            </div>
                        </Spotlight>
                    ))}
                </div>
            </div>
        </section>
    );
};

const CodeLink = ({ title }: { title: string }) => (
    <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="project-link" aria-label={`View code for ${title} on GitHub`}>
        <CodeIcon size={18} /> View Code
    </a>
);

const PointTiles = ({ points }: { points: string[] }) => (
    <ul className="pj-tiles">
        {points.map((pt) => (
            <li key={pt}>{pt}</li>
        ))}
    </ul>
);

const SystemColumn = ({ project }: { project: Project }) => (
    <div className="pj-col">
        <span className="pj-system-icon" aria-hidden="true">{project.icon}</span>
        <h4 className="pj-system-title">{project.title}</h4>
        <p className="pj-system-desc">{project.desc}</p>
        <PointTiles points={project.points ?? []} />
        <div className="pj-col-foot">
            <div className="project-tags">
                {project.tags.map((t) => (
                    <span className="project-tag" key={t}>{t}</span>
                ))}
            </div>
            <CodeLink title={`${project.title} (IV Wellness Lounge)`} />
        </div>
    </div>
);

// Pointer position goes straight to CSS variables, so hovering never re-renders React.
const Spotlight = ({ className, children }: { className: string; children: React.ReactNode }) => {
    const ref = useRef<HTMLDivElement>(null);

    const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        el.style.setProperty('--mx', `${e.clientX - r.left}px`);
        el.style.setProperty('--my', `${e.clientY - r.top}px`);
    };

    return (
        <div ref={ref} className={`pj-spot ${className}`} onPointerMove={onMove}>
            {children}
        </div>
    );
};

export default Projects;
