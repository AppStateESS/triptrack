'use strict'
import React, {useState} from 'react'
import PropTypes from 'prop-types'
import Organizations from './Organizations'

const Submitter = ({Trip, setFormElement}) => {
  return (
    <fieldset>
      <legend className="border-bottom">Submitter information</legend>
      <Organizations Trip={Trip} setFormElement={setFormElement} />
      <div className="row form-group">
        <div className="col-sm-4">Your name</div>
        <div className="col-sm-8">
          <input
            type="text"
            className="form-control"
            value={Trip.submitName}
            onChange={(e) => {
              setFormElement('submitName', e.target.value)
            }}
          />
        </div>
      </div>
      <div className="row form-group">
        <div className="col-sm-4">Your email</div>
        <div className="col-sm-8">
          <input
            type="text"
            className="form-control"
            value={Trip.submitEmail}
            onChange={(e) => {
              setFormElement('submitEmail', e.target.value)
            }}
          />
        </div>
      </div>
    </fieldset>
  )
}

Submitter.propTypes = {Trip: PropTypes.object, setFormElement: PropTypes.func}

export default Submitter
