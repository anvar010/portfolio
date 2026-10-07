'use client';

import Timeline, { type TimelineItem } from './ui/timeline';

// Chronological (oldest first) so the timeline reads left to right.
const experiences: TimelineItem[] = [
    {
        id: 'rawmax',
        label: 'Jul 2023 — Jul 2024',
        heading: 'Front End Developer · Rawmax Media',
        content:
            'Built responsive, cross-browser interfaces with HTML, CSS, JavaScript and React.js.',
    },
    {
        id: 'synnefo-trainee',
        label: 'Sep 2023 — Feb 2024',
        heading: 'MERN Stack Trainee · Synnefo Solutions',
        content:
            'Learned MongoDB, Express, React.js and Node.js, building REST APIs and responsive web apps.',
    },
    {
        id: 'synnefo-intern',
        label: 'Feb 2024 — Mar 2024',
        heading: 'MERN Stack Developer (Intern) · Synnefo Solutions',
        content:
            'Developed an e-commerce platform with login, product catalog, cart, checkout and payments.',
    },
    {
        id: 'alreem',
        label: 'Oct 2024 — Present',
        heading: 'Web Developer & Digital Marketer · Al Reem Businessmen Services UAE',
        content:
            'Maintain the company WordPress site and grow traffic with SEO, content, social and paid campaigns.',
    },
    {
        id: 'sabha',
        label: 'Ongoing',
        heading: 'Email Server Configuration · Sabha Technologies UAE',
        content:
            'Configured a secure email server with SMTP, IMAP, POP3, spam filtering and encryption.',
    },
    {
        id: 'mariot',
        label: 'Full Stack Developer',
        heading: 'Full Stack Developer · Mariot Store UAE',
        content: 'Building and maintaining full-stack web applications with the MERN stack.',
    },
    {
        id: 'ivwellness',
        label: 'Full Stack Developer',
        heading: 'Full Stack Developer · IV Wellness Lounge Dubai',
        content: 'Building and maintaining full-stack web applications with the MERN stack.',
    },
];

const Experience = () => (
    <Timeline
        id="experience"
        items={experiences}
        title="Professional Journey"
        periodLabel="2023 — Present"
        backgroundColor="transparent"
        textColor="var(--text-primary)"
        mutedTextColor="var(--text-secondary)"
        activeColor="#6c5ce7"
        fontFamily="var(--font-heading)"
        duration={1.4}
    />
);

export default Experience;
