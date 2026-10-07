'use client';

import { LinkedinIcon, GithubIcon, MailIcon, PhoneIcon } from './Icons';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="container">
                <p className="footer-text">
                    © {currentYear} Anvarsha KN. All Rights Reserved.
                </p>
                <div className="footer-socials">
                    <a
                        href="https://linkedin.com/in/anvarshakn"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-link"
                        aria-label="LinkedIn"
                    >
                        <LinkedinIcon size={20} />
                    </a>
                    <a
                        href="https://github.com/anvar010"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-link"
                        aria-label="GitHub"
                    >
                        <GithubIcon size={20} />
                    </a>
                    <a
                        href="mailto:anvarshaknavas588@gmail.com"
                        className="social-link"
                        aria-label="Email"
                    >
                        <MailIcon size={20} />
                    </a>
                    <a
                        href="tel:+971569672392"
                        className="social-link"
                        aria-label="Phone"
                    >
                        <PhoneIcon size={20} />
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
