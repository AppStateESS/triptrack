'use strict'
import React, {useState, useEffect} from 'react'
import ReactDOM from 'react-dom'
import Form from '../TripForm/Form'
import {getTrip} from '../api/TripAjax'
import {getList} from '../api/Fetch'
import Loading from '../api/Loading'
import NoMemberOrg from './NoMemberOrg'

/* global allowInternational, contactBannerRequired, tripId, defaultState, defaultCountry, hostLabel, organizationLabel, accommodationRequired, secondaryRequired */

const MemberTripForm = (props) => {
  const [organizations, setOrganizations] = useState([])
  const [view, setView] = useState('loading')
  const [defaultTrip, setDefaultTrip] = useState({})

  const loadOrganizations = () => {
    return getList('./triptrack/Member/Organization/')
  }

  useEffect(() => {
    Promise.all([loadOrganizations(), getTrip(0, 'Member')])
      .then((response) => {
        const orgList = response[0].data
        const trip = response[1].data
        if (trip.contactPhone !== '') {
          trip.contactPhone = trip.contactPhone.toString()
        }
        if (trip.secContactPhone !== '') {
          trip.secContactPhone = trip.secContactPhone.toString()
        }
        if (orgList.length === 0) {
          setView('noorg')
        } else {
          if (trip.organizationId == 0) {
            trip.organizationId = orgList[0].id
          }
          setOrganizations(orgList)
          setDefaultTrip(trip)
          setView('form')
        }
      })
      .catch(() => {
        setView('error')
      })
  }, [])

  switch (view) {
    case 'loading':
      return <Loading />

    case 'error':
      return (
        <div className="alert alert-danger">
          Error: could not contact the server.
        </div>
      )

    case 'form':
      return (
        <Form
          {...props}
          allowApproval={false}
          organizations={organizations}
          defaultTrip={defaultTrip}
          role="Member"
          hostLabel={hostLabel}
          organizationLabel={organizationLabel}
        />
      )

    case 'noorg':
      return <NoMemberOrg organizationLabel={organizationLabel} />
  }
}

ReactDOM.render(
  <MemberTripForm
    allowInternational={allowInternational}
    contactBannerRequired={contactBannerRequired}
    organizationLabel={organizationLabel}
    accommodationRequired={accommodationRequired}
    secondaryRequired={secondaryRequired}
    hostLabel={hostLabel}
    defaultState={defaultState}
    defaultCountry={defaultCountry}
    tripId={tripId}
  />,
  document.getElementById('MemberTripForm')
)
