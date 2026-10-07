import { LayoutIcon, ServerIcon, WrenchIcon, ChartIcon } from '../components/Icons';

export const skillCategories = [
    {
        title: 'Frontend Development',
        icon: <LayoutIcon size={24} />,
        iconBg: 'rgba(108, 92, 231, 0.15)',
        skills: ['React.js', 'Next.js', 'React Native', 'JavaScript', 'HTML5', 'CSS3', 'Bootstrap', 'Tailwind CSS'],
    },
    {
        title: 'Backend Development',
        icon: <ServerIcon size={24} />,
        iconBg: 'rgba(0, 206, 201, 0.15)',
        skills: ['Node.js', 'Express.js', 'REST APIs', 'MongoDB', 'MySQL', 'PHP', 'Payment Integration'],
    },
    {
        title: 'Tools & Platforms',
        icon: <WrenchIcon size={24} />,
        iconBg: 'rgba(253, 121, 168, 0.15)',
        skills: ['Git', 'GitHub', 'VS Code', 'XAMP', 'WordPress', 'Postman'],
    },
    {
        title: 'Digital Marketing',
        icon: <ChartIcon size={24} />,
        iconBg: 'rgba(0, 184, 148, 0.15)',
        skills: ['SEO', 'SEM', 'Social Media', 'Email Campaigns', 'Content Strategy', 'Paid Advertising'],
    },
];
