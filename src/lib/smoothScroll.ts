import type Lenis from 'lenis';

let instance: Lenis | null = null;

export const setLenis = (lenis: Lenis | null) => {
    instance = lenis;
};

export const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (instance) instance.scrollTo(el);
    else el.scrollIntoView({ behavior: 'smooth' });
};
