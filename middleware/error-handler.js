const errorHandler = (err, req, res, next) => {
    // log to console for dev
    // console.log(err.stack.brightRed)
    console.log(err)

    let message = err.message || 'Server Error'
    let statusCode = err.statusCode || 500

    // Mongoose invalid ObjectId
    if (err.name === 'CastError') {
        message = `Resource not found`
        statusCode = 404
    }

    // Mongoose duplicate (non-unique) key error
    if (err.code === 11000) {
        message = `Duplicate field value received: ${Object.keys(err.keyValue)}`
        statusCode = 400
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        message = Object.values(err.errors).map(val => val.message)
        statusCode = 400
    }

    if (statusCode === 500) {
        // hide internal server errors from client
        message = 'Server Error occurred. Refer to server logs.'
    }

    res.status(statusCode).json({
        success: false,
        error: message
    })
}

module.exports = errorHandler
