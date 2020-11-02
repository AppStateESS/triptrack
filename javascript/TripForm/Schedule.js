'use strict'
import React, {useState} from 'react'
import PropTypes from 'prop-types'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

const Schedule = ({Trip, setFormElement}) => {
  let departingObj
  if (Trip.timeDeparting) {
    departingObj = new Date(Trip.timeDeparting * 1000)
  } else {
    departingObj = new Date()
  }

  let eventStarts
  if (Trip.timeEventStarts) {
    eventStarts = new Date(Trip.timeEventStarts * 1000)
  } else {
    eventStarts = new Date()
  }

  let returning
  if (Trip.timeReturn) {
    returning = new Date(Trip.timeReturn * 1000)
  } else {
    returning = new Date()
  }

  return (
    <fieldset className="mb-4">
      <legend className="border-bottom mb-3">Schedule</legend>
      <div>
        <div className="row form-group">
          <div className="col-sm-4">
            <label className="d-block">Departure</label>
            <DatePicker
              selected={departingObj}
              onChange={(value) => {
                setFormElement('timeDeparting', value.getTime() / 1000)
              }}
              showTimeSelect
              className="form-control"
              dateFormat="MMM d, yyyy hh:mm"
            />
          </div>
          <div className="col-sm-4">
            <label className="d-block">Event start</label>
            <DatePicker
              selected={eventStarts}
              onChange={(value) => {
                setFormElement('timeEventStarts', value.getTime() / 1000)
              }}
              showTimeSelect
              className="form-control"
              dateFormat="MMM d, yyyy hh:mm"
            />
          </div>
          <div className="col-sm-4">
            <label className="d-block">Returning</label>
            <DatePicker
              selected={returning}
              onChange={(value) => {
                setFormElement('timeReturn', value.getTime() / 1000)
              }}
              showTimeSelect
              className="form-control"
              dateFormat="MMM d, yyyy hh:mm"
            />
          </div>
        </div>
      </div>
    </fieldset>
  )
}

Schedule.propTypes = {Trip: PropTypes.object, setFormElement: PropTypes.func}

export default Schedule
