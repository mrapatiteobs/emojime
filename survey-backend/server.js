const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const uri = 'your-mongodb-connection-string-here'; // Replace with your actual MongoDB URI
const client = new MongoClient(uri);

async function connectDB() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("MongoDB connection error:", error);
    }
}

connectDB();

const database = client.db("surveyDB");
const responses = database.collection("responses");

app.post('/submit-survey', async (req, res) => {
    try {
        const { username, surveyAnswer } = req.body;
        await responses.insertOne({ username, surveyAnswer, timestamp: new Date() });
        res.json({ message: "Response saved successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error saving response" });
    }
});

app.listen(3000, () => console.log("Server running on port 3000"));
