require('dotenv').config()
const express = require('express')
const cors = require('cors')


const app = express()
// const morgan = require('morgan')
const Person = require('./models/person')

app.use(express.json())
app.use(cors())
app.use(express.static('build'))

// morgan.token('content', function(req, res) {
//     return JSON.stringify(req.body)
// })

// app.use(morgan(
//     ':method :url :status :res[content-length] - :response-time ms :content' 
//     ))

// const unknownEndpoint = (request, response) => {
//     response.status(404).send({error: 'unknown endpoint'})
// }
// app.use(unknownEndpoint)

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
    
})

app.get('/info', (request, response) => {
    Person.find({}).then(persons => {
        const timeNow = Date().toString()
        response.end(`<div><p>Phonebook has info for ${persons.length} people</p><p>${timeNow}</p></div>`)
    })
    
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id).then(person => {
        if (person) {
            response.json(person)
        } else {
            response.status(404).end()
        }
    })
    .catch(error => next(error))
})



app.delete('/api/persons/:id', (request, response) => {
    console.log(request.params.id)
    Person.findByIdAndRemove(request.params.id)
    .then(result => {
        response.status(204).end()
    })
    .catch(error => next(error))
})

// const generateID = () => {
//     return Math.floor(Math.random()*10000)
// }

app.put('/api/persons/:id', (request, response, next) => {
    const {name, number} = request.body

    Person.findByIdAndUpdate(request.params.id, {name, number}, 
        {new: true, runValidators: true, context: 'query'})
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


app.post('/api/persons/', (request, response, next) => {
    const body = request.body
    
    if (body.name == undefined) {
        return response.status(400).json(
            errorMessage("content missing"))
    }

    if (!body.number == undefined) {
        return response.status(400).json(
        errorMessage("number missing"))
    }


    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person.save().then(savedContact => {
        response.json(savedContact)
    }).catch(error => next(error))
    

    // if (existingNames.includes(body.name)){
    //     return response.status(400).json(
    //     errorMessage("name must be unique"))
    // }

})

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({error: 'malformatted id'})
    }
    else if (error.name === 'ValidationError') {
        return response.status(400).json({error: error.message})
    }
    next(error)
}
app.use(errorHandler)

const PORT= process.env.PORT

app.listen(PORT, () =>
    {console.log(`Listen in port number ${PORT}`)})
