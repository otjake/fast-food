// src/config/db.js
const mongoose = require('mongoose');

const defaultURL = process.env.MONGODB_URI || 'mongodb://localhost:27017/myDatabase';
const connectDB = (dbURI) => {
    let stringUrl = dbURI || defaultURL;
    return mongoose.connect(stringUrl)
}

module.exports = connectDB;

