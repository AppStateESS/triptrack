'use strict'
import PropTypes from 'prop-types'
import React, {useEffect, useState} from 'react'
import ReactDOM from 'react-dom'
import {getTrip} from '../api/TripAjax'
import {
  getEventAttending,
  getMemberListByOrganization,
  getParticipants,
  sendMembersAttending,
} from '../api/MemberAjax'
import AttendingList from './AttendingList'
import OrganizationList from './OrganizationList'
import Participants from './Participants'
import {getItem} from '../api/Fetch'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'

/* global tripId, organizationLabel, role */

const MemberSelection = ({tripId, organizationLabel, role}) => {
  const [loading, setLoading] = useState(true)
  const [trip, setTrip] = useState()
  const [organization, setOrganization] = useState()
  const [organizationMembers, setOrganizationMembers] = useState()
  const [eventAttending, setEventAttending] = useState()
  const [bannerIds, setBannerIds] = useState([])
  const [currentMembers, setCurrentMembers] = useState([])
  const [saving, setSaving] = useState(0)
  const [changed, setChanged] = useState(false)

  useEffect(() => {
    getTrip(tripId, 'Admin').then((response) => {
      const trip = response.data
      setTrip(trip)

      const p1 = getItem('Organization', trip.organizationId, 'Admin').then(
        (response) => {
          setOrganization(response.data)
        }
      )

      const p2 = getMemberListByOrganization(trip.organizationId).then(
        (response) => {
          setOrganizationMembers(response.data)
        }
      )

      const p3 = getEventAttending(trip.engageEventId).then((response) => {
        setEventAttending(response.data)
      })

      const p4 = getParticipants(trip.id).then((response) => {
        setCurrentMembers(response.data)
        updateBannerIds(response.data)
      })

      Promise.all([p1, p2, p3, p4]).then(() => {
        setLoading(false)
        setChanged(false)
      })
    })
  }, [])

  useEffect(() => {
    if (!loading) {
      setChanged(true)
    }
  }, [bannerIds])

  const wait = (delay) => {
    const promise = new Promise((resolve) => setTimeout(resolve, delay))
    return promise
  }

  const updateBannerIds = (listing) => {
    listing.forEach((value) => {
      bannerIds.push(value.bannerId)
    })
    setBannerIds([...bannerIds])
  }

  const addMember = (member) => {
    bannerIds.push(member.bannerId)
    currentMembers.push(member)
    setBannerIds([...bannerIds])
    setCurrentMembers([...currentMembers])
  }

  const removeMember = (key) => {
    const member = currentMembers[key]
    const bannerIdx = bannerIds.indexOf(member.bannerId)
    currentMembers.splice(key, 1)
    bannerIds.splice(bannerIdx, 1)
    setBannerIds([...bannerIds])
    setCurrentMembers([...currentMembers])
  }

  const save = () => {
    setSaving(-1)
    sendMembersAttending(trip.id, bannerIds, role).then(() => {
      wait(1000).then(() => {
        setSaving(1)
      })
      wait(3000).then(() => {
        setSaving(0)
        setChanged(false)
      })
    })
  }

  let buttonLabel
  switch (saving) {
    case -1:
      buttonLabel = (
        <span>
          <FontAwesomeIcon icon="spinner" spin />
          &nbsp;Saving...
        </span>
      )
      break
    case 1:
      buttonLabel = <span>Members updated!</span>
      break
    case 0:
      buttonLabel = <span>Save participants</span>
  }

  const saveButton = (
    <button
      className="btn btn-success btn-block my-3"
      disabled={saving || !changed}
      onClick={save}>
      {buttonLabel}
    </button>
  )
  if (loading) {
    return (
      <div className="text-center lead">
        <FontAwesomeIcon icon="spinner" spin />
        &nbsp; Loading members...
      </div>
    )
  } else {
    return (
      <div>
        <h2>{trip.host} - member selection</h2>
        <hr />
        {saveButton}
        <h3>Participants</h3>
        <div className="card mb-4">
          <div className="card-body">
            <Participants {...{currentMembers, removeMember}} />
          </div>
        </div>
        <div className="row">
          <div className="col-sm-6">
            <h4>{organization.name} members</h4>
            <OrganizationList
              {...{
                organizationMembers,
                organizationLabel,
                bannerIds,
                addMember,
              }}
            />
          </div>
          <div className="col-sm-6">
            <h4>Event attending</h4>
            <AttendingList {...{eventAttending, bannerIds, addMember}} />
          </div>
        </div>
        {saveButton}
      </div>
    )
  }
}

MemberSelection.propTypes = {
  tripId: PropTypes.number,
  organizationLabel: PropTypes.string,
  role: PropTypes.string,
}

ReactDOM.render(
  <MemberSelection tripId={tripId} organizationLabel={organizationLabel} />,
  document.getElementById('MemberSelection')
)
