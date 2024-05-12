const jwt = require('jsonwebtoken');

const authenticateUserMiddleware = async (req,res,next) => {
    const authHeader = req.headers.authorization

    if(!authHeader || !authHeader.startsWith('Bearer ')){
        throw new Error("unauthenticated")
    }
    const token = authHeader.split(' ')[1];
    try {
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