const { body, validationResult } = require("express-validator");
const {CustomError} = require("../middleware/customErrorHandler");
const User = require('../models/User')

createUser = async (req, res, next) => {
    try {
        const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
            return;
        }

        const { username, email, password } = req.body
        let newUser = null;
        try {
            const user = await User.findOne({ email })
            if (user) {
                return res.status(400).json({ error: 'User already exists' })
            }
            // const user = await User.create({
            //     username,
            //     email,
            //     password,
            // })
            newUser = new User({ username, email, password })
            await newUser.save()
        } catch (err) {
            return CustomError("Unable to create user")
        }

        if(newUser) {
            res.json(newUser)
        }
    } catch(err) {
        return next(err)
    }
}

const login = async (req, res, next) => {
    const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

    if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
        return;
    }
    const { username, email, password } = req.body
    let user = null;
    // user = await User.findOne({ $or: [{ email }, { username }] }).populate('role');
    if(username){
        user = await User.findOne({username: username}).populate('roles');
    }

    if(email && !user){
        user = await User.findOne({email: email}).populate('roles');
    }

    if(!user) {
        return res.status(400).json({ error: 'User does not exist' })
    }

    //compare Password
    const doesPasswordMatch = await user.comparePassword(password)
    if(!doesPasswordMatch) {
        return res.status(400).json({ error: 'Invalid Credentials' })
    }

    //make jwt
    const token = user.createJWT()
    return res.status(200).json({
        user,
        token
    })
}

validate = (method) => {
    switch (method) {
        case 'createUser': {
            return [
                body('username', "username doesn't exists").exists(),
                body('email', 'Invalid email').exists().isEmail(),
                body('password', 'password does not Empty').not().isEmpty(),
                body('password', 'The minimum password length is 6 characters').isLength({min: 6}),
            ]
        }
        case 'userLogin': {
            return [
                body('email').custom((value, { req }) => {
                    if (!value && !req.body.username) {
                        throw new Error("Either username or email must be present");
                    }
                    return true;
                }),
                body('username').custom((value, { req }) => {
                    if (!value && !req.body.email) {
                        throw new Error("Either username or email must be present");
                    }
                    return true;
                }),
                body('password', 'password can not Empty').not().isEmpty(),
            ]
        }
    }
}

module.exports = {
    validate,
    createUser,
    login
};
