'use strict'
import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'

const Form = ({currentOrg, close, reload}) => {
  const [id, setId] = useState(0)
  const [name, setName] = useState(currentOrg.name)
  const closeForm = () => {
    setName('')
    reload()
    close()
  }

  useEffect(() => {
    setId(currentOrg.id)
    setName(currentOrg.name)
  }, [currentOrg])

  const save = () => {
    let url = './triptrack/Admin/Organization'
    if (id > 0) {
      const add = new URLSearchParams()
      url += '/' + id
    }

    axios({
      method: id > 0 ? 'put' : 'post',
      url,
      data: {id, name},
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

  const checkForEnter = (keyPress) => {
    if (keyPress.keyCode === 13 && name.length > 0) {
      save()
    }
  }

  return (
    <div>
      <div className="mb-3">
        <label>Name of organization</label>
        <input
          className="form-control"
          value={name}
          onKeyDown={(e) => checkForEnter(e)}
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
  reload: PropTypes.func,
}

export default Form
