import express from 'express';
import { MongoClient } from 'mongodb';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://ilybasicmwa:lIL06VXCGX8YEWjA@candleshop.c4bjh.mongodb.net/?retryWrites=true&w=majority&appName=candleshop";
const client = new MongoClient(uri);

async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

connectToDatabase();

app.post('/api/orders', async (req, res) => {
  try {
    const order = req.body;
    const database = client.db("candleshop");
    const orders = database.collection("orders");
    
    const result = await orders.insertOne({
      ...order,
      createdAt: new Date()
    });
    
    res.status(201).json({ message: "Order created successfully", orderId: result.insertedId });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Error creating order" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});