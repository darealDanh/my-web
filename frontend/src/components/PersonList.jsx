import React from 'react'

const PersonList = ({persons,deleteHandle}) => {
    if (!Array.isArray(persons)) {
        alert("there is no one")
        return null; // or handle the error appropriately
      }
    return (
        <ul>
            {persons.map(person => 
                <li key={person.id}>{person.name} {person.number} <button onClick={() => deleteHandle(person.id)}>Delete</button></li>
            )}
        </ul>
    )
}

export default PersonList