'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import '../api/pointer.css'

const Grid = ({organizations, edit, deleteRow, engageUrl}) => {
  const deleteItem = (key) => {
    if (
      prompt(
        'Are you certain you want to delete this organization?\nAll associated trips and members will be deleted as well.\nIf you are sure, type "DELETE" below.'
      ) === 'DELETE'
    ) {
      deleteRow(key)
    }
  }

  const rows = organizations.map((value, key) => {
    return (
      <tr key={'gridrow-' + key}>
        <td style={{width: '15%'}}>
          <div className="dropdown">
            <button
              className="btn btn-outline-dark dropdown-toggle btn-sm"
              type="button"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false">
              Options
            </button>
            <div className="dropdown-menu">
              <a
                className="dropdown-item"
                href={`triptrack/Admin/Organization/emailMembers?orgId=${value.id}`}
                title="Email members">
                <i className="fas fa-envelope"></i>&nbsp;Email
              </a>
              {value.engageId === 0 && (
                <a
                  title="Edit organization"
                  className="dropdown-item"
                  onClick={() => {
                    edit(value.id)
                  }}>
                  <i className="fas fa-edit"></i>&nbsp;Edit
                </a>
              )}
              {value.engageId > 0 && (
                <a
                  href={`triptrack/Admin/Engage/memberImport?orgId=${value.id}`}
                  title="Import Engage members"
                  className="dropdown-item">
                  <i className="fas fa-users"></i>&nbsp;Engage members
                </a>
              )}
              <a
                className="dropdown-item"
                href={`triptrack/Admin/Report/organization/?orgId=${value.id}`}
                title="Member report">
                <i className="fas fa-file-csv"></i>&nbsp;Member report
              </a>
              <a
                title="Delete trip"
                className="dropdown-item text-danger"
                onClick={() => {
                  deleteItem(key)
                }}>
                <i className="fas fa-trash"></i> Delete
              </a>
            </div>
          </div>
        </td>
        <td>{value.name}</td>
        <td>
          <a href={`${engageUrl}organization/${value.websiteKey}`}>
            {value.engageId}
          </a>
        </td>
        <td>{value.memberCount}</td>
      </tr>
    )
  })

  return (
    <div>
      <table className="table table-striped">
        <tbody>
          <tr>
            <th>&nbsp;</th>
            <th>Name</th>
            <th>Engage ID</th>
            <th>Members</th>
          </tr>
          {rows}
        </tbody>
      </table>
    </div>
  )
}

Grid.propTypes = {
  organizations: PropTypes.array,
  edit: PropTypes.func,
  deleteRow: PropTypes.func,
  engageUrl: PropTypes.string,
}

export default Grid
