'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

const Schedule = ({trip, setFormElement}) => {
  let departingObj
  if (trip.timeDeparting) {
    departingObj = new Date(trip.timeDeparting * 1000)
  } else {
    departingObj = new Date()
  }

  let eventStarts
  if (trip.timeEventStarts) {
    eventStarts = new Date(trip.timeEventStarts * 1000)
  } else {
    eventStarts = new Date()
  }

  let returning
  if (trip.timeReturn) {
    returning = new Date(trip.timeReturn * 1000)
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
              className="form-control"
              dateFormat="MMM d, yyyy"
            />
          </div>
          <div className="col-sm-4">
            <label className="d-block">Event</label>
            <DatePicker
              selected={eventStarts}
              onChange={(value) => {
                setFormElement('timeEventStarts', value.getTime() / 1000)
              }}
              className="form-control"
              dateFormat="MMM d, yyyy"
            />
          </div>
          <div className="col-sm-4">
            <label className="d-block">Returning</label>
            <DatePicker
              selected={returning}
              onChange={(value) => {
                setFormElement('timeReturn', value.getTime() / 1000)
              }}
              className="form-control"
              dateFormat="MMM d, yyyy"
            />
          </div>
        </div>
        <div className="text-center">
          <button
            className="btn btn-info"
            onClick={() => {
              setFormElement('timeDeparting', trip.timeEventStarts)
              setFormElement('timeReturn', trip.timeEventStarts)
            }}>
            Sync departure/returning to event date
          </button>
        </div>
      </div>
      <hr />
    </fieldset>
  )
}

Schedule.propTypes = {trip: PropTypes.object, setFormElement: PropTypes.func}

export default Schedule
