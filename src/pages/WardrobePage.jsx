import { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom'; // navigate added
import { Button, Card, Badge } from '../components/common';
import './WardrobePage.css';

const WardrobePage = () => {
    const [activeCategory, setActiveCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [clothes, setClothes] = useState([]); 
    const [showForm, setShowForm] = useState(false); 
    const [imageFile, setImageFile] = useState(null); 
    const navigate = useNavigate();
    
    // Default values
    const [newItem, setNewItem] = useState({ name: '', category: 'Casual', color: '', type: 'Top Wear' });
    
    const location = useLocation(); 
    const user = JSON.parse(localStorage.getItem('user')); 
    const userId = user ? user.user_id : null;

    // --- LOGIC: Check if user is logged in ---
    useEffect(() => {
        if (!userId) {
            alert("Access Denied. Please login first!");
            navigate('/login');
        }
    }, [userId, navigate]);

    const fetchClothes = () => {
        if (!userId) return;
        // Logic: Fetch only this specific user's wardrobe
        axios.get(`http://localhost:8081/api/clothes/${userId}`)
            .then(res => setClothes(res.data))
            .catch(err => console.log("Fetch Error:", err));
    };

    useEffect(() => { 
        fetchClothes(); 
    }, [userId]);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const filterParam = params.get('filter');

        if (filterParam === 'favorites') {
            setActiveCategory('favorites');
        } else if (!activeCategory || activeCategory === 'all') {
             setActiveCategory('all');
        }
    }, [location.search]); 

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to remove this item from your wardrobe?")) {
            axios.delete(`http://localhost:8081/api/delete-item/${id}`).then(() => fetchClothes());
        }
    };

    const toggleFavorite = (item) => {
        const newStatus = item.is_favorite === 1 ? 0 : 1;
        const updatedClothes = clothes.map(c => 
            c.id === item.id ? { ...c, is_favorite: newStatus } : c
        );
        setClothes(updatedClothes);

        axios.put(`http://localhost:8081/api/update-item/${item.id}`, { ...item, is_favorite: newStatus })
            .catch(err => {
                console.error("Favorite Update Error:", err);
                fetchClothes(); 
            });
    };

    const handleUpload = (e) => {
        e.preventDefault();
        if (!userId) return alert("Session expired. Please login again.");

        const formData = new FormData();
        formData.append('image', imageFile); 
        formData.append('name', newItem.name);
        formData.append('category', newItem.category); 
        formData.append('color', newItem.color);
        formData.append('type', newItem.type);
        formData.append('user_id', userId); // Logic: Binding item to user_id

        axios.post('http://localhost:8081/api/upload-item', formData).then(() => {
            alert("New item added to your wardrobe successfully!"); 
            setShowForm(false); 
            fetchClothes();
        });
    };

    const filteredItems = clothes.filter(item => {
        if (activeCategory === 'favorites') return item.is_favorite === 1;
        if (activeCategory === 'all') return true;
        return item.category && item.category.toLowerCase() === activeCategory.toLowerCase();
    }).filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <main className="wardrobe-page">
            <div className="container">
                <div className="wardrobe-header">
                    <div className="wardrobe-header-content">
                        <h1 className="wardrobe-title">My Wardrobe</h1>
                        <input 
                            type="text" 
                            placeholder="Search (e.g. Red Kurta)..." 
                            className="search-bar" 
                            style={{ padding: '12px 20px', borderRadius: '30px', border: '1px solid #ddd', width: '350px', outline: 'none', fontSize: '14px' }}
                            onChange={(e) => setSearchQuery(e.target.value)} 
                        />
                    </div>
                    <Button variant="primary" onClick={() => setShowForm(true)}>Add Clothes</Button>
                </div>

                {showForm && (
                    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <div style={{ background: 'white', padding: '30px', borderRadius: '15px', width: '400px', color: 'black', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
                            <h2 style={{ marginBottom: '20px', textAlign: 'center', fontWeight: '600' }}>Add New Clothes</h2>
                            <form onSubmit={handleUpload}>
                                <label style={{fontSize: '12px', color: '#666', fontWeight: 'bold'}}>Cloth Name</label>
                                <input type="text" placeholder="e.g. Red Diwali Kurta" required style={{ width: '100%', marginBottom: '12px', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} onChange={(e) => setNewItem({...newItem, name: e.target.value})} />
                                
                                <label style={{fontSize: '12px', color: '#666', fontWeight: 'bold'}}>Category</label>
                                <select style={{ width: '100%', marginBottom: '12px', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} onChange={(e) => setNewItem({...newItem, category: e.target.value})}>
                                    <option value="Casual">Casual</option>
                                    <option value="Formal">Formal</option>
                                    <option value="Party">Party</option>
                                    <option value="Wedding">Wedding</option>
                                    <option value="Ethnic">Ethnic (Traditional)</option>
                                    <option value="Dates">Dates</option>
                                </select>

                                <label style={{fontSize: '12px', color: '#666', fontWeight: 'bold'}}>Color</label>
                                <input type="text" placeholder="e.g. Red" style={{ width: '100%', marginBottom: '12px', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} onChange={(e) => setNewItem({...newItem, color: e.target.value})} />
                                
                                <label style={{fontSize: '12px', color: '#666', fontWeight: 'bold'}}>Type</label>
                                <select style={{ width: '100%', marginBottom: '15px', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} onChange={(e) => setNewItem({...newItem, type: e.target.value})}>
                                    <option value="Top Wear">Top Wear</option>
                                    <option value="Bottom Wear">Bottom Wear</option>
                                    <option value="Full Set">Full Set</option>
                                    <option value="Shoes">Shoes</option>
                                </select>

                                <input type="file" required onChange={(e) => setImageFile(e.target.files[0])} style={{ marginBottom: '20px', fontSize: '13px' }} />
                                
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button type="submit" style={{ flex: 1, padding: '12px', background: '#4F46E5', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Add</button>
                                    <button type="button" onClick={() => setShowForm(false)} style={{ flex: 1, padding: '12px', background: '#F3F4F6', color: 'black', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                <div className="wardrobe-filters">
                    {['all', 'casual', 'formal', 'party', 'wedding', 'ethnic', 'dates', 'favorites'].map((cat) => (
                        <button key={cat} className={`filter-btn ${activeCategory === cat ? 'active' : ''}`} onClick={() => setActiveCategory(cat)}>
                            {cat === 'favorites' ? 'MY FAVORITES ❤️' : cat.toUpperCase()}
                        </button>
                    ))}
                </div>

                <div className="wardrobe-grid">
                    <div className="wardrobe-add-card" onClick={() => setShowForm(true)} style={{ cursor: 'pointer', border: '2px dashed #4F46E5', background: '#F9FAFB' }}>
                        <div className="wardrobe-add-icon" style={{ fontSize: '30px', color: '#4F46E5' }}>+</div>
                        <p style={{ fontWeight: 'bold', color: '#4F46E5' }}>Add Clothes</p>
                    </div>

                    {filteredItems.map((item) => (
                        <Card key={item.id} className="wardrobe-item" style={{ position: 'relative', overflow: 'hidden', borderRadius: '12px' }}>
                            <div style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', flexDirection: 'column', gap: '10px', zIndex: 10 }}>
                                <button onClick={() => handleDelete(item.id)} style={{ background: 'white', border: 'none', borderRadius: '50%', width: '38px', height: '38px', cursor: 'pointer', color: '#EF4444', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>🗑️</button>
                                <button onClick={() => toggleFavorite(item)} style={{ background: 'white', border: 'none', borderRadius: '50%', width: '38px', height: '38px', cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                                    {item.is_favorite ? '❤️' : '🤍'}
                                </button>
                            </div>
                            
                            <img src={item.image_url} alt={item.name} style={{ width: '100%', height: '280px', objectFit: 'cover' }} />
                            
                            <div style={{ padding: '15px', color: 'black' }}>
                                <h3 style={{ margin: '0 0 8px 0', fontSize: '1.1rem', fontWeight: '600' }}>{item.name}</h3>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Badge variant="neutral" style={{ padding: '4px 10px' }}>{item.category}</Badge>
                                    <span style={{ fontSize: '12px', color: '#6B7280', fontWeight: '500' }}>{item.color} | {item.type}</span>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </main>
    );
};

export default WardrobePage;