const express = require('express')
var morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()
const { response } = require('express')
const Person = require('./models/person')

const app = express()
app.use(express.static('build'))
app.use(express.json())
//app.use(logger) what logger? 
app.use(cors())
morgan.token('body', function (req, res) { return `body: ${JSON.stringify(req.body)}` })
app.use(morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    tokens.body(req, res)
  ].join(' ')
}))

app.get('/', (req, res) => {
  res.send('<h1>Hello hello World!</h1>')
})

app.get('/api/persons', (req, res) => {
  Person.find({}).then(people => {
    res.json(people)
  })
})

app.get('/api/info', (req, res) => {
  Person.find({}).then(people => {
    res.send(`<p> Phonebook has info for ${people.length} people</p><p> ${new Date()}</p>`)
  })
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => { res.json(person) })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, response, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(res => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (req, response, next) => {
  const body = req.body
  const person = new Person({
    name: body.name,
    number: body.number
  })
  person.save()
  .then(savedPerson => response.json(savedPerson))
  .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body
  if (body.name === undefined || body.number === undefined){
    response.status(400).json({error: "Fill out all of the fields!"}).end()
  } else {
    const updatePerson = {
      name: body.name, 
      number: body.number
    }
    console.log(request.params.id)
    Person.findByIdAndUpdate(request.params.id, updatePerson, {new:true})
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
  }
})

/**ERROR HANDLING */
const errorHandler = (error, request, response, next) => {
  console.log("here")
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})