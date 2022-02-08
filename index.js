const express = require('express');
const port = 5500;

const app = express();
app.get('/', (req, res) => {
    res.send("Welcome to Yoda Hostel backend")
})

// Listening the port
app.listen(port, () => {
    console.log("Running server on port", port);
})