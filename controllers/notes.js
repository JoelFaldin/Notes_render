const notesRouter = require('express').Router()
const Note = require('../models/note')

notesRouter.get('/', (req, res) => {
    Note.find({}).then(notes => {
        res.json(notes)
    })
})

notesRouter.get('/:id', (req, res, next) => {
    Note.findById(req.params.id)
        .then(note => {
            if (note) {
                res.json(note)
            } else {
                res.status(404).end()
            }
        })
        .catch(error => next(error))
})

notesRouter.post('/', (req, res, next) => {
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

notesRouter.delete('/:id', (req, res, next) => {
    Note.findByIdAndDelete(req.params.id)
        .then(() => {
            res.status(204).end()
        })
        .catch(error => next(error))
})

notesRouter.put('/:id', (req, res, next) => {
    const body = req.body

    const note = new Note({
        content: body.content,
        important: body.important
    })

    Note.findByIdAndUpdate(req.params.id, note, { new: true })
        .then(updated => {
            res.json(updated)
        })
        .catch(error => next(error))
})

module.exports = notesRouter