const jwt = require('jsonwebtoken');
const {createErrorInstance} = require("./customErrorHandler");

const authenticateUserMiddleware = async (req,res,next) => {

    try {
        const authHeader = req.headers.authorization
        if (!authHeader || !authHeader.startsWith('Bearer ') ){
            const error = createErrorInstance("unauthenticated")
            return next(error)
        }
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const {userId, email, username} = decoded
        //put the decoded data into the request
        req.user = {userId, email, username}
        next();
    } catch (error){
        error.message = "unauthenticated"
        next(error)
    }
}

module.exports = authenticateUserMiddleware