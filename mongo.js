const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Give password as third argument!')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://antti:${password}@cluster0-nb9xg.mongodb.net/puhelinluettelo?retryWrites=true`

mongoose.connect(url, { useNewUrlParser: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
  console.log('puhelinluettelo:')
  Person
    .find({})
    .then(result => {
      result.forEach(person => {
        console.log(`${person.name} ${person.number}`)
    })
      mongoose.connection.close()
  })
} else if (process.argv.length === 5) {
  const name = process.argv[3]
  const number = process.argv[4]

  const person = new Person({
    name,
    number
  })

  person.save().then(response => {
    console.log(`lisätään ${response.name} numero ${response.number} luetteloon`)
    mongoose.connection.close()
  })
} else {
  console.log('Something went wrong. Try again.')
  mongoose.connection.close()
  process.exit(1)
}