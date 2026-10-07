'use client';

import { useEffect, useRef, useState } from 'react';

type Token = [string, string?];

const k = 'c-kw';
const v = 'c-var';
const s = 'c-str';
const p = 'c-prop';
const n = 'c-num';
const c = 'c-com';
const f = 'c-fn';

const developerLines: Token[][] = [
    [['// Hi there, welcome to my portfolio 👋', c]],
    [['const ', k], ['developer', v], [' = {']],
    [['  name: ', p], ['"Anvarsha KN"', s], [',']],
    [['  role: ', p], ['"MERN Stack Web Developer"', s], [',']],
    [['  experience: ', p], ['2', n], [',  ', ''], ['// years', c]],
    [['  skills: ', p], ['{']],
    [['    core: ', p], ['["React.js", "Node.js", "MongoDB", "Express"]', s], [',']],
    [['    frontend: ', p], ['["JavaScript", "HTML5", "CSS3"]', s], [',']],
    [['    styling: ', p], ['["Bootstrap", "Tailwind"]', s], [',']],
    [['    backend: ', p], ['["Python", "PHP", "MySQL"]', s], [',']],
    [['    tools: ', p], ['["Git", "GitHub", "Postman"]', s], [',']],
    [['  },']],
    [['  openToWork: ', p], ['true', k], [',']],
    [['  hire() {', f]],
    [['    return ', k], ['"Let\'s build something great!"', s], [';']],
    [['  },']],
    [['};']],
];

const projectsLines: Token[][] = [
    [['// Selected work 🚀', c]],
    [['export const ', k], ['projects', v], [' = [']],
    [['  "E-Commerce Platform"', s], [',']],
    [['  "Driver Drowsiness Detection System"', s], [',']],
    [['  "Pedagogue Attendance Tracking"', s], [',']],
    [['  "Al Reem Business Website"', s], [',']],
    [['  "Rawmax Media Website"', s], [',']],
    [['  "Company Email Server"', s], [',']],
    [['];']],
    [['']],
    [['console.', v], ['log', f], ['(projects.length); ', ''], ['// 6', c]],
];

const contactLines: Token[][] = [
    [['// Let\'s connect 🤝', c]],
    [['export const ', k], ['contact', v], [' = {']],
    [['  email: ', p], ['"anvarshaknavas588@gmail.com"', s], [',']],
    [['  phone: ', p], ['"+971 569672392"', s], [',']],
    [['  linkedin: ', p], ['"linkedin.com/in/anvarshakn"', s], [',']],
    [['  github: ', p], ['"github.com/anvar010"', s], [',']],
    [['};']],
];

const files = [
    { name: 'developer.ts', lines: developerLines },
    { name: 'projects.ts', lines: projectsLines },
    { name: 'contact.ts', lines: contactLines },
];

const countChars = (lines: Token[][]) =>
    lines.reduce((sum, l) => sum + l.reduce((a, t) => a + t[0].length, 0) + 1, 0);

const CodeEditor = () => {
    const [count, setCount] = useState(0);
    const [activeFile, setActiveFile] = useState(0);
    const bodyRef = useRef<HTMLDivElement>(null);
    const lines = files[activeFile].lines;
    const total = countChars(lines);

    useEffect(() => {
        setCount(0);
        let i = 0;
        let timer: ReturnType<typeof setTimeout>;
        const tick = () => {
            i += 1;
            setCount(i);
            if (i < total) timer = setTimeout(tick, 22);
        };
        timer = setTimeout(tick, activeFile === 0 ? 700 : 150);
        return () => clearTimeout(timer);
    }, [activeFile, total]);

    useEffect(() => {
        const el = bodyRef.current;
        if (el) el.scrollTop = el.scrollHeight;
    }, [count]);

    let remaining = count;
    const rendered: { tokens: Token[]; active: boolean }[] = [];
    for (let li = 0; li < lines.length && remaining > 0; li++) {
        const len = lines[li].reduce((a, t) => a + t[0].length, 0);
        const take = Math.min(remaining, len);
        let left = take;
        const tokens: Token[] = [];
        for (const t of lines[li]) {
            if (left <= 0) break;
            tokens.push([t[0].slice(0, left), t[1]]);
            left -= t[0].length;
        }
        remaining -= len + 1;
        rendered.push({ tokens, active: remaining <= 0 });
    }
    const finished = count >= total;

    return (
        <div className="editor">
            <div className="editor-header">
                <span className="terminal-dot" style={{ background: '#ff5f56' }} />
                <span className="terminal-dot" style={{ background: '#ffbd2e' }} />
                <span className="terminal-dot" style={{ background: '#27c93f' }} />
                <span className="terminal-title">portfolio</span>
            </div>
            <div className="editor-tabs">
                {files.map((file, i) => (
                    <button
                        key={file.name}
                        type="button"
                        className={`editor-tab${i === activeFile ? ' active' : ''}`}
                        onClick={() => setActiveFile(i)}
                    >
                        <span className="c-fn">TS</span> {file.name}
                    </button>
                ))}
            </div>
            <div className="editor-body" ref={bodyRef}>
                {rendered.map((l, i) => (
                    <div className="editor-line" key={i}>
                        <span className="editor-num">{i + 1}</span>
                        <span className="editor-code">
                            {l.tokens.map((t, j) => (
                                <span key={j} className={t[1]}>{t[0]}</span>
                            ))}
                            {l.active && !finished && <span className="t-cursor" />}
                            {finished && i === rendered.length - 1 && <span className="t-cursor" />}
                        </span>
                    </div>
                ))}
            </div>
            <div className="editor-status">
                <span>⎇ main</span>
                <span>TypeScript</span>
                <span>Ln {Math.max(rendered.length, 1)}</span>
            </div>
        </div>
    );
};

export default CodeEditor;
