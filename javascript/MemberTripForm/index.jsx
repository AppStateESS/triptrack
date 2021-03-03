'use strict'
import React from 'react'
import ReactDOM from 'react-dom'
import Form from '../TripForm/Form'

/* global allowInternational, contactBannerRequired, tripId, defaultState, defaultCountry */

const MemberTripForm = (props) => {
  return (
    <div>
      <Form {...props} allowApproval={false} role="Member" />
    </div>
  )
}

ReactDOM.render(
  <MemberTripForm
    allowInternational={allowInternational}
    contactBannerRequired={contactBannerRequired}
    tripId={tripId}
    defaultState={defaultState}
    defaultCountry={defaultCountry}
  />,
  document.getElementById('MemberTripForm')
)
