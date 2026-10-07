'use client';

import { useEffect, useRef, useState } from 'react';
import { MailIcon, PhoneIcon, LinkedinIcon, GithubIcon, LocationIcon, RocketIcon } from './Icons';

const Contact = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [sending, setSending] = useState(false);
    const [status, setStatus] = useState(''); // 'success', 'error', ''

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach((el, i) => {
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

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSending(true);
        setStatus('');

        try {
            const response = await fetch('https://formsubmit.co/ajax/anvarshaknavas588@gmail.com', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    _subject: formData.subject || 'New Portfolio Contact',
                    message: formData.message,
                    _template: 'table',
                }),
            });

            if (response.ok) {
                setStatus('success');
                setFormData({ name: '', email: '', subject: '', message: '' });
            } else {
                setStatus('error');
            }
        } catch (err) {
            setStatus('error');
        }

        setSending(false);
        setTimeout(() => setStatus(''), 5000);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <section className="section" id="contact" ref={sectionRef}>
            <div className="container">
                <div className="section-header reveal">
                    <span className="section-label">Get in Touch</span>
                    <h2 className="section-title">Let's Work Together</h2>
                    <p className="section-subtitle">
                        Have a project in mind? Let's discuss how we can bring your ideas to life
                    </p>
                </div>

                <div className="contact-grid">
                    <div className="contact-info reveal-left">
                        <h3>Let's connect and create something amazing</h3>
                        <p>
                            I'm always open to discussing new projects, creative ideas, or
                            opportunities to be part of your vision. Feel free to reach out
                            through any of the channels below.
                        </p>
                        <div className="contact-methods">
                            <a href="mailto:anvarshaknavas588@gmail.com" className="contact-method">
                                <div className="method-icon" style={{ background: 'rgba(108, 92, 231, 0.15)' }}>
                                    <MailIcon size={24} />
                                </div>
                                <div className="method-text">
                                    <span>Email</span>
                                    <strong>anvarshaknavas588@gmail.com</strong>
                                </div>
                            </a>
                            <a href="tel:+971569672392" className="contact-method">
                                <div className="method-icon" style={{ background: 'rgba(0, 206, 201, 0.15)' }}>
                                    <PhoneIcon size={24} />
                                </div>
                                <div className="method-text">
                                    <span>Phone</span>
                                    <strong>+971 569672392</strong>
                                </div>
                            </a>
                            <a href="https://linkedin.com/in/anvarshakn" target="_blank" rel="noopener noreferrer" className="contact-method">
                                <div className="method-icon" style={{ background: 'rgba(0, 184, 148, 0.15)' }}>
                                    <LinkedinIcon size={24} />
                                </div>
                                <div className="method-text">
                                    <span>LinkedIn</span>
                                    <strong>linkedin.com/in/anvarshakn</strong>
                                </div>
                            </a>
                            <a href="https://github.com/anvar010" target="_blank" rel="noopener noreferrer" className="contact-method">
                                <div className="method-icon" style={{ background: 'rgba(253, 121, 168, 0.15)' }}>
                                    <GithubIcon size={24} />
                                </div>
                                <div className="method-text">
                                    <span>GitHub</span>
                                    <strong>github.com/anvar010</strong>
                                </div>
                            </a>
                            <div className="contact-method" style={{ cursor: 'default' }}>
                                <div className="method-icon" style={{ background: 'rgba(225, 112, 85, 0.15)' }}>
                                    <LocationIcon size={24} />
                                </div>
                                <div className="method-text">
                                    <span>Location</span>
                                    <strong>Dubai, UAE</strong>
                                </div>
                            </div>
                        </div>
                    </div>

                    <form className="contact-form reveal-right" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="contact-name">Your Name</label>
                            <input
                                type="text"
                                id="contact-name"
                                name="name"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="contact-email">Your Email</label>
                            <input
                                type="email"
                                id="contact-email"
                                name="email"
                                placeholder="john@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="contact-subject">Subject</label>
                            <input
                                type="text"
                                id="contact-subject"
                                name="subject"
                                placeholder="Project Discussion"
                                value={formData.subject}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="contact-message">Message</label>
                            <textarea
                                id="contact-message"
                                name="message"
                                placeholder="Tell me about your project..."
                                value={formData.message}
                                onChange={handleChange}
                                required
                            ></textarea>
                        </div>
                        <button type="submit" className="btn-primary form-submit" disabled={sending} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                            {sending ? 'Sending...' : <><RocketIcon size={20} /> Send Message</>}
                        </button>
                        {status === 'success' && (
                            <div style={{
                                marginTop: '16px',
                                padding: '12px 20px',
                                background: 'rgba(0, 184, 148, 0.1)',
                                border: '1px solid rgba(0, 184, 148, 0.3)',
                                borderRadius: '12px',
                                color: '#00b894',
                                fontSize: '0.9rem',
                                fontWeight: '500',
                                textAlign: 'center',
                            }}>
                                ✅ Message sent successfully! I'll get back to you soon.
                            </div>
                        )}
                        {status === 'error' && (
                            <div style={{
                                marginTop: '16px',
                                padding: '12px 20px',
                                background: 'rgba(255, 59, 59, 0.1)',
                                border: '1px solid rgba(255, 59, 59, 0.3)',
                                borderRadius: '12px',
                                color: '#ff4757',
                                fontSize: '0.9rem',
                                fontWeight: '500',
                                textAlign: 'center',
                            }}>
                                ❌ Something went wrong. Please try again or email me directly.
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </section>
    );
};

export default Contact;
