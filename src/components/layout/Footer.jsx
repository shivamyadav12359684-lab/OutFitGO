import { Link } from 'react-router-dom';
import { Icons } from '../common';
import './Footer.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        product: [
            { label: 'Features', path: '/features' },
            { label: 'How it Works', path: '/how-it-works' },
            { label: 'Pricing', path: '/pricing' },
            { label: 'FAQ', path: '/faq' },
        ],
        company: [
            { label: 'About Us', path: '/about' },
            { label: 'Blog', path: '/blog' },
            { label: 'Careers', path: '/careers' },
            { label: 'Press', path: '/press' },
        ],
        support: [
            { label: 'Help Center', path: '/help' },
            { label: 'Contact', path: '/contact' },
            { label: 'Privacy Policy', path: '/privacy' },
            { label: 'Terms of Service', path: '/terms' },
        ],
    };

    return (
        <footer className="footer">
            <div className="footer-container container">
                <div className="footer-top">
                    {/* Brand Section */}
                    <div className="footer-brand">
                        <Link to="/" className="footer-logo">
                            <span className="footer-logo-icon">
                                <Icons.Logo />
                            </span>
                            <span className="footer-logo-text">OutfitGo</span>
                        </Link>
                        <p className="footer-description">
                            Your personal AI-powered fashion assistant. Get perfect outfit suggestions
                            for any occasion, weather, or mood.
                        </p>
                        <div className="footer-social">
                            {/* --- BHAI INSTAGRAM LINK FIXED HERE --- */}
                            <a 
                                href="https://www.instagram.com/shivammmmmmm7?igsh=NXJ2ZGN1cnNmbHdm" 
                                className="footer-social-link" 
                                aria-label="Instagram"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <rect x="2" y="2" width="20" height="20" rx="5" />
                                    <circle cx="12" cy="12" r="4" />
                                    <circle cx="18" cy="6" r="1.5" fill="currentColor" />
                                </svg>
                            </a>
                            <a href="#" className="footer-social-link" aria-label="Twitter">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M4 4l11.733 16h4.267l-11.733-16zM4 20l6.4-6.4M20 4l-6.4 6.4" />
                                </svg>
                            </a>
                            <a href="#" className="footer-social-link" aria-label="Pinterest">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <circle cx="12" cy="12" r="10" />
                                    <path d="M12 6v12M8 10c0-2 1.5-4 4-4s4 2 4 4c0 3-2 4-4 6l-1 4" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Links Sections */}
                    <div className="footer-links-grid">
                        <div className="footer-links-section">
                            <h4 className="footer-links-title">Product</h4>
                            <ul className="footer-links-list">
                                {footerLinks.product.map((link) => (
                                    <li key={link.path}>
                                        <Link to={link.path} className="footer-link">{link.label}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="footer-links-section">
                            <h4 className="footer-links-title">Company</h4>
                            <ul className="footer-links-list">
                                {footerLinks.company.map((link) => (
                                    <li key={link.path}>
                                        <Link to={link.path} className="footer-link">{link.label}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="footer-links-section">
                            <h4 className="footer-links-title">Support</h4>
                            <ul className="footer-links-list">
                                {footerLinks.support.map((link) => (
                                    <li key={link.path}>
                                        <Link to={link.path} className="footer-link">{link.label}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar - UPDATED WITH YOUR NAME */}
                <div className="footer-bottom">
                    <p className="footer-copyright">
                        © {currentYear} OutfitGo. All rights reserved. Developed by SHIVAM with <span className="footer-heart">♥</span>.
                    </p>
                </div>
            </div>

            {/* Decorative Elements */}
            <div className="footer-decoration">
                <div className="footer-blob footer-blob-1"></div>
                <div className="footer-blob footer-blob-2"></div>
            </div>
        </footer>
    );
};

export default Footer;