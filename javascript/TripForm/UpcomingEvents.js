'use strict'
import React, {useState} from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'
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

  let content
  if (loadingEvents) {
    content = (
      <div>
        <FontAwesomeIcon icon={faSpinner} pulse />
        &nbsp; Loading events...
      </div>
    )
  } else if (events.length === 0) {
    content = (
      <div>
        <em>No upcoming events found.</em>
      </div>
    )
  } else {
    const eventListing = []

    events.map((ev) => {
      eventListing.push({
        value: ev.id,
        label: `${ev.name.substr(0, 40)} - ${new Date(
          ev.startsOn
        ).toDateString()}`,
      })
    })
    content = (
      <div>
        <Select
          placeholder="Search events"
          options={eventListing}
          onChange={(newValue) => setEngageId(newValue.value)}
        />
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
    )
  }

  return <div>{content}</div>
}

UpcomingEvents.propTypes = {
  events: PropTypes.array,
  loadingEvents: PropTypes.bool,
  copyEvent: PropTypes.func,
  eventAssociation: PropTypes.func,
  engageEventId: PropTypes.number,
}

export default UpcomingEvents
