'use strict'
import React, {useState, useEffect, useRef} from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import {postOrganization, searchEngageOrganizations} from '../api/Engage'

const Form = ({currentOrg, close, reload, forceEngageOrg}) => {
  const [id, setId] = useState(0)
  const [searching, setSearching] = useState(false)
  const [name, setName] = useState(currentOrg.name)
  const [matchingOrgs, setMatchingOrgs] = useState([])

  const searchTimeout = useRef()

  useEffect(() => {
    setId(currentOrg.id)
    setName(currentOrg.name)
  }, [currentOrg])

  useEffect(() => {
    if (name.length > 3) {
      searchTimeout.current = setTimeout(() => {
        setSearching(true)
        searchEngageOrganizations(name).then((response) => {
          setMatchingOrgs(response.data)
          setSearching(false)
        })
      }, 1000)
    } else if (name.length === 0) {
      setMatchingOrgs([])
    }
    return () => {
      clearTimeout(searchTimeout.current)
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
      close()
      reload()
    })
  }

  const addEngageOrganization = (key) => {
    const engageOrg = matchingOrgs[key]
    const newOrg = {name: engageOrg.name, engageId: engageOrg.engageId}
    postOrganization(newOrg).then(() => {
      close()
      reload()
    })
  }

  const checkForEnter = (keyPress) => {
    if (keyPress.keyCode === 13 && name.length > 0) {
      save()
    }
  }

  const getMatchingOrgs = () => {
    if (searching) {
      return <span>Searching</span>
    } else if (matchingOrgs.length === 0) {
      return (
        <span>
          <em>
            Engage organizations will be recommended based on the name above.
          </em>
        </span>
      )
    } else {
      return (
        <ul className="list-unstyled">
          {matchingOrgs.map((value, key) => {
            return (
              <li
                key={`engageorg-${value.engageId}`}
                title="Add Engage organization"
                className="pointer"
                onClick={() => addEngageOrganization(key)}>
                <span className="badge badge-success">+</span>&nbsp;{value.name}
              </li>
            )
          })}
        </ul>
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
          placeholder={forceEngageOrg ? 'Search for an organzation...' : null}
          onKeyDown={(e) => checkForEnter(e)}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <div>
          <strong>Matching Engage organizations</strong>
        </div>
        <div
          className="border p-3 border-curved"
          style={{overflow: 'auto', maxHeight: '400px'}}>
          {getMatchingOrgs()}
        </div>
      </div>
      <div className="mb-3">
        {forceEngageOrg ? null : (
          <button
            className="btn btn-primary mr-2"
            onClick={() => {
              save()
              close()
            }}
            disabled={name.length === 0}>
            Save
          </button>
        )}
        <button className="btn btn-danger" onClick={close}>
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
  forceEngageOrg: PropTypes.bool,
}

export default Form
