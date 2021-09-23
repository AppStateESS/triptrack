'use strict'
import React, {useState, useEffect, useRef} from 'react'
import ReactDOM from 'react-dom'
import Form from '../TripForm/Form'
import {getTrip, getTripDocuments} from '../api/TripAjax'
import {getList} from '../api/Fetch'
import Loading from '../api/Loading'
import NoMemberOrg from './NoMemberOrg'
import PropTypes from 'prop-types'

/* global allowInternational, contactBannerRequired, tripId, defaultState, defaultCountry, hostLabel, organizationLabel, accommodationRequired, secondaryRequired, allowUpload, uploadRequired, uploadInstructions, confirmationRequired, confirmationInstructions  */

const MemberTripForm = (props) => {
  const [organizations, setOrganizations] = useState([])
  const [view, setView] = useState('loading')
  const [defaultTrip, setDefaultTrip] = useState({})
  const tripDocuments = useRef([])

  const loadOrganizations = () => {
    return getList('./triptrack/Member/Organization/')
  }

  useEffect(() => {
    Promise.all([
      loadOrganizations(),
      getTrip(props.tripId, 'Member'),
      getTripDocuments(tripId, 'Member'),
    ])
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
          if (tripId > 0) {
            tripDocuments.current = response[2].data
          }
          setOrganizations(orgList)
          setDefaultTrip(trip)
          setView('form')
        }
      })
      .catch((e) => {
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
          tripDocuments={tripDocuments.current}
          role="Member"
          hostLabel={hostLabel}
          organizationLabel={organizationLabel}
        />
      )

    case 'noorg':
      return <NoMemberOrg organizationLabel={organizationLabel} />
  }
}

MemberTripForm.propTypes = {
  tripId: PropTypes.number,
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
    allowUpload={allowUpload}
    uploadRequired={uploadRequired}
    uploadInstructions={uploadInstructions}
    confirmationInstructions={confirmationInstructions}
    confirmationRequired={confirmationRequired}
  />,
  document.getElementById('MemberTripForm')
)
