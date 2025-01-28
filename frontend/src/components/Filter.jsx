import React from 'react'

const Filter = ({showPerson, handleSearchChange}) => {
    return (
        <div>
            filter shown with: <input value={showPerson} onChange={handleSearchChange}/>
        </div>
    )
}

export default Filter