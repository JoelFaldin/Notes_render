require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const Note = require('./models/note')

// DB connection:
const mongoose = require('mongoose')
mongoose.set('strictQuery',false)

const requestLogger = (request, response, next) => {
    console.log('Method: ', request.method)
    console.log('Path: ', request.path)
    console.log('Body: ', request.body)
    next()
}

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(requestLogger)

app.get('/api/notes', (req, res) => {
    Note.find({}).then(note => {
        res.json(note)
    })
})

app.get('/api/notes/:id', (req, res, next) => {
    Note.findById(req.params.id).then(note => {
        if (note) {
            res.json(note)
        } else {
            console.log('no note found')
            res.status(404).end()
        }
    })
    .catch(error => { next(error) })
  })

app.delete('/api/notes/:id', (req, res, next) => {
    Note.findByIdAndDelete(request.params.id)
        .then(result => {
            res.status(204).end()
        })
        .catch(error => next(error))
})

app.post('/api/notes', (req, res, next) => {
    const body = req.body
    
    if (!body.content) {
        return res.status(400).json({ error: 'content missing!' })
    }

    const note = new Note({
        content: body.content,
        important: body.important || false
    })
    
    Note.findByIdAndUpdate(req.params.id, note, { new: true })
        .then(updatedNote => {
            res.json(updatedNote)
        })
        .catch(error => { next(error) })
})

const unknownEndpoint = (req, res) => {
    res.status(404).send({
        error: 'unknown endpoint :('
    })
}

app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
    console.error(error)
    if (error.name === 'CastError') {
        return res.status(400).send({ error: 'Malformatted id!' })
    }
    next(error)
}

app.use(errorHandler)

const port = process.env.PORT
app.listen(port, () => {
    console.log(`Server running in ${port}`)
})