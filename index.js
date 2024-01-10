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
app.use(express.json())
app.use(requestLogger)
app.use(express.static('dist'))

app.get('/api/notes', (req, res) => {
    Note.find({}).then(note => {
        res.json(note)
    })
})

app.post('/api/notes', (req, res, next) => {
    const body = req.body

    const note = new Note({
        content: body.content,
        important: body.important || false
    })

    note.save()
        .then(saved => {
            res.json(saved)
        })
        .catch(error => next(error))
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

app.put('/api/notes', (req, res, next) => {
    const { content, important } = req.body
    
    Note.findByIdAndUpdate(req.params.id, {content, important}, { new: true, runValidators: true, context: 'query' })
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
     else if (error.name === 'ValidationError') {
        return res.status(400).json({error: error.message})
    }
    next(error)
}

app.use(errorHandler)

const port = process.env.PORT
app.listen(port, () => {
    console.log(`Server running in ${port}`)
})