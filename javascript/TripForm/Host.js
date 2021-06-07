'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import {states} from '../Share/States'
import {countries} from '../Share/Countries'
import {createOptions} from '../Share/CreateOptions'

const Host = ({
  trip,
  setFormElement,
  allowInternational,
  hostLabel,
  errors,
  accommodationRequired,
}) => {
  const hostString = hostLabel.length > 0 ? hostLabel : 'Host'
  const stateList = createOptions(states)
  const countryList = createOptions(countries)

  const invalid = 'form-control is-invalid'
  const valid = 'form-control'

  const statesShown =
    (allowInternational && trip.destinationCountry == 'United States') ||
    !allowInternational

  const stateSelect = () => {
    return (
      <select
        className="form-control"
        value={trip.destinationState}
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
              value={trip.destinationCountry}
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
      <legend className="border-bottom mb-3">{hostString} information</legend>
      <p>
        Enter information about the {hostString.toLowerCase()} for your trip.
      </p>
      <div className="row form-group">
        <div className="col-sm-4">
          <label className="mb-0">
            Trip {hostString.toLowerCase()}
            <span className="text-danger">*</span>
          </label>
        </div>
        <div className="col-sm-8">
          <input
            type="text"
            name="host"
            className={errors.host ? invalid : valid}
            placeholder="Enter the facility name, event, team, group, etc."
            value={trip.host}
            onChange={(e) => {
              setFormElement('host', e.target.value)
            }}
          />
          {errors.host ? (
            <div className="invalid-feedback">
              Please provide a valid {hostString.toLowerCase()}.
            </div>
          ) : null}
        </div>
      </div>
      <div className="row form-group">
        <div className="col-sm-4">
          <label className="mb-0">
            Purpose of trip
            <span className="text-danger">*</span>
          </label>
        </div>
        <div className="col-sm-8">
          <input
            type="text"
            name="visitPurpose"
            className={errors.visitPurpose ? invalid : valid}
            placeholder="Reason for traveling"
            value={trip.visitPurpose}
            onChange={(e) => {
              setFormElement('visitPurpose', e.target.value)
            }}
          />
          {errors.visitPurpose ? (
            <div className="invalid-feedback">
              Please provide a valid purpose.
            </div>
          ) : null}
        </div>
      </div>
      <div className="row form-group">
        <div className="col-sm-4">
          <label>
            {'Destination City' + (statesShown ? ', State' : '')}
            <span className="text-danger">*</span>
          </label>
        </div>
        <div className="col-sm-5">
          <input
            type="text"
            name="destinationCity"
            className={errors.destinationCity ? invalid : valid}
            value={trip.destinationCity}
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
          <label>
            Address of hotel or accommodations
            {accommodationRequired ? (
              <span className="text-danger">*</span>
            ) : null}
          </label>
        </div>
        <div className="col-sm-8">
          <input
            type="text"
            name="housingAddress"
            placeholder="If staying in named hotel, include it with the street address"
            className={errors.housingAddress ? invalid : valid}
            value={trip.housingAddress}
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
  trip: PropTypes.object,
  setFormElement: PropTypes.func,
  allowInternational: PropTypes.bool,
  errorCheck: PropTypes.func,
  errors: PropTypes.object,
  hostLabel: PropTypes.string,
  touched: PropTypes.object,
  accommodationRequired: PropTypes.bool,
}

export default Host
