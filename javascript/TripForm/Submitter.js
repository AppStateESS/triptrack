'use strict'
import React, {useState} from 'react'
import PropTypes from 'prop-types'
import Organizations from './Organizations'

const Submitter = ({Trip, setFormElement}) => {
  const [errors, setErrors] = useState({
    submitName: false,
    submitEmail: false,
  })

  const errorCheck = (name) => {
    errors[name] = Trip[name].length === 0
    setErrors(Object.assign({}, errors))
  }

  const invalid = 'form-control is-invalid'
  const valid = 'form-control'

  return (
    <fieldset>
      <legend className="border-bottom">Submitter information</legend>
      <Organizations Trip={Trip} setFormElement={setFormElement} />
      <div className="row form-group">
        <div className="col-sm-4">Your name</div>
        <div className="col-sm-8">
          <input
            type="text"
            className={errors.submitName ? invalid : valid}
            value={Trip.submitName}
            onBlur={() => errorCheck('submitName')}
            onChange={(e) => {
              setFormElement('submitName', e.target.value)
            }}
          />
          {errors.submitName ? (
            <div className="invalid-feedback">Please provide a valid name.</div>
          ) : null}
        </div>
      </div>
      <div className="row form-group">
        <div className="col-sm-4">Your email</div>
        <div className="col-sm-8">
          <input
            type="text"
            className={errors.submitEmail ? invalid : valid}
            value={Trip.submitEmail}
            onBlur={() => errorCheck('submitEmail')}
            onChange={(e) => {
              setFormElement('submitEmail', e.target.value)
            }}
          />
          {errors.submitEmail ? (
            <div className="invalid-feedback">
              Please provide a valid email.
            </div>
          ) : null}
        </div>
      </div>
    </fieldset>
  )
}

Submitter.propTypes = {Trip: PropTypes.object, setFormElement: PropTypes.func}

export default Submitter
