'use strict'
import React, {useState} from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'

const Form = ({currentOrg, close}) => {
  const [name, setName] = useState(currentOrg.name)

  const closeForm = () => {
    setName('')
    close()
  }

  const save = () => {
    const formData = new FormData()
    formData.append('id', currentOrg.id)
    formData.append('name', name)

    axios
      .post('./triptrack/Admin/Organization', formData, {
        timeout: 3000,
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
        },
      })
      .then((response) => {
        closeForm()
      })
      .catch((error) => {
        console.log('Error:', error)
      })
  }

  return (
    <div>
      <div className="mb-3">
        <label>Name of organization</label>
        <input
          className="form-control"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <button
          className="btn btn-primary mr-2"
          onClick={() => {
            save()
            closeForm()
          }}
          disabled={name.length === 0}>
          Save
        </button>
        <button className="btn btn-danger" onClick={closeForm}>
          Cancel
        </button>
      </div>
    </div>
  )
}

Form.propTypes = {
  currentOrg: PropTypes.object,
  close: PropTypes.func,
}

export default Form
