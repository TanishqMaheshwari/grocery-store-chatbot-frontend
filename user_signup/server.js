const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const QRCode = require('qrcode');
const app = express();
const port = 3000;

const mongoUri = 'mongodb+srv://chandran0303cn:POXVa3cpoagtpU7q@cluster0.iq6t67w.mongodb.net/?retryWrites=true&w=majority';

const client = new MongoClient(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });

async function connectToMongoDB() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB", error);
    }
}

connectToMongoDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

app.post('/submit-form', async (req, res) => {
    try {
        const collection = client.db("Supermarket_User_Profile").collection("User_preferences");
        const result = await collection.insertOne(req.body);
        const userId = result.insertedId;

        const qrCodeUrl = await QRCode.toDataURL(userId.toString());

        res.json({ qrCodeUrl });
    } catch (error) {
        console.error("Error submitting form:", error);
        res.status(500).send('Error submitting form');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

