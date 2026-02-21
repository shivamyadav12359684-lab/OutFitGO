import { useState } from 'react';
import { Button, Card, Badge, Icons } from '../components/common';
import './OutfitsPage.css';

const OutfitsPage = () => {
    const [activeFilter, setActiveFilter] = useState('suggested');

    const filters = [
        { id: 'suggested', label: 'Suggested', icon: <Icons.Sparkles /> },
        { id: 'saved', label: 'Saved', icon: <Icons.Heart /> },
        { id: 'weather', label: 'Weather Based', icon: <Icons.Cloud /> },
        { id: 'occasion', label: 'By Occasion', icon: <Icons.Calendar /> },
    ];

    // Sample outfit suggestions
    const outfits = [
        {
            id: 1,
            name: 'Casual Friday Look',
            occasion: 'Work Casual',
            weather: 'Pleasant',
            items: ['Blue Polo', 'Chino Pants', 'White Sneakers'],
            mood: 'Relaxed',
            saved: true,
        },
        {
            id: 2,
            name: 'Weekend Brunch',
            occasion: 'Casual Outing',
            weather: 'Sunny',
            items: ['Floral Dress', 'Sandals', 'Straw Bag'],
            mood: 'Cheerful',
            saved: false,
        },
        {
            id: 3,
            name: 'Business Meeting',
            occasion: 'Formal',
            weather: 'Any',
            items: ['White Shirt', 'Black Blazer', 'Formal Pants'],
            mood: 'Professional',
            saved: true,
        },
        {
            id: 4,
            name: 'Street Style',
            occasion: 'Casual',
            weather: 'Cool',
            items: ['Graphic Tee', 'Denim Jacket', 'Joggers'],
            mood: 'Urban',
            saved: false,
        },
        {
            id: 5,
            name: 'Festival Ready',
            occasion: 'Festival',
            weather: 'Warm',
            items: ['Embroidered Kurta', 'White Pajama', 'Mojari'],
            mood: 'Festive',
            saved: false,
        },
        {
            id: 6,
            name: 'Date Night',
            occasion: 'Evening Out',
            weather: 'Cool',
            items: ['Black Dress', 'Heels', 'Clutch'],
            mood: 'Elegant',
            saved: true,
        },
    ];

    const weatherInfo = {
        temp: '24°C',
        condition: 'Partly Cloudy',
        icon: <Icons.Sun />,
    };

    return (
        <main className="outfits-page">
            <div className="container">
                {/* Page Header */}
                <div className="outfits-header">
                    <div className="outfits-header-left">
                        <h1 className="outfits-title">Outfit Suggestions</h1>
                        <p className="outfits-subtitle">
                            Personalized looks based on your wardrobe, weather, and style preferences.
                        </p>
                    </div>

                    {/* Weather Widget */}
                    <div className="weather-widget">
                        <div className="weather-icon">{weatherInfo.icon}</div>
                        <div className="weather-info">
                            <span className="weather-temp">{weatherInfo.temp}</span>
                            <span className="weather-condition">{weatherInfo.condition}</span>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="outfits-filters">
                    {filters.map((filter) => (
                        <button
                            key={filter.id}
                            className={`outfit-filter-btn ${activeFilter === filter.id ? 'active' : ''}`}
                            onClick={() => setActiveFilter(filter.id)}
                        >
                            <span className="outfit-filter-icon">{filter.icon}</span>
                            {filter.label}
                        </button>
                    ))}
                </div>

                {/* Outfits Grid */}
                <div className="outfits-grid">
                    {outfits.map((outfit, index) => (
                        <Card
                            key={outfit.id}
                            variant="default"
                            hover={true}
                            padding="none"
                            className="outfit-card"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            {/* Outfit Preview */}
                            <div className="outfit-preview">
                                <div className="outfit-items-display">
                                    {outfit.items.slice(0, 3).map((item, i) => (
                                        <div key={i} className="outfit-item-circle">
                                            <Icons.Hanger />
                                        </div>
                                    ))}
                                </div>
                                <button
                                    className={`outfit-save-btn ${outfit.saved ? 'saved' : ''}`}
                                    aria-label={outfit.saved ? 'Remove from saved' : 'Save outfit'}
                                >
                                    {outfit.saved ? <Icons.HeartFilled /> : <Icons.Heart />}
                                </button>
                            </div>

                            {/* Outfit Info */}
                            <div className="outfit-info">
                                <h3 className="outfit-name">{outfit.name}</h3>
                                <div className="outfit-tags">
                                    <Badge variant="primary" size="sm">{outfit.occasion}</Badge>
                                    <Badge variant="secondary" size="sm">{outfit.mood}</Badge>
                                </div>
                                <div className="outfit-items-list">
                                    {outfit.items.map((item, i) => (
                                        <span key={i} className="outfit-item-tag">
                                            {item}
                                            {i < outfit.items.length - 1 && ' • '}
                                        </span>
                                    ))}
                                </div>
                                <Button variant="ghost" size="sm" className="outfit-view-btn">
                                    View Details
                                    <Icons.ArrowRight />
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Generate New Button */}
                <div className="outfits-generate">
                    <Button variant="primary" size="lg" icon={<Icons.Sparkles />}>
                        Generate New Suggestions
                    </Button>
                    <p className="outfits-generate-hint">
                        Not finding what you need? Let us create fresh outfit ideas for you.
                    </p>
                </div>
            </div>
        </main>
    );
};

export default OutfitsPage;
