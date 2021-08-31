'use strict'
import React, {useState, useEffect} from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import Form from './Form'
import {getItem} from '../api/Fetch'

/* global orgId, tripId */

const EmailMembers = ({orgId, tripId, organizationLabel}) => {
  const [organization, setOrganization] = useState({})
  const [trip, setTrip] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getItem('Organization', orgId), getItem('Trip', tripId)]).then(
      (response) => {
        setOrganization(response[0].data)
        setTrip(response[1].data)
        setLoading(false)
      }
    )
  }, [])

  if (loading) {
    return <div>Loading data.</div>
  }
  return (
    <div>
      <h4>Email trip participants</h4>
      <strong>Host</strong>: {trip.host}
      <br />
      <strong>Destination</strong>: {trip.destinationCity},{' '}
      {trip.destinationState}
      <br />
      <strong>Event date</strong>: {trip.formatted.timeEventStarts.date}
      <br />
      <strong>{organizationLabel}</strong>: {organization.name}
      <Form />
    </div>
  )
}
EmailMembers.propTypes = {
  orgId: PropTypes.number,
  tripId: PropTypes.number,
  organizationLabel: PropTypes.string,
}

ReactDOM.render(
  <EmailMembers
    orgId={orgId}
    tripId={tripId}
    organizationLabel={organizationLabel}
  />,
  document.getElementById('EmailMembers')
)
