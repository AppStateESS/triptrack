'use strict'
import React from 'react'
import ReactDOM from 'react-dom'
import Form from '../TripForm/Form'

/* global allowInternational, contactBannerRequired, tripId, defaultState, defaultCountry, hostLabel, organizationLabel, accommodationRequired, secondaryRequired */

const MemberTripForm = (props) => {
  return (
    <div>
      <Form
        {...props}
        allowApproval={false}
        role="Member"
        hostLabel={hostLabel}
        organizationLabel={organizationLabel}
      />
    </div>
  )
}

ReactDOM.render(
  <MemberTripForm
    allowInternational={allowInternational}
    contactBannerRequired={contactBannerRequired}
    organizationLabel={organizationLabel}
    accommodationRequired={accommodationRequired}
    secondaryRequired={secondaryRequired}
    hostLabel={hostLabel}
    tripId={tripId}
    defaultState={defaultState}
    defaultCountry={defaultCountry}
  />,
  document.getElementById('MemberTripForm')
)
