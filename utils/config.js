require('dotenv').config()

const PORT = process.env.PORT
const MONGO_URL = process.env.MONGODB_URI

module.exports = { MONGO_URL, PORT }