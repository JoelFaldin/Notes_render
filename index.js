require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const Note = require('./models/note')

const requestLogger = (request, response, next) => {
    console.log('Method: ', request.method)
    console.log('Path: ', request.path)
    console.log('Body: ', request.body)
    next()
}

const unknownEndpoint = (req, res) => {
    res.status(404).send({
        error: 'unknown endpoint :('
    })
}

app.use(express.json())
app.use(requestLogger)
app.use(cors())
app.use(express.static('dist'))

// DB connection:
const mongoose = require('mongoose')
const password = process.argv[2]

mongoose.set('strictQuery',false)

app.get('/', (req, res) => {
    res.send('<h1>Hello world!</h1>')
})

app.get('/api/notes', (req, res) => {
    Note.find({}).then(note => {
        res.json(note)
    })
})

app.get('/api/notes/:id', (req, res) => {
    const id = Number(req.params.id)
    const note = notes.find(note => note.id === id)
    
    if (note) {
        res.json(note)
    } else {
        res.status(404).end()
    }
  })

app.delete('/api/notes/:id', (req, res) => {
    const id = Number(req.params.id)
    notes = notes.filter(note => note.id !== id)

    res.status(204).end()
})

const generateId = () => {
    const maxId = notes.length > 0
    ? Math.max(...notes.map(n => n.id))
    : 0
    return maxId + 1
}

app.post('/api/notes', (req, res) => {
    const body = req.body
    
    if (!body.content) {
        return res.status(400).json({
            error: 'content missing!'
        })
    }

    const note = {
        content: body.content,
        important: Boolean(body.important) || false,
        id: generateId()
    }

    notes = notes.concat(note)
    
    res.json(note)
})

app.use(unknownEndpoint)

const port = process.env.PORT
app.listen(port, () => {
    console.log(`Server running in ${port}`)
})