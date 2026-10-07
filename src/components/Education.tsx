'use client';

import { useEffect, useRef } from 'react';

const Education = () => {
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

    const languages = [
        { name: 'English', icon: '🇬🇧' },
        { name: 'Malayalam', icon: '🇮🇳' },
        { name: 'Hindi', icon: '🇮🇳' },
        { name: 'Tamil', icon: '🇮🇳' },
    ];

    return (
        <section className="section" id="education" ref={sectionRef}>
            <div className="container">
                <div className="section-header reveal">
                    <span className="section-label">Education</span>
                    <h2 className="section-title">Academic Background</h2>
                    <p className="section-subtitle">
                        My educational foundation and academic projects
                    </p>
                </div>

                <div className="education-card reveal">
                    <div className="education-icon">🎓</div>
                    <h3 className="education-degree">Bachelor of Technology — Computer Science Engineering</h3>
                    <p className="education-school">APJ Abdul Kalam Technological University</p>
                    <p className="education-year">2019 — 2023</p>

                    <div className="education-projects">
                        <h4>📋 Academic Projects</h4>
                        <div className="edu-project-item">
                            <h5>🚗 Driver Drowsiness Detection System Using IoT</h5>
                            <p>
                                Conceptualized a system aiming to tackle road accidents caused by driver fatigue.
                                Identified potential cause and effects of driver fatigue. Programmed to detect driver
                                fatigue and respond in a predefined procedure using IoT sensors and real-time data processing.
                            </p>
                        </div>
                        <div className="edu-project-item">
                            <h5>📸 Tracking Pedagogue Appearance Methodology</h5>
                            <p>
                                Conceptualized a robust system to track attendance and punctuality in real time,
                                enhancing accountability. Utilized face recognition through live webcam and processing
                                against available dataset. Built with PHP, XAMP, HTML, CSS, JS, MySQL, and Python.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Languages Section */}
                <div style={{ marginTop: '60px' }}>
                    <div className="section-header reveal">
                        <span className="section-label">Languages</span>
                        <h2 className="section-title" style={{ fontSize: '2rem' }}>Languages I Speak</h2>
                    </div>
                    <div className="languages-grid reveal">
                        {languages.map((lang, index) => (
                            <div className="language-card" key={index}>
                                <div className="lang-icon">{lang.icon}</div>
                                <div className="lang-name">{lang.name}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Education;
