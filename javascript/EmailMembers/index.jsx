'use strict'
import React, {useState, useEffect} from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import Form from './Form'
import {getItem, getList} from '../api/Fetch'

/* global orgId, tripId, organizationLabel */

const EmailMembers = ({orgId, tripId, organizationLabel}) => {
  const [organization, setOrganization] = useState({})
  const [trip, setTrip] = useState({})
  const [loading, setLoading] = useState(true)
  const [members, setMembers] = useState([])

  useEffect(() => {
    Promise.all([
      getItem('Organization', orgId),
      getItem('Trip', tripId),
      getList('./triptrack/Admin/Member', {tripId, emailOnly: true}),
    ]).then((response) => {
      setOrganization(response[0].data)
      setTrip(response[1].data)
      setMembers(response[2].data)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return <div>Loading data.</div>
  } else if (members.length === 0) {
    return <div>No members to email</div>
  }

  let tripInformation
  let memberName = 'Trip'
  let title = <h3>Email {memberName} participants</h3>
  if (tripId === 0) {
    memberName = organizationLabel
    title = (
      <h3>
        Email members of {organizationLabel.toLowerCase()}: {organization.name}
      </h3>
    )
  } else {
    tripInformation = (
      <div className="col-sm-6">
        <strong>Host</strong>: {trip.host}
        <br />
        <strong>Destination</strong>: {trip.destinationCity},{' '}
        {trip.destinationState}
        <br />
        <strong>Event date</strong>: {trip.formatted.timeEventStarts.date}
        <br />
        <strong>{organizationLabel}</strong>: {organization.name}
      </div>
    )
  }

  return (
    <div>
      {title}
      <div className="row">
        {tripInformation}
        <div className="col-sm-6">
          <div>
            <strong>Recipents:</strong>
            <div
              className="border p-2"
              style={{overflow: 'auto', maxHeight: '150px', width: '300px'}}>
              {members.map((value) => {
                return <div key={`member-${value.email}`}>{value.email}</div>
              })}
            </div>
          </div>
        </div>
      </div>
      <Form {...{orgId, tripId, memberCount: members.length}} />
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
