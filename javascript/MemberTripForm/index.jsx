'use strict'
import React, {useState} from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import Form from '../TripForm/Form'

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
