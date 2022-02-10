'use strict'
import React, {useState} from 'react'
import PropTypes from 'prop-types'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'

const MapList = ({
  memberList,
  checked,
  updateChecked,
  checkAll,
  setCheckAll,
  organizationLabel,
  orgId,
}) => {
  const [saving, setSaving] = useState(false)
  const rows = memberList.map((value, key) => {
    return (
      <tr key={`member-${value.bannerId}`}>
        <td>
          <input
            type="checkbox"
            className="form-control"
            name="members[]"
            value={value.bannerId}
            checked={checked.indexOf(key) !== -1}
            onChange={() => {
              updateChecked(key)
            }}
          />
        </td>
        <td>
          {value.lastName}, {value.firstName}
        </td>
        <td>{value.bannerId}</td>
        <td>{value.username}</td>
      </tr>
    )
  })

  let saveButton = (
    <button type="submit" className="btn btn-primary">
      Added checked members to {organizationLabel}
    </button>
  )
  if (saving) {
    saveButton = (
      <button type="button" className="btn btn-primary" disabled={true}>
        <FontAwesomeIcon icon="spinner" spin /> Saving members, please wait
      </button>
    )
  }

  return (
    <form
      onSubmit={() => setSaving(true)}
      method="post"
      action="./triptrack/Admin/Member/addListByOrganizationId">
      <input type="hidden" name="organizationId" value={orgId} />
      <div className="text-center mb-3">{saveButton}</div>
      <table className="table table-striped">
        <tbody>
          <tr>
            <th>
              <input
                type="checkbox"
                className="form-control"
                value="1"
                checked={checkAll}
                onChange={() => setCheckAll(!checkAll)}
              />
            </th>
            <th>Name</th>
            <th>Banner ID</th>
            <th>Username</th>
          </tr>
          {rows}
        </tbody>
      </table>
      <div className="text-center">{saveButton}</div>
    </form>
  )
}

MapList.propTypes = {
  memberList: PropTypes.array,
  checked: PropTypes.array,
  updateChecked: PropTypes.func,
  checkAll: PropTypes.PropTypes.bool,
  setCheckAll: PropTypes.func,
  organizationLabel: PropTypes.string,
  orgId: PropTypes.number,
  saving: PropTypes.bool,
}

export default MapList
