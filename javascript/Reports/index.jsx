'use strict'
import React, {useState, useEffect} from 'react'
import ReactDOM from 'react-dom'
import {getList} from '../api/Fetch'
import dayjs from 'dayjs'

/* global organizationLabel */

const Reports = () => {
  const [orgList, setOrgList] = useState([])
  const [orgId, setOrgId] = useState(0)
  const [tripList, setTripList] = useState([])
  const [tripId, setTripId] = useState(0)
  const [usaState, setUsaState] = useState('')
  const [currentOrg, setCurrentOrg] = useState()
  const [upcomingOnly, setUpcomingOnly] = useState(true)
  const [usStates, setUsStates] = useState([])

  useEffect(() => {
    getList('./triptrack/Admin/Organization/').then((response) => {
      setOrgList(response.data)
    })
  }, [])

  useEffect(() => {
    getList('./triptrack/Admin/Trip/usedStates').then((response) => {
      setUsStates(response.data)
    })
  }, [])

  const loadTrips = () => {
    getList('./triptrack/Admin/Trip/', {upcomingOnly}).then((response) => {
      setTripList(response.data)
    })
  }

  useEffect(() => {
    if (orgId == 0) {
      setTripId(0)
    } else {
      loadTrips()
    }
  }, [orgId, upcomingOnly])

  useEffect(() => {
    const found = orgList.find((value) => {
      return value.id === parseInt(orgId)
    })
    if (found) setCurrentOrg(found.name)
  }, [orgId])

  const aOrAn = () => {
    return organizationLabel.match(/^[aeiou]/i) ? 'an' : 'a'
  }
  const stateOptions = (
    <select
      name="states"
      className="form-control mb-2"
      value={usaState}
      onChange={(e) => setUsaState(e.target.value)}>
      <option>Choose a state below:</option>
      {usStates.map((value, key) => {
        return (
          <option key={`state-${key}`} value={value}>
            {value}
          </option>
        )
      })}
    </select>
  )

  const orgOptions = (
    <select
      name="organization"
      className="form-control"
      value={orgId}
      onChange={(e) => setOrgId(e.target.value)}>
      <option>
        Choose {aOrAn()} {organizationLabel} below:
      </option>
      {orgList.map((value) => {
        return (
          <option key={`org-${value.id}`} value={value.id}>
            {value.name}
          </option>
        )
      })}
    </select>
  )

  let tripOptions

  let firstOption = <option>Choose a trip below:</option>
  if (orgId == 0) {
    firstOption = (
      <option>
        Choose {aOrAn()} {organizationLabel} above
      </option>
    )
  } else if (tripList.length === 0) {
    firstOption = (
      <option>
        No {upcomingOnly ? 'upcoming' : null} trips found for {currentOrg}
      </option>
    )
  }

  const disabled = orgId == 0 || tripList.length == 0
  tripOptions = (
    <div>
      <select
        name="trip"
        disabled={disabled}
        className="form-control"
        value={tripId}
        onChange={(e) => setTripId(e.target.value)}>
        {firstOption}
        {tripList.map((value) => {
          return (
            <option key={`trip-${value.id}`} value={value.id}>
              {value.host}{' '}
              {dayjs(value.timeEventStarts * 1000).format('MMM D, YYYY')} (
              {value.approved == 1 ? 'Approved' : 'Not approved'})
            </option>
          )
        })}
      </select>
    </div>
  )
  return (
    <div>
      <div className="mb-3 text-center">
        <button
          className={`mr-2 btn ${upcomingOnly ? 'btn-success' : 'btn-danger'}`}
          onClick={() => {
            setUpcomingOnly(true)
          }}>
          Upcoming trips only
        </button>
        <button
          className={`btn ${upcomingOnly ? 'btn-danger' : 'btn-success'}`}
          onClick={() => {
            setUpcomingOnly(false)
          }}>
          Show all trips
        </button>
      </div>
      <table className="table">
        <tbody>
          <tr>
            <td>
              <div className="mb-2">{orgOptions}</div>
            </td>

            <td>
              <div>
                <button
                  disabled={disabled}
                  onClick={() => {
                    location.href = `./triptrack/Admin/Report/organization/?orgId=${orgId}`
                  }}
                  className="btn btn-primary">
                  <i className="fas fa-download"></i> {organizationLabel} member
                  list
                </button>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div>{tripOptions}</div>
            </td>

            <td>
              <div className="mb-2">
                <button
                  onClick={() =>
                    (location.href = `./triptrack/Admin/Report/trip/?tripId=${tripId}&upcomingOnly`)
                  }
                  disabled={disabled || tripId === 0}
                  className="btn btn-primary">
                  <i className="fas fa-download"></i> Trip member list
                </button>
              </div>
            </td>
          </tr>
          <tr>
            <td>{stateOptions}</td>
            <td>
              <button
                className="btn btn-primary mr-2"
                disabled={usaState.length == 0}
                onClick={() =>
                  (location.href = `./triptrack/Admin/Report/stateMembers/?state=${usaState}&upcomingOnly=${upcomingOnly}`)
                }>
                <i className="fas fa-download"></i>{' '}
                {upcomingOnly ? 'Upcoming' : 'All'} state trip members
              </button>
              <button
                className="btn btn-primary"
                disabled={usaState.length == 0}
                onClick={() =>
                  (location.href = `./triptrack/Admin/Report/stateTrips/?state=${usaState}&upcomingOnly=${upcomingOnly}`)
                }>
                <i className="fas fa-download"></i>{' '}
                {upcomingOnly ? 'Upcoming' : 'All'} state trips
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

ReactDOM.render(
  <Reports organizationLabel={organizationLabel} />,
  document.getElementById('Reports')
)
