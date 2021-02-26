'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import {states} from '../Share/States'
import {countries} from '../Share/Countries'
import {createOptions} from '../Share/CreateOptions'

const Host = ({
  Trip,
  setFormElement,
  allowInternational,
  errorCheck,
  errors,
}) => {
  const stateList = createOptions(states)
  const countryList = createOptions(countries)

  const invalid = 'form-control is-invalid'
  const valid = 'form-control'

  const statesShown =
    (allowInternational && Trip.destinationCountry == 'United States') ||
    !allowInternational

  const stateSelect = () => {
    return (
      <select
        className="form-control"
        value={Trip.destinationState}
        onChange={(e) => setFormElement('destinationState', e.target.value)}>
        {stateList}
      </select>
    )
  }

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
    if (statesShown) {
      return stateSelect()
    } else {
      return null
    }
  }

  return (
    <fieldset className="mb-4">
      <legend className="border-bottom mb-3">Host information</legend>
      <p>Enter information about the host for your trip.</p>
      <div className="row form-group">
        <div className="col-sm-4">
          <label className="mb-0">Trip host</label>
        </div>
        <div className="col-sm-8">
          <input
            type="text"
            name="host"
            className={errors.host ? invalid : valid}
            placeholder="Enter the facility name, event, team, group, etc."
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
          <label>{'Destination City' + (statesShown ? ', State' : '')}</label>
        </div>
        <div className="col-sm-5">
          <input
            type="text"
            name="destinationCity"
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
        <div className="col-sm-3">{showStates()}</div>
      </div>
      <div className="row form-group">
        <div className="col-sm-4">
          <label>Address of hotel or accommodations</label>
        </div>
        <div className="col-sm-8">
          <input
            type="text"
            name="housingAddress"
            onBlur={() => errorCheck('housingAddress')}
            className={errors.housingAddress ? invalid : valid}
            value={Trip.housingAddress}
            onChange={(e) => {
              setFormElement('housingAddress', e.target.value)
            }}
          />
        </div>
      </div>
      {international()}
    </fieldset>
  )
}

Host.propTypes = {
  Trip: PropTypes.object,
  setFormElement: PropTypes.func,
  allowInternational: PropTypes.bool,
  errorCheck: PropTypes.func,
  errors: PropTypes.object,
  touched: PropTypes.object,
}

export default Host
