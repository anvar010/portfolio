'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import gsap from 'gsap';
import { setLenis } from '../lib/smoothScroll';

const SmoothScroll = () => {
    useEffect(() => {
        const lenis = new Lenis({ duration: 1.2, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
        gsap.registerPlugin(ScrollTrigger);
        lenis.on('scroll', ScrollTrigger.update);
        setLenis(lenis);

        let rafId = requestAnimationFrame(function raf(time) {
            lenis.raf(time);
            rafId = requestAnimationFrame(raf);
        });

        return () => {
            cancelAnimationFrame(rafId);
            lenis.destroy();
            setLenis(null);
        };
    }, []);

    return null;
};

export default SmoothScroll;
