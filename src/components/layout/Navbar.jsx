import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Icons } from '../common';
import './Navbar.css';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    // Logic: Get user from localStorage to check if logged in
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location]);

    // Logic: Clear storage and redirect on logout
    const handleLogout = () => {
        localStorage.removeItem('user');
        alert("You have been logged out successfully.");
        navigate('/login');
    };

    const navLinks = [
        { path: '/', label: 'Home' },
        { path: '/wardrobe', label: 'My Wardrobe' },
        { path: '/outfits', label: 'Outfits' },
        { path: '/explore', label: 'Explore' },
    ];

    return (
        <header className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
            <nav className="navbar-container container">
                {/* Logo */}
                <Link to="/" className="navbar-logo" aria-label="OutfitGo Home">
                    <span className="navbar-logo-icon">
                        <Icons.Logo />
                    </span>
                    <span className="navbar-logo-text">OutfitGo</span>
                </Link>

                {/* Desktop Navigation */}
                <ul className="navbar-links">
                    {navLinks.map((link) => (
                        <li key={link.path}>
                            <Link
                                to={link.path}
                                className={`navbar-link ${location.pathname === link.path ? 'active' : ''}`}
                            >
                                {link.label}
                            </Link>
                        </li>
                    ))}
                </ul>

                {/* --- DESKTOP CTA BUTTONS (LOGIC: DYNAMIC LOGIN/LOGOUT) --- */}
                <div className="navbar-actions">
                    {user ? (
                        // If user exists, show Logout with their name
                        <Button variant="primary" size="sm" onClick={handleLogout} style={{ cursor: 'pointer' }}>
                            Logout ({user.full_name.split(' ')[0]})
                        </Button>
                    ) : (
                        // If no user, show Login
                        <Link to="/login" style={{ textDecoration: 'none' }}>
                            <Button variant="primary" size="sm" className="navbar-login">
                                Login
                            </Button>
                        </Link>
                    )}

                    <Link to="/wardrobe" style={{ textDecoration: 'none' }}>
                        <Button variant="primary" size="sm">
                            Try Now
                        </Button>
                    </Link>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="navbar-toggle"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                >
                    {isMobileMenuOpen ? <Icons.Close /> : <Icons.Menu />}
                </button>

                {/* Mobile Menu */}
                <div className={`navbar-mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
                    <ul className="navbar-mobile-links">
                        {navLinks.map((link) => (
                            <li key={link.path}>
                                <Link
                                    to={link.path}
                                    className={`navbar-mobile-link ${location.pathname === link.path ? 'active' : ''}`}
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <div className="navbar-mobile-actions">
                        {user ? (
                            <Button variant="primary" size="md" fullWidth onClick={handleLogout}>
                                Logout
                            </Button>
                        ) : (
                            <Link to="/login" style={{ textDecoration: 'none', width: '100%' }}>
                                <Button variant="primary" size="md" fullWidth>
                                    Login
                                </Button>
                            </Link>
                        )}
                        <Link to="/wardrobe" style={{ textDecoration: 'none', width: '100%', marginTop: '10px', display: 'block' }}>
                            <Button variant="primary" size="md" fullWidth>
                                Try Now
                            </Button>
                        </Link>
                    </div>
                </div>
            </nav>

            {isMobileMenuOpen && (
                <div
                    className="navbar-overlay"
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-hidden="true"
                />
            )}
        </header>
    );
};

export default Navbar;