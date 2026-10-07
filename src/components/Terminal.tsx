'use client';

import { useEffect, useRef, useState } from 'react';

type Out = { text: string; cls?: string };
type Step = { cmd: string; out: Out[] };

const steps: Step[] = [
    {
        cmd: 'whoami',
        out: [{ text: 'anvarsha-kn · MERN Stack Web Developer', cls: 't-cyan' }],
    },
    {
        cmd: 'cat stack.json',
        out: [
            { text: '{' },
            { text: '  "core":      ["React.js", "Node.js", "MongoDB", "Express"],', cls: 't-purple' },
            { text: '  "frontend":  ["JavaScript", "HTML5", "CSS3"],', cls: 't-cyan' },
            { text: '  "styling":   ["Bootstrap", "Tailwind"],', cls: 't-cyan' },
            { text: '  "backend":   ["Python", "PHP", "MySQL"],', cls: 't-green' },
            { text: '  "mobile":    ["React Native"],', cls: 't-pink' },
            { text: '  "tools":     ["Git", "GitHub", "Postman"],', cls: 't-orange' },
            { text: '  "cms":       ["WordPress", "SEO"]', cls: 't-orange' },
            { text: '}' },
        ],
    },
    {
        cmd: 'npm run status',
        out: [
            { text: '✔ 2+ years experience', cls: 't-green' },
            { text: '✔ 5+ projects shipped', cls: 't-green' },
            { text: '✔ open to new opportunities', cls: 't-green' },
        ],
    },
];

const TYPE_MS = 55;
const LINE_MS = 140;

const Terminal = () => {
    const [done, setDone] = useState<Step[]>([]);
    const [typed, setTyped] = useState<string | null>('');
    const [current, setCurrent] = useState(0);
    const [shown, setShown] = useState(0);
    const bodyRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let cancelled = false;
        const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

        (async () => {
            await wait(600);
            for (let i = 0; i < steps.length; i++) {
                if (cancelled) return;
                setCurrent(i);
                setShown(0);
                for (let c = 1; c <= steps[i].cmd.length; c++) {
                    setTyped(steps[i].cmd.slice(0, c));
                    await wait(TYPE_MS);
                    if (cancelled) return;
                }
                await wait(300);
                setTyped(null);
                setDone((d) => [...d, steps[i]]);
                for (let l = 1; l <= steps[i].out.length; l++) {
                    setShown(l);
                    await wait(LINE_MS);
                    if (cancelled) return;
                }
                await wait(500);
            }
            setCurrent(steps.length);
            setTyped('');
        })();

        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        const el = bodyRef.current;
        if (el) el.scrollTop = el.scrollHeight;
    }, [done, typed, shown]);

    return (
        <div className="terminal">
            <div className="terminal-header">
                <span className="terminal-dot" style={{ background: '#ff5f56' }} />
                <span className="terminal-dot" style={{ background: '#ffbd2e' }} />
                <span className="terminal-dot" style={{ background: '#27c93f' }} />
                <span className="terminal-title">anvarsha@portfolio: ~/skills</span>
            </div>
            <div className="terminal-body" ref={bodyRef}>
                {done.map((s, i) => (
                    <div key={i}>
                        <div className="t-line">
                            <span className="t-prompt">❯</span> {s.cmd}
                        </div>
                        {s.out.slice(0, i === current ? shown : s.out.length).map((o, j) => (
                            <div key={j} className={`t-out ${o.cls || ''}`}>
                                {o.text}
                            </div>
                        ))}
                    </div>
                ))}
                {typed !== null && (
                    <div className="t-line">
                        <span className="t-prompt">❯</span> {typed}
                        <span className="t-cursor" />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Terminal;
