'use strict'
import React, {useState, useEffect, useRef} from 'react'
import PropTypes from 'prop-types'
import {getList} from '../api/Fetch'
import {createOptions} from '../Share/CreateOptions'
import 'regenerator-runtime'

const OrgTripSelect = ({orgId, tripId, setOrgId, setTripId}) => {
  const [organizations, setOrganizations] = useState([])
  const [trips, setTrips] = useState([])
  const [tripOptions, setTripOptions] = useState([])
  const [orgOptions, setOrgOptions] = useState([])

  const loadOrganizations = async () => {
    const response = await getList('./triptrack/Admin/Organization')
    setOrganizations(response)
    loadTrips()
  }
  const loadTrips = async () => {
    const response = await getList('./triptrack/Admin/Trip')
    setTrips(response)
  }

  useEffect(() => {
    loadOrganizations()
  }, [])

  useEffect(() => {
    if (organizations.length > 0) {
      setTripOptions(createOptions(trips, 'id', 'host'))
    }
  }, [trips])

  useEffect(() => {
    setOrgOptions(createOptions(organizations, 'id', 'name'))
  }, [organizations])

  useEffect(() => {
    const response = getList('./triptrack/Admin/Organization')
    setOrganizations(response)
  }, [])

  let content
  if (organizations.length === 0) {
    content = (
      <div className="alert alert-warning text-center p-1">
        <a href="./triptrack/Admin/Organization/">No organizations created.</a>
      </div>
    )
  } else {
    const orgSelect = (
      <div className="col-sm-4">
        <select
          name="orgId"
          value={orgId}
          className="form-control"
          onChange={(e) => {
            const orgId = parseInt(e.target.value)
            setOrgId(orgId)
          }}>
          <option value="0">Select organization below</option>
          {orgOptions}
        </select>
      </div>
    )
    let tripSelect
    if (trips.length > 0) {
      tripSelect = (
        <div className="col-4">
          <select
            name="tripId"
            className="form-control"
            value={tripId}
            onChange={(e) => setTripId(parseInt(e.target.value))}>
            <option value="0">Select trip below</option>
            {tripOptions}
          </select>
        </div>
      )
    }
    content = (
      <div className="row border border-primary p-2 mb-3">
        <div className="col-sm-2">Search by:</div>
        {orgSelect}
        {tripSelect}
      </div>
    )
  }

  return <div>{content}</div>
}

OrgTripSelect.propTypes = {
  orgId: PropTypes.number,
  tripId: PropTypes.number,
  setOrgId: PropTypes.func,
  setTripId: PropTypes.func,
}

export default OrgTripSelect
