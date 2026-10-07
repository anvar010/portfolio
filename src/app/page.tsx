'use client';

import { useEffect, useState } from 'react';
import ParticleCanvas from '../components/ParticleCanvas';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Skills from '../components/Skills';
import Experience from '../components/Experience';
import Projects from '../components/Projects';
import Education from '../components/Education';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';
import SmoothScroll from '../components/SmoothScroll';

export default function Home() {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <>
            <SmoothScroll />
            <ParticleCanvas />
            <div
                className="cursor-glow"
                style={{
                    left: mousePos.x,
                    top: mousePos.y,
                }}
            />
            <Navbar />
            <main>
                <Hero />
                <About />
                <Skills />
                <Experience />
                <Projects />
                <Education />
                <Contact />
            </main>
            <Footer />
            <WhatsAppButton />
        </>
    );
}

