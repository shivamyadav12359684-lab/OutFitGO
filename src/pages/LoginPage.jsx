import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../components/common';
import './LoginPage.css';

const LoginPage = () => {
    const [isLogin, setIsLogin] = useState(true); 
    const [name, setName] = useState(''); 
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Fix: Backend routes are /login and /signup (removed /api/)
        const url = isLogin ? 'http://localhost:8081/login' : 'http://localhost:8081/signup';
        
        // Fix: Key changed from 'full_name' to 'name' to match server.js signup
        const data = isLogin ? { email, password } : { name, email, password };

        axios.post(url, data)
            .then(res => {
                // Fix: Changed 'status' to 'Status' (Case sensitive match)
                if(res.data.Status === "Success") {
                    if(isLogin) {
                        // Success: Shivam (ID 1) ya Pooja (ID 3) mil gaye!
                        alert("Login Successful! Welcome to OutfitGo.");
                        localStorage.setItem('user', JSON.stringify(res.data.user)); 
                        navigate('/home'); 
                    } else {
                        // Success: Naya user database mein save ho gaya
                        alert(res.data.Message || "Account created successfully! Please login."); 
                        setIsLogin(true); 
                    }
                } else {
                    // Logic: Server ka genuine error message dikhao (e.g. "Account not found")
                    alert(res.data.Message || "Authentication failed."); 
                }
            })
            .catch(err => {
                console.error("Connection Error:", err);
                alert("Server is down! Terminal check karo (node server.js chalu hai na?).");
            });
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
                <form onSubmit={handleSubmit}>
                    {!isLogin && (
                        <input 
                            type="text" 
                            placeholder="Full Name" 
                            value={name}
                            onChange={e => setName(e.target.value)} 
                            required 
                        />
                    )}
                    <input 
                        type="email" 
                        placeholder="Email (e.g. shivam@gmail.com)" 
                        value={email}
                        onChange={e => setEmail(e.target.value)} 
                        required 
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        value={password}
                        onChange={e => setPassword(e.target.value)} 
                        required 
                    />
                    <Button variant="primary" type="submit" fullWidth>
                        {isLogin ? 'Login Now' : 'Sign Up'}
                    </Button>
                </form>
                
                <p 
                    onClick={() => {
                        setIsLogin(!isLogin);
                        setName(''); // Clear form on switch
                    }} 
                    style={{ marginTop: '15px', cursor: 'pointer', color: '#4F46E5', fontSize: '14px' }}
                >
                    {isLogin ? "New user? Create an account" : "Already have an account? Login"}
                </p>
            </div>
        </div>
    );
};

export default LoginPage;