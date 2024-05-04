const express = require('express');
const app = express();

// Middleware
app.use(express.json());

// Define a simple route
app.get('/', (req, res) => {
    res.send('Hello, Express!');
});

module.exports = app;