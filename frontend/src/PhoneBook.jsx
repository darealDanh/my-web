import { useState, useEffect } from 'react'
import PersonForm from './components/PersonForm'
import PersonList from './components/PersonList'
import Filter from './components/Filter'
import PBService from './services/PBService'

const PhoneB = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNum, setNewNum] = useState('')
  const [showPerson, setShowPerson] = useState('')


  useEffect(() => {
    PBService.getAll().then(initialPersons => {
      setPersons(initialPersons)
    }).catch(error => {
      console.log("error")
    })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNum
    }

    const existingPerson = persons.find(person => person.name === newName)
    if (existingPerson) {
      if (existingPerson.number) {
        if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
          console.log('update', existingPerson.id)
          console.log(existingPerson)
          const changedPerson = { ...existingPerson, number: newNum }
          PBService
            .update(existingPerson.id, changedPerson)
            .then(returnedPerson => {
              setPersons(persons.map(person => person.id !== existingPerson.id ? person : returnedPerson))
            })
          }
      } else {
        const changedPerson = { ...existingPerson, number: newNum }
        PBService
          .update(existingPerson.id, changedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id !== existingPerson.id ? person : returnedPerson))
          })
        }
      } else {
    PBService.create(personObject).then(returnedPerson => {
      setPersons(persons.concat(returnedPerson))
    })}
    setNewName('')
    setNewNum('')

  }

  

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  const handleNumChange = (event) => {
    setNewNum(event.target.value)
  }
  const handleSearchChange = (event) => {
    setShowPerson(event.target.value)
  }


  const deletePerson = (id) => {
    const person = persons.find(person => person.id === id)
    console.log(person)
    if (window.confirm(`Delete ${person.name} ?`)) {
      console.log('delete', id)
      PBService.Delete(id).then(() => {
        console.log('deleted')
        setPersons(persons.filter(person => person.id !== id))
      })
    }
  }


  const Filtered = showPerson
    ? persons.filter(person => person.name.toLowerCase().includes(showPerson.toLowerCase()))
    : persons


  return (
    <div>
      <h2>Phonebook</h2>
      <Filter showPerson={showPerson} handleSearchChange={handleSearchChange} />
      <h2>Add a new person</h2>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNum={newNum}
        handleNumChange={handleNumChange}
      />
      <h2>Numbers</h2>
      <PersonList persons={Filtered} deleteHandle={deletePerson}/>
    </div>
  )
}

export default PhoneB