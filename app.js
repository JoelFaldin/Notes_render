const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const notesRouter = require('./controllers/notes')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

// DB connection:
mongoose.set('strictQuery', false)

logger.info(`Connecting to: ${config.MONGO_URL}`)

mongoose.connect(config.MONGO_URL)
    .then(() => {
        logger.info('Connected to mongoDB! 🌱')
    })
    .catch(error => {
        logger.error('Error connecting to the DB: ', error.message)
    })

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/notes', notesRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app