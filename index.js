const express = require('express')
var morgan = require('morgan')
const cors = require('cors')
const app = express()
app.use(express.static('build'))
app.use(cors())
app.use(express.json())
morgan.token('body', function (req, res) { return `body: ${JSON.stringify(req.body)}`})
app.use(morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms', 
      tokens.body(req,res)
    ].join(' ')
}))


let people = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456'
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523'
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345'
  },
  {
    id: 4,
    name: 'Mary Poppendick',
    number: '39-23-6423122'
  }

]

app.get('/', (req, res) => {
  res.send('<h1>Hello hello World!</h1>')
})

app.get('/api/persons', (req, res) => {
  res.json(people)
})

app.get('/api/info', (req, res) => {
  res.send(`<p> Phonebook has info for ${people.length} people</p><p> ${new Date()}</p>`)
} )

app.get('/api/persons/:id', (req,res) => {
  const person = people.filter(p => p.id === Number(req.params.id))
  if (person.length === 0){
    res.sendStatus(404)
  } else {
    res.json(person)
  }
})

app.delete('/api/persons/:id', (req,res)=> {
  people = people.filter(p => p.id !== Number(req.params.id))
  res.sendStatus(200)
})

app.post('/api/persons', (req, res) => {
  const newID = Math.round(Math.random() * (1000 - 10) + 10); //range (1000,10), first 10 ids reserved for manual insertion during testing
  
  const newName = req.body.name
  const newNumber = req.body.number
  const existingPerson = people.filter(p => p.name === newName)
  if (newName === undefined || newNumber === undefined) {
    res.status(400).send('All fields must be filled out!')
  } else if (existingPerson.length > 0 ){
    res.status(400).send('This person already exists!')
  } else {
    const newPerson = {id: newID, name: newName, number: newNumber}
    people.push(newPerson)
    res.json(newPerson)
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})