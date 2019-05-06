const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

let persons =  [
  {
    id: 1,
    name: "Arto Hellas",
    number: "0912347822"
  },
  {
    id: 2,
    name: "Martti Tienari",
    number: "045-123455"
  },
  {
    id: 3,
    name: "Arto Järvinen",
    number: "040-123456"
  },
  {
    id: 4,
    name: "Lea Kutvonen",
    number: "040-123456"
  }
]

app.use(cors())

app.use(bodyParser.json())

morgan.token('body', (req, res) => {
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/api/persons', (req, res) => {
  res.json(persons)
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

app.delete('/api/persons/:id', (req, res) => {
  const id = parseInt(req.params.id)
  persons = persons.filter(person => person.id !== id)

  res.status(204).end()
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

  const duplicate = persons.find(person => person.name === name)
  if (duplicate) {
    return res.status(400).json({
      error: 'name must be unique'
    })
  }

  const person = {
    id: Math.floor(Math.random() * 10000000) + 1,
    name,
    number
  }

  persons = persons.concat(person)
  res.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})