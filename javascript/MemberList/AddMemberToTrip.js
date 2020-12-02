'use strict'
import React, {useState} from 'react'
import PropTypes from 'prop-types'
import {createOptions} from '../Share/CreateOptions'

const AddMemberToTrip = ({member, tripList, addMember, organization}) => {
  const [tripId, setTripId] = useState(0)
  const tripOptions = createOptions(tripList, 'id', ['host', 'timeEventStarts'])
  return (
    <div className="container">
      <h3>
        Add&nbsp;
        {member.firstName} {member.lastName}&nbsp;to trip
      </h3>
      <div className="row">
        <div className="col-sm-6">
          <select
            name="tripId"
            value={tripId}
            className="form-control"
            onChange={(e) => {
              setTripId(parseInt(e.target.value))
            }}>
            <option value="0">Select trip below</option>
            {tripOptions}
          </select>
        </div>
        <div className="col-sm-6">
          <button
            className="btn btn-primary"
            onClick={() => addMember(organization.id, tripId)}>
            Join trip
          </button>
        </div>
      </div>
    </div>
  )
}

AddMemberToTrip.propTypes = {
  member: PropTypes.object,
  tripList: PropTypes.array,
  organization: PropTypes.object,
  addMember: PropTypes.func,
}

export default AddMemberToTrip
