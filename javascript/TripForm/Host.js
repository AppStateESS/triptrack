'use strict'
import React, {useState} from 'react'
import PropTypes from 'prop-types'
import {states} from '../Share/States'
import {countries} from '../Share/Countries'

const createOptions = (options) => {
  const inputs = []
  options.forEach((element) => {
    inputs.push(<option key={element}>{element}</option>)
  })
  return inputs
}

const Host = ({Trip, setFormElement, allowInternational, ready}) => {
  // const [stateList, setStateList] = useState(createOptions(states))
  // const [countryList, setCountryList] = useState(createOptions(countries))
  const stateList = createOptions(states)
  const countryList = createOptions(countries)

  const [errors, setErrors] = useState({
    host: false,
    destinationCity: false,
  })

  const errorCheck = (name) => {
    errors[name] = Trip[name].length === 0
    setErrors(Object.assign({}, errors))
    ready(!errors.host && !errors.destinationCity)
  }

  const invalid = 'form-control is-invalid'
  const valid = 'form-control'

  const stateSelect = (
    <div className="row form-group">
      <div className="col-sm-4">
        <label>State</label>
      </div>
      <div className="col-sm-4">
        <select
          className="form-control"
          value={Trip.destinationState}
          onChange={(e) => setFormElement('destinationState', e.target.value)}>
          {stateList}
        </select>
      </div>
    </div>
  )

  const international = () => {
    if (allowInternational) {
      return (
        <div className="row form-group">
          <div className="col-sm-4">
            <label>Country</label>
          </div>
          <div className="col-sm-4">
            <select
              className="form-control"
              value={Trip.destinationCountry}
              onChange={(e) =>
                setFormElement('destinationCountry', e.target.value)
              }>
              {countryList}
            </select>
          </div>
        </div>
      )
    } else {
      return null
    }
  }

  const showStates = () => {
    if (
      (allowInternational && Trip.destinationCountry == 'United States') ||
      !allowInternational
    ) {
      return stateSelect
    } else {
      return null
    }
  }

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
            className={errors.host ? invalid : valid}
            placeholder="Enter the name of facility, team, group, etc. you are visiting"
            onBlur={() => errorCheck('host')}
            value={Trip.host}
            onChange={(e) => {
              setFormElement('host', e.target.value)
            }}
          />
          {errors.host ? (
            <div className="invalid-feedback">Please provide a valid host.</div>
          ) : null}
        </div>
      </div>
      <div className="row form-group">
        <div className="col-sm-4">
          <label>City</label>
        </div>
        <div className="col-sm-8">
          <input
            type="text"
            onBlur={() => errorCheck('destinationCity')}
            className={errors.destinationCity ? invalid : valid}
            value={Trip.destinationCity}
            onChange={(e) => {
              setFormElement('destinationCity', e.target.value)
            }}
          />
          {errors.destinationCity ? (
            <div className="invalid-feedback">Please provide a valid city.</div>
          ) : null}
        </div>
      </div>
      {showStates()}
      {international()}
    </fieldset>
  )
}

Host.propTypes = {
  Trip: PropTypes.object,
  setFormElement: PropTypes.func,
  allowInternational: PropTypes.bool,
  ready: PropTypes.func,
}

export default Host
