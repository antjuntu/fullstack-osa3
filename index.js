const express = require('express')
const app = express()

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

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/info', (req, res) => {
  res.send(`<div><p>puhelinluettelossa ${persons.length} henkilön tiedot<p><p>${new Date().toString()}</p></div>`)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})