import React, { useState } from 'react';
import axios from 'axios';
import { Button, Card, Badge, Icons } from '../components/common';

const AIStyledPage = () => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [resultUrl, setResultUrl] = useState('');
    const user = JSON.parse(localStorage.getItem('user'));

    const [formData, setFormData] = useState({
        height: '5.6ft',
        weight: '51kg',
        skinTone: 'Dusky / Sandal',
        bodyType: 'Slim',
        occasion: 'Night Date',
        colorPref: 'Navy Blue & Black',
        fit: 'Slim Fit'
    });

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        setPreview(URL.createObjectURL(selectedFile));
    };

    const handleUpload = async () => {
        if (!file) return alert("Please choose a file first!");
        setLoading(true);
        const data = new FormData();
        data.append('image', file);
        data.append('user_id', user.user_id);

        try {
            // This just saves your reference photo
            const res = await axios.post('http://localhost:8081/api/upload-person', data);
            if (res.data.Status === "Success") {
                setStep(2);
            } else {
                alert("Upload failed: " + res.data.Error);
            }
        } catch (err) {
            alert("Upload failed. Moving to next step anyway for AI generation.");
            setStep(2);
        }
        setLoading(false);
    };

    const generateOutfit = async () => {
        setLoading(true);
        setResultUrl('');
        try {
            const res = await axios.post('http://localhost:8081/api/generate-ai-outfit', {
                ...formData,
                userId: user.user_id
            }, { timeout: 60000 }); // 60 second timeout for AI generation
            if (res.data.Status === "Success") {
                setResultUrl(res.data.image_url);
            } else {
                alert(res.data.Message || "Generation failed. Please try again.");
            }
        } catch (err) {
            alert("AI is generating your outfit. This may take 20-30 seconds. Please try again!");
        }
        setLoading(false);
    };

    return (
        <div className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>
            <h1>🤖 <span className="gradient-text">AI Fashion Designer</span></h1>

            {step === 1 ? (
                <Card style={{ maxWidth: '500px', margin: 'auto', padding: '30px', borderRadius: '25px' }}>
                    <h3>📸 Step 01: Upload Yourself</h3>
                    <div style={{ border: '2px dashed #ddd', padding: '20px', marginBottom: '20px', borderRadius: '15px' }}>
                        {preview ? <img src={preview} style={{ width: '100%', borderRadius: '10px' }} /> : <Icons.Cloud size={48} color="#ccc" />}
                    </div>
                    <input type="file" onChange={handleFileChange} id="fileInput" hidden />
                    <Button onClick={() => document.getElementById('fileInput').click()}>Choose File</Button>
                    <Button variant="primary" onClick={handleUpload} disabled={loading} style={{ marginLeft: '10px' }}>
                        {loading ? 'Processing...' : 'Next Step'}
                    </Button>
                </Card>
            ) : (
                <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <Card style={{ width: '450px', padding: '30px', textAlign: 'left', borderRadius: '25px' }}>
                        <h3 style={{ marginBottom: '20px' }}>Designer Brief</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                            <div>
                                <label style={labelStyle}>Height</label>
                                <input type="text" value={formData.height} onChange={(e) => setFormData({ ...formData, height: e.target.value })} style={inputStyle} />
                            </div>
                            <div>
                                <label style={labelStyle}>Weight</label>
                                <input type="text" value={formData.weight} onChange={(e) => setFormData({ ...formData, weight: e.target.value })} style={inputStyle} />
                            </div>
                        </div>
                        <div style={{ marginTop: '15px' }}>
                            <label style={labelStyle}>Skin Tone</label>
                            <input type="text" value={formData.skinTone} onChange={(e) => setFormData({ ...formData, skinTone: e.target.value })} style={inputStyle} />
                        </div>
                        <div style={{ marginTop: '15px' }}>
                            <label style={labelStyle}>Occasion</label>
                            <input type="text" value={formData.occasion} onChange={(e) => setFormData({ ...formData, occasion: e.target.value })} style={inputStyle} />
                        </div>
                        <div style={{ marginTop: '15px', marginBottom: '25px' }}>
                            <label style={labelStyle}>Color Preference</label>
                            <input type="text" value={formData.colorPref} onChange={(e) => setFormData({ ...formData, colorPref: e.target.value })} style={inputStyle} />
                        </div>
                        <Button variant="primary" onClick={generateOutfit} disabled={loading} fullWidth size="lg">
                            {loading ? '🤖 AI is Stitching...' : '✨ Generate Outfit'}
                        </Button>
                    </Card>

                    <Card style={{ width: '450px', minHeight: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '25px', border: '2px dashed #4F46E5', overflow: 'hidden' }}>
                        {loading ? (
                            <div style={{ textAlign: 'center' }}>
                                <div className="spinner"></div>
                                <p style={{ marginTop: '15px', color: '#4F46E5' }}>Designing your masterpiece... <br /> (Please wait 20-30 seconds)</p>
                            </div>
                        ) : resultUrl ? (
                            <img
                                src={resultUrl}
                                alt="AI Result"
                                style={{ width: '100%', height: 'auto', borderRadius: '15px' }}
                                referrerPolicy="no-referrer"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "https://placehold.co/400x600?text=Generation+Error+-+Try+Again";
                                }}
                            />
                        ) : (
                            <div style={{ color: '#aaa', textAlign: 'center' }}>
                                <Icons.Sparkles size={48} style={{ opacity: 0.3, marginBottom: '10px' }} />
                                <p>AI Generated Outfit will appear here</p>
                            </div>
                        )}
                    </Card>
                </div>
            )}
        </div>
    );
};

const labelStyle = { fontSize: '12px', fontWeight: 'bold', display: 'block', marginBottom: '5px' };
const inputStyle = { width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ddd' };

export default AIStyledPage;