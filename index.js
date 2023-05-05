const express = require('express')
const app = express()

const morgan = require('morgan')
app.use(express.json())

app.use(express.static('build'))

morgan.token('content', function(req, res) {
    return JSON.stringify(req.body)
})

app.use(morgan(
    ':method :url :status :res[content-length] - :response-time ms :content' 
    ))

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    const contactNum = persons
        ? persons.length
        : 0
    const timeNow = Date().toString()
    response.end(`<div><p>Phonebook has info for ${contactNum} people</p><p>${timeNow}</p></div>`)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.filter(p => p.id === id)
    if (person.length === 0) {
        response.status(404).send()
    }
    response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(p => p.id !== id)
    response.status(204).end()
})

const generateID = () => {
    return Math.floor(Math.random()*10000)
}

const errorMessage = (content) => {
    return ({
        error:`${content}`
    })
}

app.post('/api/persons/', (request, response) => {
    const body = request.body
    const existingNames = persons.map(p => p.name) 
    if (!body.name) {
        return response.status(400).json(
            errorMessage("name missing"))
    }

    if (!body.number) {
        return response.status(400).json(
        errorMessage("number missing"))
    }
    if (existingNames.includes(body.name)){
        return response.status(400).json(
        errorMessage("name must be unique"))
    }

    const person = {
        name:body.name,
        number: body.number,
        id: generateID()
    }
    persons = persons.concat(person)

    response.json(persons)

})
const PORT= process.env.PORT || 3001

app.listen(PORT, () =>
    {console.log(`Listen in port number ${PORT}`)})
