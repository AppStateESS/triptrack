'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import Organizations from './Organizations'

const Submitter = ({
  trip,
  setFormElement,
  organizationLabel,
  organizationList,
  errors,
  role,
}) => {
  const invalid = 'form-control is-invalid'
  const valid = 'form-control'
  const submitName = () => {
    if (role === 'Member') {
      return <strong>{trip.submitName}</strong>
    } else {
      return (
        <input
          type="text"
          name="submitName"
          className={errors.submitName ? invalid : valid}
          value={trip.submitName}
          onChange={(e) => {
            setFormElement('submitName', e.target.value)
          }}
        />
      )
    }
  }

  const submitEmail = () => {
    if (role === 'Member') {
      return <strong>{trip.submitEmail}</strong>
    } else {
      return (
        <input
          type="text"
          name="submitEmail"
          className={errors.submitEmail ? invalid : valid}
          value={trip.submitEmail}
          onChange={(e) => {
            setFormElement('submitEmail', e.target.value)
          }}
        />
      )
    }
  }

  return (
    <fieldset>
      <legend className="border-bottom mb-3">Submitter information</legend>
      <Organizations
        organizationList={organizationList}
        trip={trip}
        setFormElement={setFormElement}
        role={role}
        organizationLabel={organizationLabel}
      />
      <div className="row form-group">
        <div className="col-sm-4">
          {role == 'Member' ? 'Your name' : 'Submitter name'}
          <span className="text-danger">*</span>
        </div>
        <div className="col-sm-8">
          {submitName()}
          {errors.submitName ? (
            <div className="invalid-feedback">Please provide a valid name.</div>
          ) : null}
        </div>
      </div>
      <div className="row form-group">
        <div className="col-sm-4">
          {role == 'Member' ? 'Your email' : 'Submitter email'}
          <span className="text-danger">*</span>
        </div>
        <div className="col-sm-8">
          {submitEmail()}

          {errors.submitEmail ? (
            <div className="invalid-feedback">
              Please provide a valid email address.
            </div>
          ) : null}
        </div>
      </div>
    </fieldset>
  )
}

Submitter.propTypes = {
  trip: PropTypes.object,
  setFormElement: PropTypes.func,
  errorCheck: PropTypes.func,
  errors: PropTypes.object,
  organizationLabel: PropTypes.string,
  touched: PropTypes.object,
  role: PropTypes.string,
  organizationList: PropTypes.array,
}

export default Submitter
