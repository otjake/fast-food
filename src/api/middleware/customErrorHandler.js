const { logger } = require('morgan'); // Assuming you have a logger module

function handleErrors(err, req, res, next) {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";
    if (process.env.NODE_ENV === "development") {
        if (err.name === "CastError") err = castErrorHandler(err);
        //Db duplicate error
        if (err.code === 11000) err = duplicateErrorHandler(err) ;
        if (err.name === "ValidationError") err = validationErrorHandler (err);
        devError(err, res);
    } else if (process.env.NODE_ENV === "production") {
        prodError(err, res);
    }
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
const createErrorInstance = (msg) => {
    const error = new Error();
    error.message = msg;
    return error;
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

module.exports = { AppError, handleErrors, CustomError, createErrorInstance };