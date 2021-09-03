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

  useEffect(() => {
    getList('./triptrack/Admin/Organization/').then((response) => {
      setOrgList(response.data)
    })
  }, [])

  const loadTrips = () => {
    getList('./triptrack/Admin/Trip/').then((response) => {
      setTripList(response.data)
    })
  }

  useEffect(() => {
    if (orgId == 0) {
      setTripId(0)
    } else {
      loadTrips()
    }
  }, [orgId])

  const orgOptions = (
    <div className="col-sm-6">
      <div className="mb-2">
        <select
          name="organization"
          className="form-control"
          value={orgId}
          onChange={(e) => setOrgId(e.target.value)}>
          <option>Choose a {organizationLabel} below:</option>
          {orgList.map((value) => {
            return (
              <option key={`org-${value.id}`} value={value.id}>
                {value.name}
              </option>
            )
          })}
        </select>
      </div>

      {orgId > 0 ? (
        <div className="text-center">
          <a
            href={`./triptrack/Admin/Report/organization/?orgId=${orgId}`}
            className="btn btn-primary">
            Get {organizationLabel} member list
          </a>
        </div>
      ) : null}
    </div>
  )

  let tripOptions

  if (orgId > 0) {
    tripOptions = (
      <div className="col-sm-6">
        <div className="mb-2">
          <select
            name="trip"
            className="form-control"
            value={tripId}
            onChange={(e) => setTripId(e.target.value)}>
            <option>Choose a trip below:</option>
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
        {tripId > 0 ? (
          <div className="text-center">
            <a
              href={`./triptrack/Admin/Report/trip/?tripId=${tripId}`}
              className="btn btn-primary">
              Get trip member list
            </a>
          </div>
        ) : null}
      </div>
    )
  }
  return (
    <div className="row">
      {orgOptions}
      {tripOptions}
    </div>
  )
}

ReactDOM.render(
  <Reports organizationLabel={organizationLabel} />,
  document.getElementById('Reports')
)
