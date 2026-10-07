'use client';

import { useState, useEffect } from 'react';
import { scrollToId } from '../lib/smoothScroll';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('home');

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);

            // Track active section
            const sections = ['home', 'about', 'skills', 'experience', 'projects', 'education', 'contact'];
            for (const section of sections.reverse()) {
                const el = document.getElementById(section);
                if (el && window.scrollY >= el.offsetTop - 200) {
                    setActiveSection(section);
                    break;
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
        e.preventDefault();
        setMenuOpen(false);
        scrollToId(sectionId);
    };

    const navItems = [
        { id: 'home', label: 'Home' },
        { id: 'about', label: 'About' },
        { id: 'skills', label: 'Skills' },
        { id: 'experience', label: 'Experience' },
        { id: 'projects', label: 'Projects' },
        { id: 'contact', label: 'Contact' },
    ];

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`} id="navbar">
            <div className="container">
                <a href="#home" className="nav-logo" onClick={(e) => handleNavClick(e, 'home')}>

                </a>
                <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
                    {navItems.map(item => (
                        <li key={item.id}>
                            <a
                                href={`#${item.id}`}
                                className={activeSection === item.id ? 'active' : ''}
                                onClick={(e) => handleNavClick(e, item.id)}
                            >
                                {item.label}
                            </a>
                        </li>
                    ))}
                    <li>
                        <a
                            href={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/assets/anvarsha-kn-cv.pdf`}
                            download="Anvarsha_KN_CV.pdf"
                            className="btn-primary"
                            style={{ padding: '8px 20px', fontSize: '0.85rem', marginLeft: '10px' }}
                        >
                            Download CV
                        </a>
                    </li>
                </ul>
                <button
                    className={`mobile-toggle ${menuOpen ? 'active' : ''}`}
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle menu"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
