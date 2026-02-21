import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar, Footer } from './components/layout';
import { HomePage, WardrobePage, OutfitsPage, ExplorePage, LoginPage, RecommendationPage } from './pages'; 

// Additional Page Imports
import WeatherPage from './pages/WeatherPage'; 
import FestivalPage from './pages/FestivalPage';

// AI Designer Integration
import AIStyledPage from './pages/AIStyledPage'; 

import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <Routes>
          {/* Main Navigation Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/wardrobe" element={<WardrobePage />} />
          <Route path="/outfits" element={<OutfitsPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/login" element={<LoginPage />} /> 
          
          {/* Smart Recommendation Engine */}
          <Route path="/recommendation" element={<RecommendationPage />} />

          {/* Weather-Based Styling Route */}
          <Route path="/weather-styling" element={<WeatherPage />} />

          {/* Festival and Seasonal Looks Route */}
          <Route path="/festival-looks" element={<FestivalPage />} />

          {/* AI-Powered Outfit Designer Route */}
          <Route path="/ai-designer" element={<AIStyledPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;