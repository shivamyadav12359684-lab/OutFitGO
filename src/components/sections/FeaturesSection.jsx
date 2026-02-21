import { useNavigate } from 'react-router-dom'; 
import { Card, Icons } from '../common';
import './FeaturesSection.css';

const FeaturesSection = () => {
    const navigate = useNavigate(); 

    const features = [
        {
            icon: <Icons.Cloud />,
            title: 'Weather-Based Suggestions',
            description: 'Get outfit recommendations that match the weather forecast.',
            color: 'lavender',
            path: '/weather-styling' 
        },
        {
            icon: <Icons.Wardrobe />,
            title: 'Your Digital Wardrobe',
            description: 'Upload and organize your clothes by style.',
            color: 'mint',
            path: '/wardrobe' 
        },
        {
            icon: <Icons.Sparkles />,
            title: 'Festival & Season Looks',
            description: 'Celebrate in style! Get outfit ideas based on Today\'s Date & Festival.',
            color: 'peach',
            path: '/festival-looks' // ✅ UPDATED: Ab ye Naye Calendar Logic wale page par jayega
        }
    ];

    return (
        <section className="features section" id="features">
            <div className="container">
                <div className="features-header">
                    <span className="features-label">Why Choose OutfitGo</span>
                    <h2 className="features-title">
                        Everything You Need for <span className="gradient-text">Effortless Style</span>
                    </h2>
                    <p className="features-subtitle">
                        Our smart fashion assistant helps you look your best every day.
                    </p>
                </div>

                <div className="features-grid">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="feature-item"
                            style={{ animationDelay: `${index * 0.1}s`, cursor: 'pointer' }} 
                            onClick={() => navigate(feature.path)} 
                        >
                            <Card variant={`pastel-${feature.color}`} hover={true} padding="lg">
                                <div className={`feature-icon card-icon-${feature.color}`}>
                                    {feature.icon}
                                </div>
                                <h3 className="feature-title">{feature.title}</h3>
                                <p className="feature-description">{feature.description}</p>
                            </Card>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;