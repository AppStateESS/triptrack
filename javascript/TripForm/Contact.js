'use strict'
import React from 'react'
import PropTypes from 'prop-types'

const Contact = ({Trip, setFormElement, errors, errorCheck}) => {
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
                <div className="col-sm-4">Name</div>
                <div className="col-sm-8">
                  <input
                    type="text"
                    className={errors.contactName ? invalid : valid}
                    onBlur={() => errorCheck('contactName')}
                    value={Trip.contactName}
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
                <div className="col-sm-4">Email</div>
                <div className="col-sm-8">
                  <input
                    type="text"
                    className={errors.contactEmail ? invalid : valid}
                    onBlur={() => errorCheck('contactEmail')}
                    value={Trip.contactEmail}
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
                <div className="col-sm-4">Phone</div>
                <div className="col-sm-8">
                  <input
                    type="text"
                    className={errors.contactPhone ? invalid : valid}
                    value={Trip.contactPhone}
                    placeholder="###-###-####"
                    onBlur={() => errorCheck('contactPhone')}
                    onChange={(e) => {
                      const value = e.target.value
                      if (value.match(/[\d\-\.]+/)) {
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
                <div className="col-sm-4">Name</div>
                <div className="col-sm-8">
                  <input
                    type="text"
                    className={errors.secContactName ? invalid : valid}
                    value={Trip.secContactName}
                    onBlur={() => errorCheck('secContactName')}
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
                <div className="col-sm-4">Email</div>
                <div className="col-sm-8">
                  <input
                    type="text"
                    className={errors.secContactEmail ? invalid : valid}
                    value={Trip.secContactEmail}
                    onBlur={() => errorCheck('secContactEmail')}
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
                <div className="col-sm-4">Phone</div>
                <div className="col-sm-8">
                  <input
                    type="text"
                    className={errors.secContactPhone ? invalid : valid}
                    placeholder="###-###-####"
                    value={Trip.secContactPhone}
                    onBlur={() => errorCheck('secContactPhone')}
                    onChange={(e) => {
                      const value = e.target.value
                      if (value.match(/[\d\-\.]+/)) {
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
  Trip: PropTypes.object,
  setFormElement: PropTypes.func,
  errorCheck: PropTypes.func,
  errors: PropTypes.object,
}

export default Contact
