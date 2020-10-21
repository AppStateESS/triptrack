'use strict'
import React, {useState, useEffect} from 'react'
import {getList} from '../api/Fetch'
import PropTypes from 'prop-types'

const Organizations = ({Trip, setFormElement}) => {
  const [organizations, setOrganizations] = useState([])
  const loadOrganizations = async () => {
    let response = await getList('./triptrack/Admin/Organization/')
    if (response === false) {
      throw 'Could not contact server.'
    } else {
      if (response.length > 0) {
        setOrganizations(response)
      }
    }
  }
  useEffect(() => {
    loadOrganizations()
  }, [])

  let options = []
  if (organizations.length > 0) {
    options = organizations.map((value, key) => {
      return (
        <option key={'org-' + key} value={value.id}>
          {value.name}
        </option>
      )
    })
  }

  return (
    <div className="row form-group">
      <div className="col-sm-4">
        <label>Attending organization</label>
      </div>
      <div className="col-sm-8">
        <select
          className="form-control"
          onChange={(e) => setFormElement('organizationId', e)}
          value={Trip.organizationId}>
          {options}
        </select>
      </div>
    </div>
  )
}

Organizations.propTypes = {
  Trip: PropTypes.object,
  setFormElement: PropTypes.func,
}

export default Organizations
