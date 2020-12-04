'use strict'
import React, {useState} from 'react'
import PropTypes from 'prop-types'
import {createOptions} from '../Share/CreateOptions'

const MemberForm = ({
  member,
  update,
  close,
  saveMember,
  organizationList,
  formMessage,
  loadMember,
}) => {
  const [orgId, setOrgId] = useState(0)

  const selectAssociation = () => {
    if (member.id === 0) {
      if (organizationList.length > 0) {
        const options = createOptions(organizationList, 'id', 'name')
        options.unshift(
          <option key="no-opt" value="0">
            No association
          </option>
        )
        return (
          <select
            className="form-control"
            onChange={(e) => setOrgId(e.target.value)}>
            {options}
          </select>
        )
      } else {
        return <span></span>
      }
    }
  }

  const checkAndLoad = (bannerId) => {
    if (bannerId.length === 9) {
      loadMember(bannerId)
    }
    if (bannerId.length < 10) {
      update('bannerId', bannerId)
    }
  }

  let message
  if (formMessage) {
    message = (
      <div className="alert alert-primary text-center">{formMessage}</div>
    )
  }

  return (
    <div className="container">
      <h3 className="border-bottom pb-2 mb-3">
        {member.id > 0 ? 'Update' : 'Add'} member
      </h3>
      {message}
      <div className="row mb-3 form-group">
        <div className="col-6">
          <label>Banner ID</label>
          <input
            type="text"
            name="bannerId"
            className="form-control"
            value={member.bannerId}
            onChange={(e) => checkAndLoad(e.target.value)}
          />
        </div>
        <div className="col-6">
          <label>Username</label>
          <input
            type="text"
            name="username"
            className="form-control"
            value={member.username}
            onChange={(e) => update('username', e.target.value)}
          />
        </div>
        <div className="col-6">
          <label>First name</label>
          <input
            type="text"
            name="firstName"
            className="form-control"
            value={member.firstName}
            onChange={(e) => update('firstName', e.target.value)}
          />
        </div>
        <div className="col-6">
          <label>Last name</label>
          <input
            type="text"
            name="lastName"
            className="form-control"
            value={member.lastName}
            onChange={(e) => update('lastName', e.target.value)}
          />
        </div>
        <div className="col-6">
          <label>Email</label>
          <input
            type="text"
            name="email"
            className="form-control"
            value={member.email}
            onChange={(e) => update('email', e.target.value)}
          />
        </div>
        <div className="col-6">
          <label>Phone</label>
          <input
            type="text"
            name="phone"
            className="form-control"
            value={member.phone}
            onChange={(e) => update('phone', e.target.value)}
          />
        </div>
      </div>

      <div className="row">
        <div className="col-sm-8">{selectAssociation()}</div>
        <div className="col-sm-4">
          <button
            className="btn btn-primary mr-2"
            onClick={() => saveMember(orgId)}>
            Save
          </button>

          <button className="btn btn-danger" onClick={close}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

MemberForm.propTypes = {
  member: PropTypes.object,
  update: PropTypes.func,
  saveMember: PropTypes.func,
  close: PropTypes.func,
  organization: PropTypes.object,
  organizationList: PropTypes.array,
  formMessage: PropTypes.element,
  loadMember: PropTypes.func,
}

export default MemberForm
