'use strict'
import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import {createOptions} from '../Share/CreateOptions'

const OrgTripSelect = ({filter, setFilter, organizations, trips}) => {
  const [tripOptions, setTripOptions] = useState([])
  const [orgOptions, setOrgOptions] = useState([])

  useEffect(() => {
    if (organizations.length > 0) {
      setTripOptions(createOptions(trips, 'id', ['host', 'timeEventStarts']))
    }
  }, [trips])

  useEffect(() => {
    setOrgOptions(createOptions(organizations, 'id', 'name'))
  }, [organizations])

  const updateFilter = (orgId, tripId) => {
    setFilter({orgId, tripId})
  }

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
          value={filter.orgId}
          className="form-control"
          onChange={(e) => {
            updateFilter(parseInt(e.target.value), 0)
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
            value={filter.tripId}
            onChange={(e) =>
              updateFilter(filter.orgId, parseInt(e.target.value))
            }>
            <option value="0">Select trip below</option>
            {tripOptions}
          </select>
        </div>
      )
    }
    content = (
      <div className="row p-2 mb-3">
        {orgSelect}
        {tripSelect}
        <button
          className="btn btn-default"
          onClick={() => {
            updateFilter(0, 0)
          }}>
          Reset
        </button>
      </div>
    )
  }

  return <div>{content}</div>
}

OrgTripSelect.propTypes = {
  setFilter: PropTypes.func,
  filter: PropTypes.object,
  organizations: PropTypes.array,
  trips: PropTypes.array,
  loadTrips: PropTypes.func,
}

export default OrgTripSelect
