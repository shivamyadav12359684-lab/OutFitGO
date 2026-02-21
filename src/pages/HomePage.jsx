import { HeroSection, FeaturesSection, HowItWorks, CTASection } from '../components/sections';
import './HomePage.css';

const HomePage = () => {
    return (
        <main className="home-page">
            <HeroSection />
            <FeaturesSection />
            <HowItWorks />
            <CTASection />
        </main>
    );
};

export default HomePage;
