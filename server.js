
import express from 'express';
import mysql from 'mysql';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// --- 1. FOLDERS SETUP ---
const uploadDir = './public/images';
const personDir = './public/persons';

[uploadDir, personDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// --- 2. MULTER STORAGE CONFIG ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const personStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, personDir),
    filename: (req, file, cb) => cb(null, 'person-' + Date.now() + path.extname(file.originalname))
});

const upload = multer({ storage: storage });
const uploadPerson = multer({ storage: personStorage });

app.use('/images', express.static('public/images'));
app.use('/persons', express.static('public/persons'));

// --- 3. DATABASE CONNECTION ---
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "outfitgo_db"
});

db.connect((err) => {
    if (err) console.error("Database error:", err.message);
    else console.log("Connected to MySQL: outfitgo_db");
});

// ==========================================
// 🔻 SECTION 1: AUTHENTICATION (GENUINE LOGIC) 🔻
// ==========================================

// 1. SIGNUP API
app.post('/signup', (req, res) => {
    const { name, email, password } = req.body;
    const checkSql = "SELECT * FROM users WHERE email = ?";
    db.query(checkSql, [email], (err, result) => {
        if (err) return res.json({ Error: "Database error during check" });
        if (result.length > 0) {
            return res.json({ Status: "Error", Message: "Account already exists with this email. Please Login." });
        }
        const sql = "INSERT INTO users (full_name, email, password) VALUES (?, ?, ?)";
        db.query(sql, [name, email, password], (err, data) => {
            if (err) return res.json({ Error: "Signup Failed" });
            return res.json({ Status: "Success", Message: "User registered successfully!" });
        });
    });
});

// 2. LOGIN API
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
    db.query(sql, [email, password], (err, data) => {
        if (err) return res.json({ Error: "Login Error inside Server" });
        if (data.length > 0) {
            return res.json({ Status: "Success", user: data[0] });
        } else {
            return res.json({ Status: "Error", Message: "Account not found. Please create a new account first!" });
        }
    });
});

// ==========================================
// 🔻 SECTION 2: WARDROBE & FAVORITES 🔻
// ==========================================

app.post('/api/upload-item', upload.single('image'), (req, res) => {
    const { name, category, color, type, user_id } = req.body;
    const image_url = `http://localhost:8081/images/${req.file.filename}`;
    const sql = "INSERT INTO clothes (name, category, color, type, image_url, user_id) VALUES (?, ?, ?, ?, ?, ?)";
    db.query(sql, [name, category, color, type, image_url, user_id], (err) => {
        if (err) return res.json({ Error: err.message });
        return res.json({ Status: "Success" });
    });
});

app.get('/api/clothes/:user_id', (req, res) => {
    db.query("SELECT * FROM clothes WHERE user_id = ?", [req.params.user_id], (err, results) => {
        if (err) return res.status(500).json(err);
        return res.json(results);
    });
});

app.delete('/api/delete-item/:id', (req, res) => {
    const sql = "DELETE FROM clothes WHERE id = ?";
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ Error: err.message });
        return res.json({ Status: "Success" });
    });
});

app.put('/api/update-item/:id', (req, res) => {
    const { is_favorite } = req.body;
    const sql = "UPDATE clothes SET is_favorite = ? WHERE id = ?";
    db.query(sql, [is_favorite, req.params.id], (err, result) => {
        if (err) return res.status(500).json({ Error: err.message });
        return res.json({ Status: "Success" });
    });
});

// ==========================================
// 🔻 SECTION 3: RECOMMENDATION ENGINES 🔻
// ==========================================

app.post('/api/save-log', (req, res) => {
    const { userId, mood_tag, occasion, weather_condition, temp_recorded } = req.body;
    const sql = "INSERT INTO recommendation_logs (user_id, mood_tag, occasion, weather_condition, temp_recorded) VALUES (?, ?, ?, ?, ?)";
    db.query(sql, [userId, mood_tag, occasion, weather_condition, temp_recorded], (err) => {
        if (err) return res.status(500).json(err);
        return res.json({ Status: "Success" });
    });
});

