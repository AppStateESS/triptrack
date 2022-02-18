'use strict'
import React from 'react'
import PropTypes from 'prop-types'

const Contact = ({
  trip,
  setFormElement,
  errors,
  secondaryRequired,
  setErrors,
}) => {
  const invalid = 'form-control is-invalid'
  const valid = 'form-control'
  return (
    <fieldset className="mb-4">
      <legend className="border-bottom mb-3">Contact information</legend>
      <p>In case we need to reach a trip participant, fill out the below.</p>
      <a id="contact-info"></a>
      <div className="row">
        <div className="col-sm-6">
          <div className="card">
            <div className="card-header">
              <h4 className="mb-0">Primary Contact</h4>
            </div>
            <div className="card-body">
              <div className="row form-group">
                <div className="col-sm-4">
                  Name <span className="text-danger">*</span>
                </div>
                <div className="col-sm-8">
                  <input
                    type="text"
                    name="contactName"
                    onBlur={() => {
                      errors.contactName = trip.contactName.length === 0
                      setErrors({...errors})
                    }}
                    className={errors.contactName ? invalid : valid}
                    value={trip.contactName}
                    onChange={(e) => {
                      setFormElement('contactName', e.target.value)
                    }}
                  />
                  {errors.contactName ? (
                    <div className="invalid-feedback">
                      Please provide a valid name.
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="row form-group">
                <div className="col-sm-4">
                  Email <span className="text-danger">*</span>
                </div>
                <div className="col-sm-8">
                  <input
                    type="text"
                    name="contactEmail"
                    className={errors.contactEmail ? invalid : valid}
                    value={trip.contactEmail}
                    onBlur={() => {
                      errors.contactEmail = trip.contactEmail.length === 0
                      setErrors({...errors})
                    }}
                    onChange={(e) => {
                      setFormElement('contactEmail', e.target.value)
                    }}
                  />
                  {errors.contactEmail ? (
                    <div className="invalid-feedback">
                      Please provide a valid email address.
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="row form-group">
                <div className="col-sm-4">
                  Phone <span className="text-danger">*</span>
                </div>
                <div className="col-sm-8">
                  <input
                    type="text"
                    name="contactPhone"
                    className={errors.contactPhone ? invalid : valid}
                    value={trip.contactPhone}
                    onBlur={() => {
                      errors.contactPhone = trip.contactPhone.length === 0
                      setErrors({...errors})
                    }}
                    placeholder="###-###-####"
                    onChange={(e) => {
                      const value = e.target.value
                      if (value.match(/^[\d\-\.]+$/) || value == '') {
                        setFormElement('contactPhone', value)
                      }
                    }}
                  />
                  {errors.contactPhone ? (
                    <div className="invalid-feedback">
                      Please provide a valid phone number.
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-sm-6">
          <div className="card">
            <div className="card-header">
              <h4 className="mb-0">Secondary Contact</h4>
            </div>
            <div className="card-body">
              <div className="row form-group">
                <div className="col-sm-4">
                  Name{' '}
                  {secondaryRequired ? (
                    <span className="text-danger">*</span>
                  ) : null}
                </div>
                <div className="col-sm-8">
                  <input
                    type="text"
                    name="secContactName"
                    className={errors.secContactName ? invalid : valid}
                    value={trip.secContactName}
                    onBlur={() => {
                      if (secondaryRequired) {
                        errors.secContactName = trip.secContactName.length === 0
                        setErrors({...errors})
                      }
                    }}
                    onChange={(e) => {
                      setFormElement('secContactName', e.target.value)
                    }}
                  />
                  {errors.secContactName ? (
                    <div className="invalid-feedback">
                      Please provide a valid name.
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="row form-group">
                <div className="col-sm-4">
                  Email{' '}
                  {secondaryRequired ? (
                    <span className="text-danger">*</span>
                  ) : null}
                </div>
                <div className="col-sm-8">
                  <input
                    type="text"
                    name="secContactEmail"
                    className={errors.secContactEmail ? invalid : valid}
                    value={trip.secContactEmail}
                    onBlur={() => {
                      if (secondaryRequired) {
                        errors.secContactEmail =
                          trip.secContactEmail.length === 0
                        setErrors({...errors})
                      }
                    }}
                    onChange={(e) => {
                      setFormElement('secContactEmail', e.target.value)
                    }}
                  />
                  {errors.secContactEmail ? (
                    <div className="invalid-feedback">
                      Please provide a valid email address.
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="row form-group">
                <div className="col-sm-4">
                  Phone{' '}
                  {secondaryRequired ? (
                    <span className="text-danger">*</span>
                  ) : null}
                </div>
                <div className="col-sm-8">
                  <input
                    type="text"
                    name="secContactPhone"
                    className={errors.secContactPhone ? invalid : valid}
                    placeholder="###-###-####"
                    value={trip.secContactPhone}
                    onBlur={() => {
                      if (secondaryRequired) {
                        errors.secContactPhone =
                          trip.secContactPhone.length === 0
                        setErrors({...errors})
                      }
                    }}
                    onChange={(e) => {
                      const value = e.target.value
                      if (value.match(/^[\d\-\.]+$/) || value == '') {
                        setFormElement('secContactPhone', value)
                      }
                    }}
                  />
                  {errors.secContactPhone ? (
                    <div className="invalid-feedback">
                      Please provide a valid phone number.
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </fieldset>
  )
}

Contact.propTypes = {
  trip: PropTypes.object,
  setFormElement: PropTypes.func,
  errorCheck: PropTypes.func,
  secondaryRequired: PropTypes.bool,
  errors: PropTypes.object,
}

export default Contact
