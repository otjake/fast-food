// src/config/db.js
const mongoose = require('mongoose');

const dbURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/myDatabase';
const connectDB = () => {
    return mongoose.connect(dbURI,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
}

module.exports = connectDB;

