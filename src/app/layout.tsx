import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';

const inter = Inter({
    subsets: ['latin'],
    weight: ['300', '400', '500', '600', '700', '800', '900'],
    variable: '--font-inter',
    display: 'swap',
});
const spaceGrotesk = Space_Grotesk({
    subsets: ['latin'],
    weight: ['300', '400', '500', '600', '700'],
    variable: '--font-space-grotesk',
    display: 'swap',
});

const SITE_ORIGIN = 'https://anvar010.github.io';
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
const siteUrl = `${SITE_ORIGIN}${basePath}/`;
const title = 'Anvarsha KN | MERN Stack Developer in Dubai';
const description =
    'Anvarsha KN is a MERN Stack web developer in Dubai, UAE. Explore projects, skills and experience in MongoDB, Express, React and Node.js development.';

export const metadata: Metadata = {
    metadataBase: new URL(SITE_ORIGIN),
    title,
    description,
    keywords: ['Anvarsha KN', 'MERN Stack Developer', 'Web Developer Dubai', 'React', 'Node.js', 'Portfolio'],
    authors: [{ name: 'Anvarsha KN', url: siteUrl }],
    alternates: { canonical: siteUrl },
    openGraph: {
        type: 'website',
        url: siteUrl,
        siteName: 'Anvarsha KN Portfolio',
        title,
        description,
        locale: 'en_US',
        images: [{ url: `${basePath}/og-image.png`, width: 1200, height: 630, alt: 'Anvarsha KN, MERN Stack Web Developer' }],
    },
    twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [`${basePath}/og-image.png`],
    },
    icons: {
        icon: [{ url: `${basePath}/favicon.svg`, type: 'image/svg+xml' }],
        apple: `${basePath}/apple-touch-icon.png`,
    },
    robots: { index: true, follow: true },
    verification: { google: 'rUhBe8DxylxwzJ-pVONxviHJJ7UdOT1VZ5QLJTY3Vec' },
};

const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Anvarsha KN',
    url: siteUrl,
    image: `${SITE_ORIGIN}${basePath}/og-image.png`,
    jobTitle: 'MERN Stack Web Developer',
    description,
    address: { '@type': 'PostalAddress', addressLocality: 'Dubai', addressCountry: 'AE' },
    alumniOf: 'APJ Abdul Kalam Technological University',
    knowsAbout: ['MongoDB', 'Express.js', 'React', 'Node.js', 'JavaScript', 'WordPress', 'SEO'],
    sameAs: ['https://linkedin.com/in/anvarshakn', 'https://github.com/anvar010'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
            <body>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
                />
                {children}
            </body>
        </html>
    );
}
