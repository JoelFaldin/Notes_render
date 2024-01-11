const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('Connecting to: ', url)

mongoose.connect(url)
    .then(() => {
        console.log('Succesfully connected to MongoDB!')
    })
    .catch(error => {
        console.log('Error connecting to the db: ', error.message)
    })
    
const schema = new mongoose.Schema({
    content: {
        type: String,
        minlength: 5,
        required: true
    },
    important: Boolean
})

schema.set('toJSON', {
    transform: (document, returnedObj) => {
        returnedObj.id = returnedObj._id.toString()
        delete returnedObj._id
        delete returnedObj.__v
    }
})

module.exports = mongoose.model('Note', schema)