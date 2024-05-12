const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema ({
    name:{
        required:[true,"Category has to have a name"],
        unique:[true,'Category already exists'],
        type: String,
        minLength:3
    }
});

module.exports = mongoose.model('Category', CategorySchema);