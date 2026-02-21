import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { Button, Card, Badge, Icons } from '../components/common';
import './ExplorePage.css';

const ExplorePage = () => {
    const [activeTab, setActiveTab] = useState('trending');
    const navigate = useNavigate(); 

    // --- FIXED NAVIGATION LOGIC ---
    const handleModuleClick = (type) => {
        if (type === 'weather') {
            navigate('/weather-styling');
        } else if (type === 'wardrobe') {
            navigate('/wardrobe');
        } else if (type === 'favorites') {
            // Forcefully passing state and search param for redirection
            navigate('/wardrobe?filter=favorites', { state: { activeTab: 'favorites' } }); 
        } else if (type === 'occasion') {
            navigate('/recommendation?type=occasion');
        } else if (type === 'festival') {
            navigate('/recommendation?type=festival');
        } else if (type === 'color') {
            navigate('/recommendation?type=color');
        }
    };

    const tabs = [
        { id: 'trending', label: 'Trending' },
        { id: 'seasonal', label: 'Seasonal' },
        { id: 'occasions', label: 'Occasions' },
        { id: 'colors', label: 'Color Trends' },
    ];

    const trendingStyles = [
        { id: 1, title: 'Minimalist Chic', description: 'Clean lines, neutral tones.', tags: ['Minimal'], color: 'lavender' },
        { id: 2, title: 'Street Style', description: 'Urban vibes and bold graphics.', tags: ['Urban'], color: 'blush' },
        { id: 3, title: 'Bohemian Dreams', description: 'Free-spirited fashion.', tags: ['Boho'], color: 'peach' },
        { id: 4, title: 'Power Dressing', description: 'Structured silhouettes.', tags: ['Formal'], color: 'mint' },
    ];

    return (
        <main className="explore-page">
            <div className="container">
                {/* Header */}
                <div className="explore-header">
                    <Badge variant="secondary" size="md" icon={<Icons.Sparkles />}>Discover Styles</Badge>
                    <h1 className="explore-title">Explore <span className="gradient-text">Fashion Trends</span></h1>
                    <p className="explore-subtitle">Discover new styles to elevate your wardrobe.</p>
                </div>

                {/* Tabs */}
                <div className="explore-tabs">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            className={`explore-tab ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* --- 6 MODULES SECTION (Clickable & Redirect Fixed) --- */}
                <section className="explore-section">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                        
                        <Card hover={true} padding="lg" onClick={() => handleModuleClick('weather')} style={{ cursor: 'pointer', background: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)', color: 'white', border: 'none' }}>
                            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🌦️</div>
                            <h3 style={{ fontWeight: 'bold' }}>Weather Styling</h3>
                            <p style={{ fontSize: '14px', opacity: 0.9 }}>Outfit recommendations based on live weather.</p>
                        </Card>

                        <Card hover={true} padding="lg" onClick={() => handleModuleClick('occasion')} style={{ cursor: 'pointer', background: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)', color: 'white', border: 'none' }}>
                            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>✨</div>
                            <h3 style={{ fontWeight: 'bold' }}>Occasion Ready</h3>
                            <p style={{ fontSize: '14px', opacity: 0.9 }}>Perfect looks for parties and meetings.</p>
                        </Card>

                        <Card hover={true} padding="lg" onClick={() => handleModuleClick('wardrobe')} style={{ cursor: 'pointer', background: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)', color: 'white', border: 'none' }}>
                            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>👗</div>
                            <h3 style={{ fontWeight: 'bold' }}>Digital Wardrobe</h3>
                            <p style={{ fontSize: '14px', opacity: 0.9 }}>Organize and manage your collection.</p>
                        </Card>

                        <Card hover={true} padding="lg" onClick={() => handleModuleClick('festival')} style={{ cursor: 'pointer', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white', border: 'none' }}>
                            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🏮</div>
                            <h3 style={{ fontWeight: 'bold' }}>Festival Looks</h3>
                            <p style={{ fontSize: '14px', opacity: 0.9 }}>Celebrate with seasonal recommendations.</p>
                        </Card>

                        <Card hover={true} padding="lg" onClick={() => handleModuleClick('color')} style={{ cursor: 'pointer', background: 'linear-gradient(135deg, #5eeff1 0%, #3a7bd5 100%)', color: 'white', border: 'none' }}>
                            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🎨</div>
                            <h3 style={{ fontWeight: 'bold' }}>Color Harmony</h3>
                            <p style={{ fontSize: '14px', opacity: 0.9 }}>Discover perfect color combinations.</p>
                        </Card>

                        {/* SAVE & FAVORITE FIX */}
                        <Card hover={true} padding="lg" onClick={() => handleModuleClick('favorites')} style={{ cursor: 'pointer', background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)', color: 'white', border: 'none' }}>
                            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>❤️</div>
                            <h3 style={{ fontWeight: 'bold' }}>Save & Favorite</h3>
                            <p style={{ fontSize: '14px', opacity: 0.9 }}>Quick access to your loved outfits.</p>
                        </Card>

                    </div>
                </section>

                {/* Trending Styles Grid */}
                <section className="explore-section">
                    <h2 className="explore-section-title">Trending Styles</h2>
                    <div className="styles-grid">
                        {trendingStyles.map((style, index) => (
                            <Card key={style.id} variant={`pastel-${style.color}`} hover={true} padding="lg" className="style-card" style={{ animationDelay: `${index * 0.1}s` }}>
                                <div className="style-icon-wrapper"><Icons.Dress /></div>
                                <h3 className="style-title">{style.title}</h3>
                                <p className="style-description">{style.description}</p>
                                <Button variant="ghost" size="sm" className="style-btn">Explore Style <Icons.ArrowRight /></Button>
                            </Card>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
};

export default ExplorePage;