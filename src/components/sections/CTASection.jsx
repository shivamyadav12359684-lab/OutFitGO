import { Link } from 'react-router-dom';
import { Button, Icons } from '../common';
import './CTASection.css';

const CTASection = () => {
    return (
        <section className="cta section" id="get-started">
            <div className="container">
                <div className="cta-wrapper">
                    {/* Decorative Elements */}
                    <div className="cta-decoration">
                        <div className="cta-blob cta-blob-1"></div>
                        <div className="cta-blob cta-blob-2"></div>
                        <div className="cta-sparkle cta-sparkle-1">✦</div>
                        <div className="cta-sparkle cta-sparkle-2">✦</div>
                        <div className="cta-sparkle cta-sparkle-3">✦</div>
                    </div>

                    {/* Content */}
                    <div className="cta-content">
                        <h2 className="cta-title">
                            Ready to Transform Your <span className="cta-accent">Style?</span>
                        </h2>
                        <p className="cta-description">
                            Join thousands of fashion enthusiasts who are already using OutfitGo to
                            discover their perfect look every day. It's free to get started!
                        </p>
                        <div className="cta-actions">
                            <Link to="/wardrobe">
                                <Button variant="white" size="lg" icon={<Icons.ArrowRight />} iconPosition="right">
                                    Start Building Your Wardrobe
                                </Button>
                            </Link>
                        </div>
                        <p className="cta-note">
                            <Icons.Check /> No credit card required • Free forever for personal use
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CTASection;
