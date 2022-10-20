'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import {states, territories} from '../Share/States'
import {countries} from '../Share/Countries'
import {createOptions} from '../Share/CreateOptions'
import Organizations from './Organizations'

const Host = ({
  trip,
  setFormElement,
  allowInternational,
  hostLabel,
  errors,
  accommodationRequired,
  organizationList,
  organizationLabel,
  setErrors,
}) => {
  const hostString = hostLabel.length > 0 ? hostLabel : 'Host'
  const stateList = createOptions(states, 'abbreviation', 'name')
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

  const cityWarning = territories.includes(trip.destinationState)

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
      <Organizations
        organizationList={organizationList}
        trip={trip}
        setFormElement={setFormElement}
        organizationLabel={organizationLabel}
        orgError={errors.organizationId}
      />
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
            onBlur={() => {
              errors.host = trip.host.length === 0
              setErrors({...errors})
            }}
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
            maxsize="255"
            size="255"
            className={errors.visitPurpose ? invalid : valid}
            placeholder="Reason for traveling"
            value={trip.visitPurpose}
            onBlur={() => {
              errors.visitPurpose = trip.visitPurpose.length === 0
              setErrors({...errors})
            }}
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
        <div className="col-sm-4">Method of travel</div>
        <div className="col-sm-8">
          <select
            className="form-control"
            name="travelMethod"
            onChange={(e) => {
              setFormElement('travelMethod', e.target.value)
            }}
            value={trip.travelMethod}>
            <option value={0}>Personal</option>
            <option value={1}>Car share</option>
            <option value={2}>University van</option>
            <option value={3}>Car/Van rental</option>
            <option value={4}>Chartered bus</option>
            <option value={5}>Flight</option>
            <option value={6}>Train</option>
          </select>
        </div>
      </div>
      <div className="row form-group">
        <div className="col-sm-4">
          <label>
            {'Destination City' +
              (statesShown ? ', State/Territory/District' : '')}
            <span className="text-danger">*</span>
          </label>
        </div>
        <div className="col-sm-5">
          <input
            type="text"
            name="destinationCity"
            className={errors.destinationCity ? invalid : valid}
            value={trip.destinationCity}
            onBlur={() => {
              errors.destinationCity = trip.destinationCity.length === 0
              setErrors({...errors})
            }}
            onChange={(e) => {
              setFormElement('destinationCity', e.target.value)
            }}
          />
          {cityWarning && (
            <span className="small text-info">
              If city does not apply, enter the island name or &quot;N/A&quot;.
            </span>
          )}
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
            className={errors.housingAddress ? invalid : valid}
            onBlur={() => {
              if (accommodationRequired) {
                errors.housingAddress = trip.housingAddress.length === 0
                setErrors({...errors})
              }
            }}
            value={trip.housingAddress}
            onChange={(e) => {
              setFormElement('housingAddress', e.target.value)
            }}
          />
          {errors.housingAddress ? (
            <div className="invalid-feedback">
              Please provide the name and address of your accommodations.
            </div>
          ) : null}
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
  role: PropTypes.string,
  organizationList: PropTypes.array,
  organizationLabel: PropTypes.string,
  setErrors: PropTypes.func,
}

export default Host
