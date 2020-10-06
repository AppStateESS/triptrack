'use strict'
import React, {useState} from 'react'
import {states} from '../Share/States'

const defaultTrip = {
  additionalMembers: '',
  host: '',
  contactHost: '',
  contactPhone: '',
  destinationCity: '',
  destinationCountry: '',
  destinationState: '',
  housingAddress: '',
  organizationId: 0,
  secContactName: '',
  secContactPhone: '',
  submitDate: 0,
  submitEmail: '',
  submitName: '',
  timeDeparting: 0,
  timeEventStarts: 0,
  timeReturn: 0,
  visitPurpose: '',
}
const createStates = () => {
  const inputs = []
  states.forEach((element) => {
    inputs.push(<option key={element}>{element}</option>)
  })
  return inputs
}

const Form = () => {
  const [Trip, setTrip] = useState({defaultTrip})
  const setFormElement = (key, value) => {
    Trip[key] = value
    setTrip(Trip)
  }

  return (
    <div>
      <fieldset className="mb-4">
        <legend>Host information</legend>
        <div className="row">
          <div className="col-sm-6">
            <label className="lead mb-0">Host name</label>
            <p className="small">
              Enter the name of facility, team, group, etc. you are visiting
            </p>
            <input
              type="text"
              className="form-control"
              value={Trip.host}
              onChange={(e) => {
                setFormElement('host', e.target.value)
              }}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-sm-6">
            <label>City</label>
            <input
              type="text"
              className="form-control"
              value={Trip.destinationCity}
              onChange={(e) => {
                setFormElement('destinationCity', e.target.value)
              }}
            />
          </div>
          <div className="col-sm-6">
            <select className="form-control" value={Trip.destinationState}>
              {createStates()}
            </select>
          </div>
        </div>
      </fieldset>

      <fieldset className="mb-4">
        <legend>Contact information</legend>
        <p>Enter a name and phone number of someone we can contact.</p>
      </fieldset>
      <div className="row">
        <div className="col-sm-6">
          <label>Contact host phone</label>
          <input
            type="text"
            className="form-control"
            value={Trip.contactPhone}
            onChange={(e) => {
              setFormElement('contactPhone', e.target.value)
            }}
          />
        </div>
        <div className="col-sm-6">
          <label>Contact host name</label>
          <input
            type="text"
            className="form-control"
            value={Trip.contactHost}
            onChange={(e) => {
              setFormElement('contactHost', e.target.value)
            }}
          />
        </div>
        <div className="col-sm-6">
          <label>Contact host name</label>
          <input
            type="text"
            className="form-control"
            value={Trip.contactHost}
            onChange={(e) => {
              setFormElement('contactHost', e.target.value)
            }}
          />
        </div>
      </div>
    </div>
  )
}

Form.propTypes = {}

Form.defaultProps = {}
export default Form
