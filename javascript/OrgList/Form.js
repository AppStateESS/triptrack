'use strict'
import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import {searchEngageOrganizations} from '../api/Engage'

const Form = ({currentOrg, close, reload}) => {
  const [id, setId] = useState(0)
  const [name, setName] = useState(currentOrg.name)
  const [matchingOrgs, setMatchingOrgs] = useState([])
  const closeForm = () => {
    setName('')
    reload()
    close()
  }

  useEffect(() => {
    setId(currentOrg.id)
    setName(currentOrg.name)
  }, [currentOrg])

  useEffect(() => {
    if (name.length > 3) {
      searchEngageOrganizations(name).then((response) => {
        console.log(response.data)
      })
    }
  }, [name])

  const save = () => {
    let url = './triptrack/Admin/Organization'
    if (id > 0) {
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
    }).then(() => {
      closeForm()
    })
  }

  const checkForEnter = (keyPress) => {
    if (keyPress.keyCode === 13 && name.length > 0) {
      save()
    }
  }

  const getMatchingOrgs = () => {
    if (matchingOrgs.length === 0) {
      return (
        <span>
          <em>
            Engage organizations will be recommended based on the name above.
          </em>
        </span>
      )
    }
  }

  return (
    <div>
      <div className="mb-3">
        <label>
          <strong>Name of organization</strong>
        </label>
        <input
          className="form-control"
          value={name}
          onKeyDown={(e) => checkForEnter(e)}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <div>
          <strong>Matching Engage organizations</strong>
        </div>
        <div className="border p-3 border-curved">{getMatchingOrgs()}</div>
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
