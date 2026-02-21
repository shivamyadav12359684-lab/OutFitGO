import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Icons } from '../common';
import './HowItWorks.css';

const HowItWorks = () => {
    const navigate = useNavigate();

    // Logic Updated: Now focusing on 'Real-Based' Personal Styling flow
    const steps = [
        {
            number: '01',
            icon: <Icons.Camera />, // Icon same rakha hai
            title: 'Upload Yourself / Others', // New Title
            description: 'Capture or upload a photo of yourself or the person you want to style today. Let the AI see the canvas!', // Real-based desc
            path: '/recommendation' // Pehla step ab seedha recommendation par jayega
        },
        {
            number: '02',
            icon: <Icons.Filter />,
            title: 'Set Your Preferences',
            description: 'Choose your style, favorite color, and occasion. These will be matched with your existing wardrobe inventory.', // Sync logic
            path: '/recommendation'
        },
        {
            number: '03',
            icon: <Icons.Sun />,
            title: 'Check the Context',
            description: 'We consider the occasion and your current mood to curate the perfect outfit suggestions from your collection.', // Mood based
            path: '/recommendation'
        },
        {
            number: '04',
            icon: <Icons.Dress />,
            title: 'Get Styled!',
            description: 'Receive personalized outfit recommendations from your own wardrobe. Save your favorites for later!', // Final result
            path: '/recommendation'
        },
    ];

    return (
        <section className="how-it-works section" id="how-it-works">
            <div className="container">
                <div className="hiw-header">
                    <span className="hiw-label">Simple & Effortless</span>
                    <h2 className="hiw-title">
                        How <span className="gradient-text">OutfitGo</span> Works
                    </h2>
                    <p className="hiw-subtitle">
                        Getting styled has never been easier. Four simple steps to looking your best every day.
                    </p>
                </div>

                <div className="hiw-steps">
                    {steps.map((step, index) => (
                        <div
                            key={index}
                            className="hiw-step"
                            style={{ 
                                animationDelay: `${index * 0.15}s`,
                                cursor: 'pointer' 
                            }}
                            onClick={() => navigate(step.path)}
                        >
                            <div className="hiw-step-number">{step.number}</div>
                            <div className="hiw-step-icon-wrapper">
                                <div className="hiw-step-icon">
                                    {step.icon}
                                </div>
                                {index < steps.length - 1 && <div className="hiw-step-connector"></div>}
                            </div>
                            <div className="hiw-step-content">
                                <h3 className="hiw-step-title">{step.title}</h3>
                                <p className="hiw-step-description">{step.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="hiw-decoration">
                <div className="hiw-circle hiw-circle-1"></div>
                <div className="hiw-circle hiw-circle-2"></div>
            </div>
        </section>
    );
};

export default HowItWorks;