const peopleRouter = require('express').Router()
const Person = require('../models/person')

/*SHOW ALL PEOPLE*/
peopleRouter.get('/persons', (request, response) => {
  Person.find({}).then(people => {
    response.json(people.map(person => person.toJSON()))
  })
})
/*API INFO PAGE*/

peopleRouter.get('/info', (req, res) => {
  Person.find({}).then(people => {
    res.send(`<p> API info: The phonebook has info for ${people.length} people</p><p> ${new Date()}</p>`)
  })
})
/*FIND PERSON BY ID*/
peopleRouter.get('/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person.toJSON())
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

/*CREATE PERSON*/
peopleRouter.post('/persons', (request, response, next) => {
  const body = request.body

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save()
    .then(savedPerson => {
      response.json(savedPerson.toJSON())
    })
    .catch(error => next(error))
})

/* DELETE PERSON*/
peopleRouter.delete('/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

/*UPDATE PERSON*/
peopleRouter.put('/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson.toJSON())
    })
    .catch(error => next(error))
})

module.exports = peopleRouter