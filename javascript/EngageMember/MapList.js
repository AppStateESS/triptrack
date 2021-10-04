'use strict'
import React from 'react'
import PropTypes from 'prop-types'

const MapList = ({
  memberList,
  checked,
  updateChecked,
  checkAll,
  setCheckAll,
  organizationLabel,
  orgId,
}) => {
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

  return (
    <form
      method="post"
      action="./triptrack/Admin/Member/addListByOrganizationId">
      <input type="hidden" name="organizationId" value={orgId} />
      <div className="text-center">
        <button type="submit" className="btn btn-primary mb-2">
          Added checked members to {organizationLabel}
        </button>
      </div>
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
      <div className="text-center">
        <button type="submit" className="btn btn-primary">
          Added checked members to {organizationLabel}
        </button>
      </div>
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
}

export default MapList