// ✅ SMART RECOMMENDATION LOGIC (FIXED)
app.get('/api/recommend', (req, res) => {
    const { userId, category, color } = req.query;

    // Logic: Matches category OR searches for keywords in name
    const sql = "SELECT * FROM clothes WHERE user_id = ? AND (category = ? OR name LIKE ?) AND color LIKE ?";
    const searchKeyword = `%${category}%`;
    const colorParam = `%${color}%`;

    db.query(sql, [userId, category, searchKeyword, colorParam], (err, results) => {
        if (err) return res.status(500).json(err);

        if (results.length === 0) {
            return res.json({ message: "No matching outfits found." });
        }

        // 1. PRIORITY: Check for 'Full Set' first
        const fullSet = results.find(item => item.type === 'Full Set');
        if (fullSet) {
            return res.json({ fullSet: fullSet });
        }

        // 2. PAIR LOGIC: Find separate Top and Bottom
        const top = results.find(item => item.type === 'Top Wear') || null;
        const bottom = results.find(item => item.type === 'Bottom Wear') || null;

        // Returns only found items, prevents repeating the same item
        return res.json({ top, bottom });
    });
});

app.get('/api/weather-recommend', (req, res) => {
    const { userId, condition } = req.query;
    let sql = "SELECT * FROM clothes WHERE user_id = ?";
    if (condition === 'rainy') sql += " AND category = 'Casual' AND color NOT LIKE '%White%'";
    else if (condition === 'hot') sql += " AND (category = 'Casual' OR color = 'White' OR type = 'Top Wear')";
    else if (condition === 'cold') sql += " AND (category = 'Formal' OR type = 'Full Set')";
    db.query(sql, [userId], (err, results) => {
        if (err) return res.status(500).json(err);
        if (results.length === 0) return res.json({ message: "No match found" });
        const top = results.find(item => item.type === 'Top Wear') || results[0];
        const bottom = results.find(item => item.type === 'Bottom Wear') || results[0];
        return res.json({ top, bottom });
    });
});

app.get('/api/festival-recommend', (req, res) => {
    const { userId } = req.query;
    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentDay = today.getDate();
    const sqlFestival = `SELECT * FROM festival_rules WHERE month = ? AND (day BETWEEN ? AND ?)`;
    db.query(sqlFestival, [currentMonth, currentDay, currentDay + 3], (err, festivals) => {
        if (err) return res.status(500).json(err);
        let finalQuery = "SELECT * FROM clothes WHERE user_id = ?";
        let queryParams = [userId];
        let message = "";
        if (festivals.length > 0) {
            const fest = festivals[0];
            message = `It's ${fest.festival_name}! Time for ${fest.required_category} wear.`;
            finalQuery += " AND category = ?";
            queryParams.push(fest.required_category);
            if (fest.required_color) {
                finalQuery += " AND color LIKE ?";
                queryParams.push(`%${fest.required_color}%`);
            }
        } else {
            if (currentMonth >= 3 && currentMonth <= 6) { message = "It's Summer! Stay cool."; finalQuery += " AND category = 'Casual'"; }
            else if (currentMonth >= 7 && currentMonth <= 9) { message = "It's Monsoon! Avoid whites."; finalQuery += " AND category = 'Casual' AND color != 'White'"; }
            else { message = "It's Winter! Layer up."; finalQuery += " AND (category = 'Formal' OR type = 'Full Set')"; }
        }
        db.query(finalQuery, queryParams, (err, clothes) => {
            if (err) return res.status(500).json(err);
            if (clothes.length === 0) {
                const fallbackSql = "SELECT * FROM clothes WHERE user_id = ? ORDER BY RAND() LIMIT 2";
                db.query(fallbackSql, [userId], (err, backup) => {
                    return res.json({ message: message + " (No exact match in Wardrobe. Showing random picks.)", top: backup[0], bottom: backup[1] || backup[0] });
                });
            } else {
                const top = clothes.find(c => c.type === 'Top Wear') || clothes[0];
                const bottom = clothes.find(c => c.type === 'Bottom Wear') || clothes.find(c => c.id !== top.id) || clothes[0];
                return res.json({ message, top, bottom });
            }
        });
    });
});

