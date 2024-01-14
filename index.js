require('dotenv').config()
const app = require('./app')
const config = require('./utils/config')
const logger = require('./utils/logger')

app.listen(config.PORT, () => {
    logger.info(`Server running in ${config.PORT}`)
    logger.info(`http://localhost:${3001}`)
})