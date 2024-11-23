const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

app.use(cors({
    origin: ['http://localhost:3000', 'https://material-game.vercel.app'],
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
}));


mongoose.connect("mongodb+srv://abosalah:Abo_salah100@cluster0.vuac5.mongodb.net/material_sorting_game?retryWrites=true&w=majority");

app.get('/', (req, res) => {
    res.send('Hello from Express server!');
});

module.exports = app;


const materialSchema = new mongoose.Schema({
    name: { type: String, required: true },
    isGood: { type: Boolean, required: true },
    description: { type: String, required: true },
  });
  
  const Material = mongoose.model('Material', materialSchema);
  module.exports = Material;


    // Endpoint لإضافة مادة جديدة
    app.post('/api/materials', async (req, res) => {
        try {
            const material = req.body;  // الحصول على البيانات المرسلة في الجسم
            console.log("Received material:", material);  // طباعة البيانات التي تم إرسالها
            if (!material || !material.name || typeof material.isGood !== 'boolean' || !material.description) {
                return res.status(400).json({ message: "Missing or invalid required fields." });
            }
    
            // إضافة المادة إلى قاعدة البيانات
            const newMaterial = new Material({
                name: material.name,
                isGood: material.isGood,   // استخدم isGood بدلاً من is_good
                description: material.description
            });
            await newMaterial.save();
    
            res.status(201).json(newMaterial);  // إرسال رد بنجاح
        } catch (error) {
            console.error(error);  // طباعة الخطأ في الخادم
            res.status(500).json({ message: "Internal Server Error" });
        }
    });

    // Endpoint لاسترجاع جميع المواد
    app.get('/api/materials', async (req, res) => {
        try {
            const materials = await Material.find().sort({ _id: -1 });  // استرجاع جميع المواد من قاعدة البيانات
            res.json(materials);
        } catch (err) {
            res.status(500).json({ message: 'Error fetching materials', error: err.message });
            console.error("Error:", err);
        }
    });

    // Endpoint لحذف مادة حسب الاسم
    app.delete('/api/materials/:name', async (req, res) => {
        const { name } = req.params;

        try {
            const result = await Material.deleteOne({ name });
            if (result.deletedCount === 0) {
                return res.status(404).json({ message: 'Material not found' });
            }
            res.json({ message: 'Material removed' });
        } catch (err) {
            res.status(500).json({ message: 'Error removing material', error: err.message });
        }
    });

    app.use((err, req, res, next) => {
        console.error(err.stack);
        res.status(500).send('Something went wrong!');
    });
    
    app.use(express.json());  // تأكد من أن هذه السطر موجود لمعالجة JSON


const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    phone: String,
    childName: String, 
    childAge: Number,  
});

const User = mongoose.model("User", userSchema);
module.exports = User;

app.post("/api/signup", async (req, res) => {
    const { username, password, email, phone, childName, childAge} = req.body;
    if (!username || !password || !email || !phone || !childName || !childAge) {
        return res.status(400).send("All fields are required.");
    }

    try {
        const newUser = new User({ username, password, email, phone, childName, childAge,});
        await newUser.save();
        res.status(201).send("User registered successfully.");
    } catch (err) {
        res.status(500).send("Error registering user.");
    }
});

app.post("/api/signin", async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username, password });
    if (!user) {
        return res.status(401).send("Invalid username or password.");
    }

    res.status(200).send("Login successful.");
});


// Define schema and model
const playerSchema = new mongoose.Schema({
    name: String,
    score: Number,
});

const Player = mongoose.model('Player', playerSchema);

// Save a player's score
app.post('/api/score', async (req, res) => {
    const { name, score } = req.body;
    if (!name || score === undefined) {
        return res.status(400).send('Name and score are required.');
    }

    try {
        const newPlayer = new Player({ name, score });
        await newPlayer.save();
        res.status(201).send('Score saved successfully.');
    } catch (err) {
        res.status(500).send('Error saving score.');
    }
});

// Fetch UserData
app.get('/api/user-info/:username', async (req, res) => {
    const { username } = req.params;

    try {
        // ابحث عن المستخدم بناءً على اسم المستخدم
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).send('User not found.');
        }

        console.log(user); // طباعة البيانات للتحقق

        // أعد إرسال بيانات المستخدم
        res.status(200).json({
            username: user.username,
            email: user.email,
            phone: user.phone,
            childName: user.childName,
            childAge: user.childAge,
        });
    } catch (err) {
        res.status(500).send('Error fetching user information.');
    }
});


// Fetch leaderboard
app.get('/api/leaderboard', async (req, res) => {
    try {
        const leaderboard = await Player.find().sort({ score: -1 }).limit(10);
        res.status(200).json(leaderboard);
    } catch (err) {
        res.status(500).send('Error fetching leaderboard.');
    }
});


    app.delete("/api/leaderboard", async (req, res) => {
        try {
            // مسح كافة البيانات من collection players
            const result = await Player.deleteMany({});
            if (result.deletedCount === 0) {
                return res.status(404).send("No data found to clear.");
            }
            res.status(200).send("Leaderboard data cleared successfully.");
        } catch (error) {
            console.error("Error clearing leaderboard:", error);
            res.status(500).send(`Error clearing leaderboard data: ${error.message}`);
        }
    });




// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
