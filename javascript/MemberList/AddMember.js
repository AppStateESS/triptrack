'use strict'
import React, {useState} from 'react'
import PropTypes from 'prop-types'
import {createOptions} from '../Share/CreateOptions'

const AddMember = ({member, organizationList, tripList}) => {
  const [orgId, setOrgId] = useState(0)
  const [tripId, setTripId] = useState(0)
  const orgOptions = createOptions(organizationList, 'id', 'name')
  return (
    <div className="container">
      <h3>
        Add&nbsp;
        {member.firstName} {member.lastName}&nbsp;to organization
      </h3>
      <div className="row">
        <div className="col-sm-6">
          <select
            name="orgId"
            value={orgId}
            className="form-control"
            onChange={(e) => {
              setOrgId(parseInt(e.target.value))
            }}>
            <option value="0">Select organization below</option>
            {orgOptions}
          </select>
        </div>
        <div className="col-sm-6">
          <button
            className="btn btn-primary"
            onClick={() => addMember(orgId, tripId)}>
            Join {tripId > 0 ? 'trip' : 'organization'}
          </button>
        </div>
      </div>
    </div>
  )
}

AddMember.propTypes = {member: PropTypes.object}

export default AddMember
