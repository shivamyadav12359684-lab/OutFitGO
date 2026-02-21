import { Link } from 'react-router-dom';
import { Button, Badge, Icons } from '../common';
import './HeroSection.css';

const HeroSection = () => {
    const highlights = [
        { icon: <Icons.Sparkles />, text: 'Personalized Looks' },
        { icon: <Icons.Check />, text: 'Style Made Simple' },
    ];

    return (
        <section className="hero" id="hero">
            {/* Background Decorations */}
            <div className="hero-bg">
                <div className="hero-blob hero-blob-1"></div>
                <div className="hero-blob hero-blob-2"></div>
                <div className="hero-blob hero-blob-3"></div>
                <div className="hero-orb hero-orb-1"></div>
                <div className="hero-orb hero-orb-2"></div>
            </div>

            <div className="hero-container container">
                {/* Left Content */}
                <div className="hero-content">
                    <Badge variant="primary" size="md" icon={<Icons.Sparkles />}>
                        Smart Fashion Suggestions
                    </Badge>

                    <h1 className="hero-title">
                        Perfect Outfits for <span className="hero-title-accent">Every Mood</span>
                    </h1>

                    <p className="hero-description">
                        Get personalized clothing recommendations based on your style, weather,
                        and occasions. Discover outfits that match your personality effortlessly.
                    </p>

                    <div className="hero-actions">
                        {/* ✅ RESTORED: This stays on recommendation as you requested */}
                        <Link to="/recommendation">
                            <Button variant="primary" size="lg" icon={<Icons.ArrowRight />} iconPosition="right">
                                Get Styled
                            </Button>
                        </Link>
                        <Link to="/explore">
                            <Button variant="outline" size="lg">
                                Explore Styles
                            </Button>
                        </Link>
                    </div>

                    <div className="hero-highlights">
                        {highlights.map((item, index) => (
                            <div key={index} className="hero-highlight">
                                <span className="hero-highlight-icon">{item.icon}</span>
                                <span className="hero-highlight-text">{item.text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Content */}
                <div className="hero-cards">
                    {/* ✅ TARGET ACHIEVED: Only this card goes to AI Designer */}
                    <Link to="/ai-designer" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <div className="hero-card hero-card-1" style={{ cursor: 'pointer' }}>
                            <div className="hero-card-icon hero-card-icon-lavender">
                                <Icons.TShirt />
                            </div>
                            <h3 className="hero-card-title">Smart Outfit Suggestions</h3>
                            <p className="hero-card-text">Get outfit ideas tailored to your taste and lifestyle.</p>
                        </div>
                    </Link>

                    {/* Card 4: Save Your Favorites (STAYS ON FAVORITES) */}
                    <Link to="/wardrobe?filter=favorites" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <div className="hero-card hero-card-4" style={{ cursor: 'pointer' }}>
                            <div className="hero-card-icon hero-card-icon-mint">
                                <Icons.Heart />
                            </div>
                            <h3 className="hero-card-title">Save Your Favorites</h3>
                            <p className="hero-card-text">Bookmark outfits and revisit them anytime.</p>
                        </div>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;