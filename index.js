const express = require('express')
const app = express()
require('dotenv').config()

const Person = require('./models/person')

persons = []

app.use(express.static('dist'))

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

const cors = require('cors')

app.use(cors())

app.use(express.json())
app.use(requestLogger)

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(person => {
    response.json(person)
  })
})

app.post('/api/persons', (request, response) => {
  const body = request.body
  console.log(body)
  console.log(body.name)
  console.log(body.number)
  if (body === undefined) {
    console.log('content missing')
    return response.status(400).json({ error: 'content missing' })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedNote => {
    response.json(savedNote)
  })
  .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,  
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })
  .catch(error=> next(error))
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  Person.findByIdAndDelete(id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))

  response.status(204).end()
})


const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
      return response.status(400).json({ error: error.message })
    }
    next(error)
}

app.use(errorHandler)


app.use(unknownEndpoint)

const PORT = 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})