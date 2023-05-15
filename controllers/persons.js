const personsRouter = require('express').Router()
const Person = require('../models/person')


personsRouter.get('/', (request, response) => {
    Person.find({}).then(persons => {
      response.json(persons)
    })
  
  })
  
personsRouter.get('/info', (request, response) => {
    Person.find({}).then(persons => {
      const timeNow = Date().toString()
      response.end(`<div><p>Phonebook has info for ${persons.length} people</p><p>${timeNow}</p></div>`)
    })
  
  })
  
personsRouter.get('/:id', (request, response, next) => {
    Person.findById(request.params.id).then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
      .catch(error => next(error))
  })
  
personsRouter.delete('/:id', (request, response, next) => {
    console.log(request.params.id)
    Person.findByIdAndRemove(request.params.id)
      .then(() => {
        response.status(204).end()
      })
      .catch(error => next(error))
  })

personsRouter.put('/:id', (request, response, next) => {
    const { name, number } = request.body
  
    Person.findByIdAndUpdate(request.params.id, { name, number },
      { new: true, runValidators: true, context: 'query' })
      .then(updatedPerson => {
        response.json(updatedPerson)
      })
      .catch(error => next(error))
  })
  
  const errorMessage = (content) => {
    return ({
      error:`${content}`
    })
  }
  
  
personsRouter.post('/', (request, response, next) => {
    const body = request.body
  
    if (body.name === undefined) {
      return response.status(400).json(
        errorMessage('content missing'))
    }
  
    if (!body.number === undefined) {
      return response.status(400).json(
        errorMessage('number missing'))
    }
  
  
    const person = new Person({
      name: body.name,
      number: body.number,
    })
  
    person.save().then(savedContact => {
      response.json(savedContact)
    }).catch(error => next(error))
  

  })

module.exports = personsRouter