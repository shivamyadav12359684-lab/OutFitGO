import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom'; 
import { Button, Card, Badge } from '../components/common'; 
import './WardrobePage.css'; // Category filter buttons styling ke liye

const RecommendationPage = () => {
    // --- STATE MANAGEMENT ---
    const [step, setStep] = useState(1); 
    const [color, setColor] = useState(''); 
    const [category, setCategory] = useState(''); 
    const [mood, setMood] = useState('Happy'); 

    const [outfit, setOutfit] = useState(null); 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    const [personImage, setPersonImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null); 
    const [uploadedPersonUrl, setUploadedPersonUrl] = useState(null); 

    const navigate = useNavigate();
    const location = useLocation(); 
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user ? user.user_id : null;

    // --- 1. SMART AUTO-FILL ---
    useEffect(() => {
        if (!userId) {
            alert("Please login first to get recommendations!");
            navigate('/login');
            return;
        }

        const params = new URLSearchParams(location.search);
        const type = params.get('type');

        if (type === 'occasion') { setCategory('Party'); setStep(2); } 
        else if (type === 'festival') { setCategory('Ethnic'); setStep(2); } 
        else if (type === 'color') { setColor('Red'); setStep(2); }
    }, [userId, navigate, location]);

    // --- 2. UPLOAD PERSON IMAGE ---
    const handlePersonUpload = async () => {
        if (!personImage) return alert("Please select a photo first!");

        setLoading(true);
        const formData = new FormData();
        formData.append('image', personImage);
        formData.append('user_id', userId); 

        try {
            const res = await axios.post('http://localhost:8081/api/upload-person', formData);
            if (res.data.Status === "Success") {
                setUploadedPersonUrl(res.data.image_url);
                setStep(2); 
            } else {
                alert("Upload failed: " + res.data.Error);
            }
        } catch (err) {
            alert("Upload failed. Server terminal check karo!");
        }
        setLoading(false);
    };

    // --- 3. GET OUTFIT RECOMMENDATION (Smart Logic Add-on) ---
    const getRecommendation = async () => {
        if(!category.trim() || !color.trim()) {
            return alert("Occasion and Color are required!");
        }
        
        setLoading(true);
        setError('');
        setOutfit(null);

        try {
            await axios.post('http://localhost:8081/api/save-log', {
                userId, mood_tag: mood, occasion: category.trim(), 
                weather_condition: 'Sunny', temp_recorded: 25        
            }).catch(() => console.log("Logging skipped."));

            const res = await axios.get(`http://localhost:8081/api/recommend`, {
                params: { 
                    userId: userId, 
                    category: category.trim(), 
                    color: color.trim() 
                }
            });

            // Logic: Support for fullSet, top, or bottom
            if (res.data.fullSet || res.data.top || res.data.bottom) {
                setOutfit(res.data);
                setStep(4); 
            } else {
                setError(`No matching outfits found for '${category}' in '${color}'. Try adding more items to your wardrobe!`);
            }
        } catch (err) {
            console.error("Fetch Error:", err);
            setError("Could not fetch recommendations. API path not found on server.");
        }
        setLoading(false);
    };

    // --- RENDER: STEP 1 (Upload) ---
    if (step === 1) {
        return (
            <div className="container" style={{ textAlign: 'center', padding: '60px 20px' }}>
                <Card style={{ padding: '40px', maxWidth: '550px', margin: '0 auto', borderRadius: '30px' }}>
                    <h2>📸 Step 01: Upload Yourself</h2>
                    <p style={{ color: '#666', marginBottom: '25px' }}>Let's see your style!</p>
                    <div style={{ width: '100%', height: '350px', margin: '0 auto 25px', borderRadius: '20px', border: '2px dashed #4F46E5', overflow: 'hidden', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {previewUrl ? <img src={previewUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{color: '#aaa'}}>No Photo Selected</span>}
                    </div>
                    <label className="custom-file-upload" style={{ display: 'inline-block', padding: '15px 30px', background: '#4F46E5', color: 'white', borderRadius: '50px', cursor: 'pointer', fontWeight: 'bold', marginBottom:'15px' }}>
                        📸 Choose File
                        <input type="file" accept="image/*" onChange={(e) => { if(e.target.files[0]) { setPersonImage(e.target.files[0]); setPreviewUrl(URL.createObjectURL(e.target.files[0])); }}} style={{ display: 'none' }} />
                    </label>
                    <Button variant="primary" size="lg" fullWidth onClick={handlePersonUpload} disabled={loading || !personImage}>{loading ? 'Uploading...' : 'Next Step'}</Button>
                </Card>
            </div>
        );
    }

    // --- RENDER: STEP 2 (Preferences) ---
    if (step === 2) {
        return (
            <div className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>
                <Card style={{ padding: '40px', maxWidth: '550px', margin: '0 auto', borderRadius: '30px' }}>
                    <Button variant="outline" size="sm" onClick={() => setStep(1)} style={{float:'left', marginBottom:'20px'}}>← Back</Button>
                    <h2 style={{ marginBottom: '10px' }}>🔍 Find Your Style</h2>
                    <div style={{textAlign:'left', marginBottom:'20px'}}>
                        <label style={{fontWeight:'bold', display:'block', marginBottom:'8px'}}>Occasion / Category</label>
                        <input type="text" placeholder="e.g. Ethnic, Dates, Wedding..." value={category} onChange={(e) => setCategory(e.target.value)} style={{width:'100%', padding:'15px', borderRadius:'15px', border:'1px solid #ddd'}} />
                    </div>
                    <div style={{textAlign:'left', marginBottom:'30px'}}>
                        <label style={{fontWeight:'bold', display:'block', marginBottom:'8px'}}>Color Preference</label>
                        <input type="text" placeholder="e.g. White, Red, Black..." value={color} onChange={(e) => setColor(e.target.value)} style={{width:'100%', padding:'15px', borderRadius:'15px', border:'1px solid #ddd'}} />
                    </div>
                    <Button variant="primary" size="lg" fullWidth onClick={getRecommendation} disabled={loading}>{loading ? 'Searching Wardrobe...' : '✨ Find Matching Outfit'}</Button>
                    {error && <p style={{color:'red', marginTop:'15px', background:'#fee2e2', padding:'10px', borderRadius:'10px'}}>{error}</p>}
                </Card>
            </div>
        );
    }

    // --- RENDER: STEP 4 (Results with Full Set Logic) ---
    if (step === 4) {
        return (
            <div className="container" style={{ padding: '40px 20px', textAlign: 'center' }}>
                <h1>✨ Perfect Match Found!</h1>
                <div style={{ display: 'flex', gap: '40px', justifyContent: 'center', flexWrap: 'wrap', marginTop:'30px' }}>
                    
                    {/* User's Uploaded Photo */}
                    <Card style={{ width: '350px', padding: '15px', border: '3px solid #4F46E5', borderRadius: '25px' }}>
                        <Badge variant="primary" style={{marginBottom:'10px'}}>YOUR UPLOAD</Badge>
                        <img src={uploadedPersonUrl} alt="You" style={{ width: '100%', height: '450px', objectFit: 'cover', borderRadius: '20px' }} />
                    </Card>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <h2>Recommended Look</h2>
                        
                        {/* CASE 1: Full Set Match */}
                        {outfit.fullSet ? (
                            <Card style={{ width: '320px', padding: '15px', borderRadius:'20px', border: '2px solid #10B981' }}>
                                <img src={outfit.fullSet.image_url} alt="Full Set" style={{ width: '100%', height: '280px', objectFit: 'cover', borderRadius: '15px' }} />
                                <div style={{textAlign:'center', marginTop:'15px'}}>
                                    <Badge variant="primary">✨ FULL SET MATCH</Badge>
                                    <h4 style={{marginTop:'10px'}}>{outfit.fullSet.name}</h4>
                                    <p style={{color:'#666', fontSize:'12px'}}>Category: {outfit.fullSet.category}</p>
                                </div>
                            </Card>
                        ) : (
                            /* CASE 2: Top and Bottom Pair */
                            <>
                                {outfit.top && (
                                    <Card style={{ width: '320px', display: 'flex', gap: '15px', padding: '15px', alignItems: 'center', borderRadius:'20px' }}>
                                        <img src={outfit.top.image_url} alt="Top" style={{ width: '100px', height: '120px', objectFit: 'cover', borderRadius: '15px' }} />
                                        <div style={{textAlign:'left'}}>
                                            <Badge variant="neutral">TOP WEAR</Badge>
                                            <h4 style={{marginTop:'5px'}}>{outfit.top.name}</h4>
                                            <p style={{color:'#666', fontSize:'12px'}}>Match: {outfit.top.category}</p>
                                        </div>
                                    </Card>
                                )}
                                {outfit.bottom && (
                                    <Card style={{ width: '320px', display: 'flex', gap: '15px', padding: '15px', alignItems: 'center', borderRadius:'20px' }}>
                                        <img src={outfit.bottom.image_url} alt="Bottom" style={{ width: '100px', height: '120px', objectFit: 'cover', borderRadius: '15px' }} />
                                        <div style={{textAlign:'left'}}>
                                            <Badge variant="neutral">BOTTOM WEAR</Badge>
                                            <h4 style={{marginTop:'5px'}}>{outfit.bottom.name}</h4>
                                            <p style={{color:'#666', fontSize:'12px'}}>Match: {outfit.bottom.category}</p>
                                        </div>
                                    </Card>
                                )}
                            </>
                        )}
                        
                        <Button variant="outline" onClick={() => setStep(1)} style={{marginTop:'10px'}}>Start New Search</Button>
                    </div>
                </div>
            </div>
        );
    }
    return null; 
};

export default RecommendationPage;