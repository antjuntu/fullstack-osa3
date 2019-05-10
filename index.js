require('dotenv').config()

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

const Person = require('./models/person')

app.use(cors())

app.use(express.static('build'))

app.use(bodyParser.json())

morgan.token('body', (req, res) => {
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


app.get('/api/persons', (req, res) => {
  Person
    .find({})
    .then(persons => {
      res.json(persons.map(person => person.toJSON()))
    })
})

app.get('/info', (req, res) => {
  res.send(`<div><p>puhelinluettelossa ${persons.length} henkilön tiedot<p><p>${new Date().toString()}</p></div>`)
})

app.get('/api/persons/:id', (req, res) => {
  //console.log(req.params.id)
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)

  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person
    .findByIdAndRemove(req.params.id)
    .then(result => {
      //console.log(result)
      res.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (req, res) => {
  //console.log(req.headers)
  //console.log(req.body)
  const name = req.body.name
  const number = req.body.number

  if (!name || !number) {
    return res.status(400).json({
      error: 'name or number missing'
    })
  }

  // const duplicate = persons.find(person => person.name === name)
  // if (duplicate) {
  //   return res.status(400).json({
  //     error: 'name must be unique'
  //   })
  // }

  const person = new Person({
    name,
    number
  })

  person
    .save()
    .then(savedPerson => {
      res.json(savedPerson.toJSON())
    })
})

app.put('/api/persons/:id', (req, res, next) => {
  const name = req.body.name
  const number = req.body.number

  const person = {
    name,
    number
  }

  Person
    .findByIdAndUpdate(req.params.id, person, { new: true })
    .then(updatedPerson => {
      res.json(updatedPerson.toJSON())
    })
    .catch(error => next(error))
})

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
  console.log(error.message)
  
  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return res.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})