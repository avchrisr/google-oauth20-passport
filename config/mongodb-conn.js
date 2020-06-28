const mongoose = require('mongoose')

if (process.env.NODE_ENV !== 'production') {
    mongoose.set('debug', true)
}

const connectDB = async () => {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
        poolSize: process.env.POOLSIZE || 10,    // mongoose default is 5
        // following options are used to suppress deprecation warnings
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    })

    mongoose.connection.on('close', () => {
        connection.removeAllListeners()
    })

    console.log(`MongoDB connected: ${conn.connection.host}`.cyan.underline.bold)
}

module.exports = connectDB
