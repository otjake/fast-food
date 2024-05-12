const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: true,
        minlength: 3
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        minlength: 3
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: 6
    },
    roles: {
        type: [String],
        required: [true, "Role is required"],
    }
})

UserSchema.pre('save', async function(next){
    const salt = await bcrypt.genSalt(10);//generates random string used to enhance the security of the password
    this.password = await bcrypt.hash(this.password,salt)
    next()
})

UserSchema.methods.createJWT = function (){
    return jwt.sign({userId:this._id,username:this.username,email:this.email}, process.env.JWT_SECRET, {
        expiresIn : process.env.JWT_LIFETIME
    })
}

UserSchema.methods.comparePassword = async function (enteredPassword){
    //compare user db password with enterd password
    return await bcrypt.compare(enteredPassword, this.password);

}

module.exports = mongoose.model('User', UserSchema);