app.post('/api/upload-person', uploadPerson.single('image'), (req, res) => {
    const { user_id } = req.body;
    const image_url = `http://localhost:8081/persons/${req.file.filename}`;
    const sql = "INSERT INTO user_uploads (user_id, image_url) VALUES (?, ?)";
    db.query(sql, [user_id, image_url], (err) => {
        if (err) return res.json({ Error: err.message });
        return res.json({ Status: "Success", image_url });
    });
});

// ==========================================
// 🔻 SECTION 4: AI OUTFIT GENERATION 🔻
// ==========================================

// Curated fashion image IDs from Pexels (free CDN, always available)
const fashionImages = {
    casual: [1536619, 2043590, 1183266, 1021693, 2220316, 3622614, 2896840, 1300550, 2466756, 2887766],
    formal: [1043474, 2897531, 1300550, 1040880, 2955376, 3622614, 2531734, 2220316, 1536619, 2043590],
    party: [2531734, 2896840, 2955376, 2887766, 1536619, 3622614, 1183266, 2466756, 2043590, 1300550],
    date: [2897531, 2887766, 2531734, 2955376, 1043474, 2896840, 2043590, 3622614, 1536619, 2466756],
    wedding: [1043474, 2897531, 2955376, 1040880, 2531734, 1300550, 2220316, 2043590, 3622614, 2896840],
    default: [1536619, 2043590, 1183266, 1021693, 2220316, 3622614, 2896840, 1300550, 2466756, 2887766]
};

app.post('/api/generate-ai-outfit', async (req, res) => {
    const { occasion, colorPref } = req.body;
    const seed = Date.now();
    const fileName = `ai-outfit-${seed}.jpg`;
    const filePath = path.join('public', 'images', fileName);

    // Match occasion to curated category  
    const occasionLower = (occasion || '').toLowerCase();
    let category = 'default';
    if (occasionLower.includes('casual')) category = 'casual';
    else if (occasionLower.includes('formal') || occasionLower.includes('office') || occasionLower.includes('work')) category = 'formal';
    else if (occasionLower.includes('party') || occasionLower.includes('club') || occasionLower.includes('night')) category = 'party';
    else if (occasionLower.includes('date') || occasionLower.includes('dinner')) category = 'date';
    else if (occasionLower.includes('wedding') || occasionLower.includes('festival') || occasionLower.includes('traditional')) category = 'wedding';

    const ids = fashionImages[category];
    const randomId = ids[Math.floor(Math.random() * ids.length)];
    const imageUrl = `https://images.pexels.com/photos/${randomId}/pexels-photo-${randomId}.jpeg?auto=compress&cs=tinysrgb&w=512&h=768&dpr=1`;

    try {
        const response = await fetch(imageUrl, { redirect: 'follow', signal: AbortSignal.timeout(15000) });
        if (!response.ok) throw new Error(`Pexels: ${response.status}`);

        const buffer = Buffer.from(await response.arrayBuffer());
        fs.writeFileSync(filePath, buffer);

        const localUrl = `http://localhost:8081/images/${fileName}`;
        return res.json({ Status: "Success", image_url: localUrl });
    } catch (err) {
        console.error("Image fetch error:", err.message);
        // Ultimate fallback: return the CDN URL directly
        return res.json({ Status: "Success", image_url: imageUrl });
    }
});

app.listen(8081, () => console.log("Server running on port 8081..."));
