const { logger } = require('morgan'); // Assuming you have a logger module

function handleErrors(err, req, res, next) {
    // Log the error
    // logger.error(err);

    // Handle ValidationError
    if (err.name === 'ValidationError') {
        const errorMessages = Object.values(err.errors).map(error => ({
            field: error.path,
            message: error.message
        }));
        return res.status(400).json({ errors: errorMessages });
    }

    // Handle other types of errors
    if (err instanceof CustomError) {
        return res.status(err.statusCode || 500).json({ error: err.message });
    }

    // Handle other generic errors
    return res.status(500).json({ error: 'Internal Server Error' });
}

// Custom Error class for custom errors
class CustomError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode || 500;
    }
}

module.exports = { handleErrors, CustomError };