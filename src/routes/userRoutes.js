const { ObjectId } = require('mongodb');

module.exports = function(app, db) {
    const usersCollection = db.collection('users');

    // GET: Top 10 Users
    app.get('/api/users', async (req, res) => {
        try {
            const users = await usersCollection.find({}).sort({ score: -1 }).limit(10).toArray();
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch users' });
        }
    });

    // POST: Create User
    app.post('/api/users', async (req, res) => {
        try {
            if (!req.body.username) return res.status(400).json({ error: 'Username required' });
            const result = await usersCollection.insertOne(req.body);
            res.status(201).json(result);
        } catch (error) {
            res.status(500).json({ error: 'Failed to create user' });
        }
    });

    // DELETE: Delete User
    app.delete('/api/users/:id', async (req, res) => {
        try {
            const result = await usersCollection.deleteOne({ _id: new ObjectId(req.params.id) });
            res.status(result.deletedCount === 0 ? 404 : 204).send();
        } catch (error) {
            res.status(500).json({ error: 'Invalid ID format' });
        }
    });
    
    // ... you can add the PUT route here too
};