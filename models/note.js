const mongoose = require('mongoose')
    
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