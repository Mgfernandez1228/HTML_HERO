const path = require('path');

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const registerUserRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({ origin: ['http://localhost:5173', 'http://127.0.0.1:5173','http://localhost:5174', 'http://127.0.0.1:5174'] }));
app.use(express.json());

// Main Bootup Logic
async function startServer() {
    const db = await connectDB(); // 1. Connect to DB
    
    registerUserRoutes(app, db);  // 2. Load the routes

    app.listen(PORT, () => {      // 3. Start listening
        console.log(`🚀 Server running at http://localhost:${PORT}`);
    });

    // Serve static assets (JS, CSS, images) from the 'dist' folder
    app.use(express.static(path.join(__dirname, '..', 'dist')));

    app.get(/.*/, (req, res) => { // <-- Use the standard simple wildcard
    res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
    });


}

startServer();