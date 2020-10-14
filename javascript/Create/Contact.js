'use strict'
import React from 'react'
import PropTypes from 'prop-types'

const Contact = ({Trip, setFormElement}) => {
  return (
    <fieldset className="mb-4">
      <legend className="border-bottom">Contact information</legend>
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
                    className="form-control"
                    value={Trip.contactName}
                    onChange={(e) => {
                      setFormElement('contactName', e.target.value)
                    }}
                  />
                </div>
              </div>
              <div className="row form-group">
                <div className="col-sm-4">Email</div>
                <div className="col-sm-8">
                  <input
                    type="text"
                    className="form-control"
                    value={Trip.contactEmail}
                    onChange={(e) => {
                      setFormElement('contactEmail', e.target.value)
                    }}
                  />
                </div>
              </div>
              <div className="row form-group">
                <div className="col-sm-4">Phone</div>
                <div className="col-sm-8">
                  <input
                    type="text"
                    className="form-control"
                    value={Trip.contactPhone}
                    onChange={(e) => {
                      setFormElement('contactPhone', e.target.value)
                    }}
                  />
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
                    className="form-control"
                    value={Trip.secContactName}
                    onChange={(e) => {
                      setFormElement('secContactName', e.target.value)
                    }}
                  />
                </div>
              </div>
              <div className="row form-group">
                <div className="col-sm-4">Email</div>
                <div className="col-sm-8">
                  <input
                    type="text"
                    className="form-control"
                    value={Trip.secContactEmail}
                    onChange={(e) => {
                      setFormElement('secContactEmail', e.target.value)
                    }}
                  />
                </div>
              </div>
              <div className="row form-group">
                <div className="col-sm-4">Phone</div>
                <div className="col-sm-8">
                  <input
                    type="text"
                    className="form-control"
                    value={Trip.secContactPhone}
                    onChange={(e) => {
                      setFormElement('secContactPhone', e.target.value)
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </fieldset>
  )
}

Contact.propTypes = {Trip: PropTypes.object, setFormElement: PropTypes.func}

export default Contact
