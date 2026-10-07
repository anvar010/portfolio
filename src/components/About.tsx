'use client';

import { useEffect, useRef } from 'react';

const About = () => {
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach((el, i) => {
                            setTimeout(() => el.classList.add('active'), i * 100);
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
        <section className="section" id="about" ref={sectionRef}>
            <div className="container">
                <div className="section-header reveal">
                    <span className="section-label">About Me</span>
                    <h2 className="section-title">About Anvarsha KN, MERN Stack Developer</h2>
                    <p className="section-subtitle">
                        Turning ideas into elegant, functional web experiences
                    </p>
                </div>

                <div className="about-grid">
                    <div className="about-text reveal-left">
                        <p>
                            I'm <strong>Anvarsha KN</strong>, a highly motivated engineering graduate with a
                            Bachelor's degree in <strong>Computer Science Engineering</strong> from APJ Abdul Kalam
                            Technological University. I have a keen interest in Software development and possess
                            strong interpersonal and analytical skills.
                        </p>
                        <p>
                            With hands-on experience in the <strong>MERN Stack</strong> — MongoDB, Express.js,
                            React.js, and Node.js — I build full-stack web applications that are responsive,
                            performant, and user-friendly. I also bring expertise in <strong>Digital Marketing</strong>,
                            SEO, and WordPress development.
                        </p>
                        <div className="about-info-grid">
                            <div className="about-info-item">
                                <span className="info-icon">📍</span>
                                <div className="info-text">
                                    <span>Location</span>
                                    <strong>Dubai, UAE</strong>
                                </div>
                            </div>
                            <div className="about-info-item">
                                <span className="info-icon">📧</span>
                                <div className="info-text">
                                    <span>Email</span>
                                    <strong>anvarshaknavas588@gmail.com</strong>
                                </div>
                            </div>
                            <div className="about-info-item">
                                <span className="info-icon">📱</span>
                                <div className="info-text">
                                    <span>Phone</span>
                                    <strong>+971 569672392</strong>
                                </div>
                            </div>
                            <div className="about-info-item">
                                <span className="info-icon">🎓</span>
                                <div className="info-text">
                                    <span>Degree</span>
                                    <strong>B.Tech CSE</strong>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="about-cards reveal-right">
                        <div className="about-card">
                            <div className="card-number">2+</div>
                            <div className="card-label">Years of Experience</div>
                        </div>
                        <div className="about-card">
                            <div className="card-number">5+</div>
                            <div className="card-label">Projects Completed</div>
                        </div>
                        <div className="about-card">
                            <div className="card-number">3+</div>
                            <div className="card-label">Companies Worked</div>
                        </div>
                        <div className="about-card">
                            <div className="card-number">4</div>
                            <div className="card-label">Languages Spoken</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
