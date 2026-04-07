'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FileText } from 'lucide-react';
import styles from '@/styles/Navbar.module.css';

const NAV_LINKS = [
    { label: 'ABOUT', href: '#about' },
    { label: 'WORK', href: '#work' },
    { label: 'CONTACT', href: '#contact' },
];

export default function Navbar() {
    return (
        <nav className={styles.nav}>
            {/* ── Global SVGs/Gradients ── */}
            <svg width="0" height="0" style={{ position: 'absolute' }}>
                <defs>
                    <linearGradient id="whiteGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="white" />
                        <stop offset="100%" stopColor="rgba(255, 255, 255, 0.4)" />
                    </linearGradient>
                </defs>
            </svg>

            <div className={styles.navInner}>
                {/* ── Branded Logo Image ── */}
                <Link href="/" className={styles.logoContainer} aria-label="Home">
                    <Image 
                        src="/images/logo.png" 
                        alt="Logo" 
                        width={64} 
                        height={64} 
                        className={styles.logoImage}
                        priority
                    />
                </Link>

                {/* ── Page Links (Middle/After Logo) ── */}
                <ul className={styles.links}>
                    {NAV_LINKS.map((link) => (
                        <li key={link.label}>
                            <Link href={link.href} className={styles.link}>
                                {link.label}
                            </Link>
                        </li>
                    ))}
                </ul>

                {/* ── Social Icons (Bottom/Right) ── */}
                <ul className={styles.socials}>
                    {/* LinkedIn */}
                    <li>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" />
                            </svg>
                        </a>
                    </li>
                    {/* GitHub */}
                    <li>
                        <a href="https://github.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" />
                            </svg>
                        </a>
                    </li>
                    {/* Resume */}
                    <li>
                        <a href="#" className={styles.socialLink} aria-label="Resume">
                            <FileText size={18} strokeWidth={1.5} />
                        </a>
                    </li>
                </ul>

            </div>
        </nav>
    );
}