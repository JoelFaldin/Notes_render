const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument please!')
    process.exit(1)
}

// const password = process.argv[2]
const url = 'db_name'

mongoose.set('strictQuery', false)
mongoose.connect(url)

const noteSchema = new mongoose.Schema({
    content: String,
    important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

// const note1 = new Note({
//     content: 'Postman is pog',
//     important: false,
// })

// note1.save().then(result => {
//     console.log('note saved!!!')
//     console.log(result)
//     mongoose.connection.close()
// })

Note.find({}).then(result => {
    result.forEach(note => {
        console.log(note)
    })
    mongoose.connection.close()
})