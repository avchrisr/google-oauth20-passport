const path = require('path')
const express = require('express')
const exphbs = require('express-handlebars')
const dotenv = require('dotenv')
const morgan = require('morgan')
const colors = require('colors')
const cookieParser = require('cookie-parser')
const mongoSanitize = require('express-mongo-sanitize')
const helmet = require('helmet')
const xssClean = require('xss-clean')
const rateLimit = require('express-rate-limit')
const hpp = require('hpp')
const cors = require('cors')

const mongoose = require('mongoose')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)

const mongoDbConnect = require('./config/mongodb-conn')
const errorHandler = require('./middleware/error-handler.js')

// load env variables
dotenv.config({ path: './config/variables.env' })

const NODE_ENV = process.env.NODE_ENV || 'development'

// Passport config
require('./config/passport')(passport)

// connect to mongodb database
mongoDbConnect()

// route files
// does not need to be within try/catch block for errors to get caught properly.
const index = require('./routes/index')
const auth = require('./routes/auth')

// const cameras = require('./routes/cameras')
// const coachingReports = require('./routes/coaching-reports')
// const edgeServers = require('./routes/edge-servers')
// const users = require('./routes/users')

// const bootcamps = require('./routes/bootcamps')
// const courses = require('./routes/courses')

const app = express()

// Dev logging middleware
if (NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

// Body Parser
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// Cookie Parser
app.use(cookieParser())

// File upload middleware
// app.use(fileUpload())

// Mongo Sanitize middleware
app.use(mongoSanitize())

// set security HTTP headers
app.use(helmet())

// sanitize input. Prevent XSS attacks (e.g. SQL injection)
app.use(xssClean())

// rate limiter
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000,   // 10 min
    max: 100,                   // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP. Please try again after 10 min'    // optional
})
app.use(limiter)               // apply to all requests

// prevent http parameter polution
app.use(hpp())

// enable CORS. this app is a public API, and we want any client browsers to send requests to this app
app.use(cors())


// ------------  oauth passport related code  ------------

const sessionOptions = {
    secret: 'my secret cat',        // enables encryption. Recommended (especially when working with sensitive session data)
    resave: false,                  // don't save session if not modified
    saveUninitialized: false,       // don't create session until something stored

    // automatically store express session in MongoDB
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}

if (NODE_ENV === 'production') {
    // If you have your node.js behind a proxy and are using { secure: true }, you need to set "trust proxy" in express
    app.set('trust proxy', 1)    // trust first proxy.
    sessionOptions.cookie = { secure: true }      // use https. if accessed via http, the cookie will not be set
}

// Sessions
app.use(session(sessionOptions))

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

// Handlebars -- server-rendered view templating enigne
app.engine('.hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', '.hbs')

// -------------------------------------------------------


// set static files folder (/public)
// e.g.) localhost:5000/about.html
app.use(express.static(path.join(__dirname, 'public')))

try {
    // Mount Routers
    app.use('/', index)
    app.use('/auth', auth)

    // app.use('/api/v1/cameras', cameras)
    // app.use('/api/v1/coaching-reports', coachingReports)
    // app.use('/api/v1/edge-servers', edgeServers)

    // app.use('/api/v1/bootcamps', bootcamps);
    // app.use('/api/v1/courses', courses);

    app.use('/health', (req, res) => {
        res.status(200).json({
            success: true,
            data: `healthcheck successful at ${new Date(Date.now()).toUTCString()}`
        })
    })

    // error-handler middleware MUST be placed after Mounting Routers in order to take effect
    app.use(errorHandler)

    // no matching endpoint URL fallback error
    app.use((req, res) => {
        res.redirect('/')

        // res.status(404).json({
        //     success: false,
        //     error: `Unsupported API endpoint: ${req.method} ${req.url}`
        // })
    })
} catch (err) {
    // global fallback error handler
    console.error(err)
    res.status(err.statusCode || 500).json({
        success: false,
        error: err
    })
}

const PORT = process.env.PORT || 5000
const server = app.listen(PORT, () => console.log(`server started in ${NODE_ENV} mode on port ${PORT}`.cyan.bold))

// Handle unhandled promise rejections. No need to use try/catch in many async/awaits!
process.on('unhandledRejection', (err, promise) => {
    console.log(`Server unhandledRejection Event Error: ${err.message}`.red)

    // close server connection & exit process if you want
    // server.close(() => process.exit(1))
})
