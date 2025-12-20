const { MongoClient, ServerApiVersion } = require('mongodb');

const client = new MongoClient(process.env.MONGO_URI, {
    serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true }
});

async function connectDB() {
    try {
        await client.connect();
        console.log('🟢 MongoDB connection successful!');
        return client.db('htmlherodb');
    } catch (error) {
        console.error('🔴 MongoDB connection error:', error);
        process.exit(1);
    }
}

module.exports = connectDB;