const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = 5500;

// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4sdse.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("hostel");
        const foodCollection = database.collection("foods");

        // GET API - Food Item
        app.get('/foods', async (req, res) => {
            const cursor = foodCollection.find({});
            const foodLists = await cursor.toArray();
            res.send(foodLists);
        })

        app.get('/foods/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const displayFoods = await foodCollection.findOne(query);
            console.log('Load User with ID: ', id);
            res.send(displayFoods);
        })


        //POST API - Food Item
        app.post('/foods', async (req, res) => {
            const newFood = req.body;
            const result = await foodCollection.insertOne(newFood);
            console.log("Add new Food Item", req.body);
            console.log("Hitting the new food item", result);
            res.json(result);
        })
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send("Welcome to Yoda Hostel backend")
})

// Listening the port
app.listen(port, () => {
    console.log("Running server on port", port);
})