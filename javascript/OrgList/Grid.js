'use strict'
import React from 'react'
import PropTypes from 'prop-types'

const Grid = ({organizations, edit, deleteRow, deity = false}) => {
  const deleteItem = (key) => {
    if (
      prompt(
        'Are you certain you want to delete this organization?\nAll associated trips and members will be deleted as well.\nIf you are sure, type "DELETE" below.'
      ) === 'DELETE'
    ) {
      deleteRow(key)
    }
  }

  const deleteButton = (key) => {
    if (deity === false) {
      return <span></span>
    } else {
      return (
        <button
          title="Delete organization"
          className="btn btn-sm btn-danger"
          onClick={() => {
            deleteItem(key)
          }}>
          <i className="fas fa-trash"></i>
        </button>
      )
    }
  }

  const rows = organizations.map((value, key) => {
    return (
      <tr key={'gridrow-' + key}>
        <td style={{width: '20%'}}>
          <a
            title="Members list"
            href={`./triptrack/Admin/Member/?orgId=${value.id}`}
            className="btn btn-sm mr-1 btn-success">
            <i className="fas fa-users"></i>
          </a>
          <button
            title="Edit organization"
            className="btn btn-sm btn-primary mr-1"
            onClick={() => {
              edit(value.id)
            }}>
            <i className="fas fa-edit"></i>
          </button>
          {deleteButton(key)}
        </td>
        <td>{value.name}</td>
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
  deity: PropTypes.bool,
}

export default Grid
