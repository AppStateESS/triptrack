'use strict'
import React, {useState} from 'react'
import PropTypes from 'prop-types'
import {createOptions} from '../Share/CreateOptions'

const AddMemberToOrg = ({member, organizationList, addMember}) => {
  const [orgId, setOrgId] = useState(0)
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
          <button className="btn btn-primary" onClick={() => addMember(orgId)}>
            Join organization
          </button>
        </div>
      </div>
    </div>
  )
}

AddMemberToOrg.propTypes = {
  member: PropTypes.object,
  organizationList: PropTypes.array,
  addMember: PropTypes.function,
}

export default AddMemberToOrg
