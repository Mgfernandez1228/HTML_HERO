const { ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = function(app, db) {
    const usersCollection = db.collection('users');
    const JWT_SECRET = "your_super_secret_pixel_key"; // Move this to .env later

    // 1. SIGNUP (Refined Create User)
    app.post('/api/signup', async (req, res) => {
        try {
            const { username, password } = req.body;
            if (!username || !password) return res.status(400).json({ error: 'Username and Password required' });

            // Check if player already exists
            const existingUser = await usersCollection.findOne({ username });
            if (existingUser) return res.status(400).json({ error: 'Player name already taken' });

            // HASH the password before saving
            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = {
                username,
                password: hashedPassword,
                score: 0,
                createdAt: new Date()
            };

            const result = await usersCollection.insertOne(newUser);
            res.status(201).json({ message: "User Created", id: result.insertedId });
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

    // 2. LOGIN
    app.post('/api/login', async (req, res) => {
        try {
            const { username, password } = req.body;
            const user = await usersCollection.findOne({ username });

            if (!user) return res.status(404).json({ error: 'User not found' });

            // Compare hashed password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

            // Create JWT Token
            const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '2h' });

            res.status(200).json({ 
                message: "Login successful", 
                token, 
                username: user.username,
                userId: user._id 
            });
        } catch (error) {
            res.status(500).json({ error: 'Login failed' });
        }
    });

    // 3. GET: Top 10 (For Leaderboard)
    app.get('/api/users', async (req, res) => {
        try {
            // We project out the password so it's never sent to the frontend
            const users = await usersCollection.find({}, { projection: { password: 0 } })
                .sort({ score: -1 })
                .limit(10)
                .toArray();
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch users' });
        }
    });

    // 4. UPDATE Score (PUT)
    app.put('/api/users/:id', async (req, res) => {
        try {
            const userId = req.params.id;
            const updatedData = req.body; 

            // Only allow updating specific fields 
            const allowedUpdates = { $set: {} };
            if (updatedData.score !== undefined) allowedUpdates.$set.score = updatedData.score;

            const result = await usersCollection.updateOne(
                { _id: new ObjectId(userId) }, 
                allowedUpdates
            );
            
            res.status(200).json({ message: 'Progress saved' });
        } catch (error) {
            res.status(500).json({ error: 'Update failed' });
        }
    });
};