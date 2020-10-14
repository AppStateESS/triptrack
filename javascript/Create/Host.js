'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import {states} from '../Share/States'

const createStates = () => {
  const inputs = []
  states.forEach((element) => {
    inputs.push(<option key={element}>{element}</option>)
  })
  return inputs
}

const Host = ({Trip, setFormElement}) => {
  return (
    <fieldset className="mb-4">
      <legend className="border-bottom">Host information</legend>
      <p>Enter information about the host for your trip.</p>
      <div className="row form-group">
        <div className="col-sm-4">
          <label className="mb-0">Host name</label>
        </div>
        <div className="col-sm-8">
          <input
            type="text"
            className="form-control"
            placeholder="Enter the name of facility, team, group, etc. you are visiting"
            value={Trip.host}
            onChange={(e) => {
              setFormElement('host', e.target.value)
            }}
          />
        </div>
      </div>
      <div className="row form-group">
        <div className="col-sm-4">
          <label>City</label>
        </div>
        <div className="col-sm-8">
          <input
            type="text"
            className="form-control"
            value={Trip.destinationCity}
            onChange={(e) => {
              setFormElement('destinationCity', e.target.value)
            }}
          />
        </div>
      </div>
      <div className="row form-group">
        <div className="col-sm-4">
          <label>State</label>
        </div>
        <div className="col-sm-4">
          <select
            className="form-control"
            value={Trip.destinationState}
            onChange={(e) => setFormElement('destinationState', e)}>
            {createStates()}
          </select>
        </div>
      </div>
      <div className="row form-group">
        <div className="col-sm-4">
          <label>Country</label>
        </div>
        <div className="col-sm-8">
          <input
            type="text"
            className="form-control"
            value={Trip.destinationCountry}
            onChange={(e) => {
              setFormElement('destinationCountry', e.target.value)
            }}
          />
        </div>
      </div>
    </fieldset>
  )
}

Host.propTypes = {Trip: PropTypes.object, setFormElement: PropTypes.func}

export default Host
