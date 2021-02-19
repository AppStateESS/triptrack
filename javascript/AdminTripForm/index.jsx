'use strict'
import React, {useState, useEffect} from 'react'
import ReactDOM from 'react-dom'
import Form from '../TripForm/Form'

/* global allowInternational, contactBannerRequired, tripId, defaultState, defaultCountry */

const AdminTripForm = (props) => {
  return (
    <div>
      <Form {...props} role={'Admin'} />
    </div>
  )
}

ReactDOM.render(
  <AdminTripForm
    allowInternational={allowInternational}
    contactBannerRequired={contactBannerRequired}
    tripId={tripId}
    defaultState={defaultState}
    defaultCountry={defaultCountry}
  />,
  document.getElementById('AdminTripForm')
)
