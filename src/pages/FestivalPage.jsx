import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Card, Badge } from '../components/common';
import { useNavigate } from 'react-router-dom';

const FestivalPage = () => {
    const [recommendation, setRecommendation] = useState(null);
    const [message, setMessage] = useState("Checking Calendar...");
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user ? user.user_id : null;

    useEffect(() => {
        if (!userId) {
            alert("Please login first!");
            navigate('/login');
            return;
        }

        axios.get(`http://localhost:8081/api/festival-recommend?userId=${userId}`)
            .then(res => {
                setRecommendation(res.data);
                setMessage(res.data.message);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching festival data:", err);
                setMessage("Could not connect to calendar server.");
                setLoading(false);
            });
    }, [userId, navigate]);

    return (
        <div className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>
            <Card style={{ padding: '40px', maxWidth: '600px', margin: '0 auto', borderRadius: '30px', background: 'linear-gradient(135deg, #fff1eb 0%, #ace0f9 100%)', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
                <h2 style={{ marginBottom: '10px', fontSize: '2rem', color: '#333' }}>📅 Fashion Forecast</h2>
                <div style={{ background: 'rgba(255,255,255,0.7)', padding: '20px', borderRadius: '15px', marginBottom: '30px', backdropFilter: 'blur(10px)' }}>
                     <p style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#4F46E5', margin: 0 }}>
                        {loading ? "Scanning Calendar..." : `"${message}"`}
                    </p>
                </div>
                {recommendation && (
                    <div style={{ display: 'flex', gap: '25px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        {recommendation.top && (
                            <div style={{ background: 'white', padding: '15px', borderRadius: '20px', width: '200px' }}>
                                <img src={recommendation.top.image_url} alt="Top" style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '15px' }} />
                                <h4 style={{ margin: '5px 0', fontWeight: 'bold' }}>{recommendation.top.name}</h4>
                                <Badge variant="primary">Top Wear</Badge>
                            </div>
                        )}
                        {recommendation.bottom && (
                            <div style={{ background: 'white', padding: '15px', borderRadius: '20px', width: '200px' }}>
                                <img src={recommendation.bottom.image_url} alt="Bottom" style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '15px' }} />
                                <h4 style={{ margin: '5px 0', fontWeight: 'bold' }}>{recommendation.bottom.name}</h4>
                                <Badge variant="primary">Bottom Wear</Badge>
                            </div>
                        )}
                    </div>
                )}
                {!loading && !recommendation && (
                    <p>No suitable outfit found in wardrobe. Try adding more clothes!</p>
                )}
                <Button variant="outline" onClick={() => navigate('/explore')} style={{ marginTop: '40px', padding: '10px 30px' }}>
                    ← Back to Explore
                </Button>
            </Card>
        </div>
    );
};

export default FestivalPage;