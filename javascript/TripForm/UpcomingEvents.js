'use strict'
import React, {useState} from 'react'
import PropTypes from 'prop-types'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faSpinner} from '@fortawesome/free-solid-svg-icons'

const UpcomingEvents = ({
  events,
  loadingEvents,
  eventAssociation,
  engageEventId,
}) => {
  const [engageId, setEngageId] = useState(engageEventId)
  const associate = () => {
    eventAssociation(engageId)
  }
  return (
    <div>
      {loadingEvents ? (
        <div>
          <FontAwesomeIcon icon={faSpinner} pulse />
          &nbsp; Loading events...
        </div>
      ) : events.length === 0 ? (
        <div>
          <em>No upcoming events found.</em>
        </div>
      ) : (
        <div className="text-center">
          <select
            className="form-control"
            value={engageId}
            onChange={(e) => setEngageId(e.target.value)}>
            <option value="-1">Associate an upcoming event below</option>
            {events.map((value) => {
              return (
                <option key={`event-${value.id}`} value={value.id}>
                  {value.name} - {new Date(value.startsOn).toDateString()}
                </option>
              )
            })}
          </select>
          <div>
            <small>Choosing an event will update text fields below.</small>
          </div>
          <button
            className="btn btn-success"
            onClick={associate}
            disabled={engageId === 0}>
            Associate event with trip
          </button>
        </div>
      )}
    </div>
  )
}

UpcomingEvents.propTypes = {
  events: PropTypes.array,
  loadingEvents: PropTypes.bool,
  copyEvent: PropTypes.func,
  eventAssociation: PropTypes.func,
  engageEventId: PropTypes.number,
}

export default UpcomingEvents
