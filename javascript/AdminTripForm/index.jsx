'use strict'
import React, {useState, useEffect, useRef} from 'react'
import ReactDOM from 'react-dom'
import Form from '../TripForm/Form'
import {getTrip, getTripDocuments} from '../api/TripAjax'
import {getList} from '../api/Fetch'
import Loading from '../api/Loading'
import NoAdminOrg from './NoAdminOrg'

/* global allowInternational, contactBannerRequired, tripId, defaultState, defaultCountry,
hostLabel, organizationLabel, accommodationRequired, secondaryRequired, allowUpload, uploadRequired, uploadInstructions  */

const AdminTripForm = (props) => {
  const [organizations, setOrganizations] = useState([])
  const [view, setView] = useState('loading')
  const [defaultTrip, setDefaultTrip] = useState({})
  const tripDocuments = useRef([])

  const loadOrganizations = () => {
    return getList('./triptrack/Admin/Organization/')
  }

  useEffect(() => {
    Promise.all([
      loadOrganizations(),
      getTrip(tripId, 'Admin'),
      getTripDocuments(tripId, 'Admin'),
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
          tripDocuments.current = response[2].data
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
          tripDocuments={tripDocuments.current}
          role="Admin"
          hostLabel={hostLabel}
          organizationLabel={organizationLabel}
        />
      )

    case 'noorg':
      return <NoAdminOrg organizationLabel={organizationLabel} />
  }
}

ReactDOM.render(
  <AdminTripForm
    allowInternational={allowInternational}
    contactBannerRequired={contactBannerRequired}
    organizationLabel={organizationLabel}
    accommodationRequired={accommodationRequired}
    secondaryRequired={secondaryRequired}
    hostLabel={hostLabel}
    tripId={tripId}
    defaultState={defaultState}
    defaultCountry={defaultCountry}
    allowUpload={allowUpload}
    uploadRequired={uploadRequired}
    uploadInstructions={uploadInstructions}
  />,
  document.getElementById('AdminTripForm')
)
