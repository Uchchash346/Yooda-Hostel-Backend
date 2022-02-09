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
        const studentsCollection = database.collection("students");

        // GET API - Students Information
        app.get('/students', async (req, res) => {
            const cursor = studentsCollection.find({});
            const studentLists = await cursor.toArray();
            res.send(studentLists);
        })

        app.get('/students/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const displayStudentsInfo = await studentsCollection.findOne(query);
            console.log('Load User with ID: ', id);
            res.send(displayStudentsInfo);
        })

        // POST API - Students Information
        app.post('/students', async (req, res) => {
            const newStudent = req.body;
            const insertStudentInfo = await studentsCollection.insertOne(newStudent);
            console.log("Add new Students Information", req.body);
            console.log("Hitting new students information", insertStudentInfo);
            res.json(insertStudentInfo);
        })

        //DELETE API - Students Information
        app.delete('/students/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await studentsCollection.deleteOne(query);
            console.log("Deleting the food", result);
            res.json(result);
        })

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

        //DELETE API - Food Item
        app.delete('/foods/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await foodCollection.deleteOne(query);
            console.log("Deleting the food", result);
            res.json(result);
        })

        //UPDATE API - Food Item
        app.put('/foods/:id', async (req, res) => {
            const id = req.params.id;
            const updateName = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    name : updateName.name,
                    price : updateName.price
                },
            }
            const result = await foodCollection.updateOne(filter, updateDoc, options);
            console.log('Updated food item successfully', req);
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