import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Badge, Button } from '../components/common'; 
import { useNavigate } from 'react-router-dom';

const WeatherPage = () => {
    const [weather, setWeather] = useState(null);
    const [outfit, setOutfit] = useState(null);
    const [loading, setLoading] = useState(true);
    const [mode, setMode] = useState('Real-Time'); 
    
    const user = JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate();

    const API_KEY = "bd5e378503939ddaee76f12ad7a97608"; 

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(fetchRealWeather, useBackupWeather);
        } else {
            useBackupWeather();
        }
    }, []);

    const fetchRealWeather = async (position) => {
        try {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const res = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`);
            const data = res.data;
            analyzeWeather(data.main.temp, data.weather[0].main, data.name, 'Live Satellite');
        } catch (err) {
            console.error("API Failed, switching to Backup:", err);
            useBackupWeather(); 
        }
    };

    const useBackupWeather = () => {
        console.log("Using Simulation Mode");
        analyzeWeather(30, 'Clear', 'Mumbai (Simulated)', 'Demo Mode');
    };

    const analyzeWeather = (temp, condition, locationName, sourceMode) => {
        let appCondition = 'hot'; 
        let msg = "It's a bright sunny day!";

        if (condition === 'Rain' || condition === 'Drizzle' || condition === 'Thunderstorm') {
            appCondition = 'rainy';
            msg = "Rainy weather detected. Dark clothes suggested.";
        } else if (temp < 20 || condition === 'Snow') {
            appCondition = 'cold';
            msg = "It's chilly outside. Wear layers.";
        } else {
            appCondition = 'hot';
            msg = "Warm weather. Stay cool with light clothes.";
        }

        setWeather({
            temp: Math.round(temp),
            condition: condition,
            location: locationName,
            message: msg,
            appCondition: appCondition
        });
        setMode(sourceMode);
    };

    useEffect(() => {
        if (weather && user) {
            axios.get(`http://localhost:8081/api/weather-recommend`, {
                params: { userId: user.user_id, condition: weather.appCondition }
            })
            .then(res => {
                setOutfit(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Server Error:", err);
                setLoading(false);
            });
        }
    }, [weather]);

    return (
        <div className="container" style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
            
            {/* --- FIX: HEADER SECTION WITH BACK BUTTON --- */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px' }}>
                <Button 
                    variant="outline" 
                    onClick={() => navigate('/')}
                    style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    <span>⬅</span> Back Home
                </Button>
            </div>

            <div style={{ textAlign: 'center' }}>
                <h1 style={{fontSize:'2.5rem', marginBottom:'10px'}}>🌦️ Smart Weather Styling</h1>
                
                {loading && <h3 style={{color:'#666', marginTop:'50px'}}>📡 Scanning Environment...</h3>}

                {!loading && weather && (
                    <div style={{
                        background: weather.appCondition === 'rainy' ? 'linear-gradient(135deg, #3a7bd5 0%, #3a6073 100%)' : 'linear-gradient(135deg, #FDB813 0%, #FF6B6B 100%)',
                        color: 'white',
                        padding: '30px',
                        borderRadius: '25px',
                        maxWidth: '500px',
                        margin: '20px auto',
                        boxShadow: '0 15px 35px rgba(0,0,0,0.2)',
                        position: 'relative'
                    }}>
                        <span style={{position:'absolute', top:'15px', right:'15px', background:'rgba(255,255,255,0.2)', padding:'5px 10px', borderRadius:'15px', fontSize:'12px'}}>
                            🟢 {mode}
                        </span>
                        
                        <h2 style={{margin:0}}>📍 {weather.location}</h2>
                        <div style={{fontSize:'5rem', fontWeight:'bold', margin:'10px 0'}}>{weather.temp}°C</div>
                        <h3 style={{textTransform:'uppercase', letterSpacing:'2px'}}>{weather.condition}</h3>
                        <p style={{background:'rgba(0,0,0,0.2)', display:'inline-block', padding:'8px 20px', borderRadius:'20px', marginTop:'15px'}}>
                            💡 {weather.message}
                        </p>
                    </div>
                )}

                {!loading && outfit && (
                    <div style={{marginTop:'50px'}}>
                        <h2 style={{color:'#333'}}>✨ Perfect Match for this Weather</h2>
                        <p style={{color:'#666'}}>Auto-selected from your wardrobe based on temperature.</p>
                        
                        <div style={{ display: 'flex', gap: '40px', justifyContent: 'center', flexWrap: 'wrap', marginTop:'30px' }}>
                            
                            {outfit.top && (
                                <Card style={{ width: '320px', padding: '15px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}>
                                    <Badge variant="neutral">TOP WEAR</Badge>
                                    <img src={outfit.top.image_url} style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: '15px', marginTop:'15px' }} />
                                    <h3 style={{marginTop:'15px'}}>{outfit.top.name}</h3>
                                    <p style={{color:'#888'}}>{outfit.top.color} • {outfit.top.category}</p>
                                </Card>
                            )}

                            {outfit.bottom && (
                                <Card style={{ width: '320px', padding: '15px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}>
                                    <Badge variant="neutral">BOTTOM WEAR</Badge>
                                    <img src={outfit.bottom.image_url} style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: '15px', marginTop:'15px' }} />
                                    <h3 style={{marginTop:'15px'}}>{outfit.bottom.name}</h3>
                                    <p style={{color:'#888'}}>{outfit.bottom.color} • {outfit.bottom.category}</p>
                                </Card>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WeatherPage;