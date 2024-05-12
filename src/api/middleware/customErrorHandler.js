const { logger } = require('morgan'); // Assuming you have a logger module

function handleErrors(err, req, res, next) {

    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";
    // if (err.name === 'ValidationError') {
    //     const errorMessages = Object.values(err.errors).map(error => ({
    //         field: error.path,
    //         message: error.message
    //     }));
    //     return res.status(400).json({ errors: errorMessages });
    // }
    // if (err instanceof CustomError) {
    //     return res.status(err.statusCode || 500).json({ error: err.message });
    // }
    if (process.env.NODE_ENV === "development") {
        if (err.name === "CastError") err = castErrorHandler(err);
        if (err.code === 11000) err = duplicateErrorHandler(err) ;
        if (err.name === "ValidationError") err = validationErrorHandler (err);
        devError(err, res);
    } else if (process.env.NODE_ENV === "production") {
        prodError(err, res);
    }
    // Log the error
    // logger.error(err);

    // // Handle ValidationError
    // if (err.name === 'ValidationError') {
    //     const errorMessages = Object.values(err.errors).map(error => ({
    //         field: error.path,
    //         message: error.message
    //     }));
    //     return res.status(400).json({ errors: errorMessages });
    // }
    //
    // // Handle MongoDB errors
    // console.log("errror",err.name, err.message, err)
    // if (err.name === 'MongoError') {
    //     return res.status(500).json({ error: 'Database Error', details: err.message });
    // }
    //
    // // Handle other types of errors
    // if (err instanceof CustomError) {
    //     return res.status(err.statusCode || 500).json({ error: err.message });
    // }
    //
    // // Handle other generic errors
    // return res.status(500).json({ error: 'Internal Server Error' });
}

// Custom Error class for custom errors
class CustomError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode || 500;
    }
}

const devError = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
    });
};

const prodError = (err, res) => {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    } else {
        res.status(500).json({
            status: "error",
            message: "something went very wrong!",
        });
    }
};

// Cast Error Handler
const castErrorHandler = (err) => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new AppError(message, 400);
};

const duplicateErrorHandler = (err) => {
    const value = err.message.match(/(["'])(\\?.)*?\1/)[0];
    const message = `field value:${value} aleady exist. please use another`;
    return new AppError (message, 400);
};

const validationErrorHandler = (err) => {
    const errors = Object.values(err.errors).map((el) => el.message);
    const message = `Invalid input data. ${errors.join(". ")}`;
    return new AppError (message, 400);
};
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = { AppError, handleErrors, CustomError };