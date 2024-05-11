const mongoose = require('mongoose')
const RoleModel = new mongoose.Schema({
    name:{
        required:[true,"Role has to have a name"],
        unique:[true,'name already exists'],
        type: String,
        minLength:3
    },
    description:{
        required:[true,"Role has to have a description"],
        type: String
    },
    permissions: {
        type: [String],
        required: false
    }
});

module.exports = mongoose.model('Role',RoleModel)