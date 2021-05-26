'use strict'
import React from 'react'
import ReactDOM from 'react-dom'
import Form from '../TripForm/Form'

/* global allowInternational, contactBannerRequired, tripId, defaultState, defaultCountry, hostLabel, organizationLabel */

const AdminTripForm = (props) => {
  return (
    <div>
      <Form
        {...props}
        role="Admin"
        allowApproval={true}
        hostLabel={hostLabel}
        organizationLabel={organizationLabel}
      />
    </div>
  )
}

ReactDOM.render(
  <AdminTripForm
    allowInternational={allowInternational}
    contactBannerRequired={contactBannerRequired}
    organizationLabel={organizationLabel}
    hostLabel={hostLabel}
    tripId={tripId}
    defaultState={defaultState}
    defaultCountry={defaultCountry}
  />,
  document.getElementById('AdminTripForm')
)
