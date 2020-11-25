'use strict'
import React from 'react'
import PropTypes from 'prop-types'

const Grid = ({members, edit, deleteRow, filter, add}) => {
  const deleteItem = (key) => {
    if (
      prompt(
        'Are you certain you want to delete this member?\nTheir membership in all trips will also be removed.\nIf you are sure, type "DELETE" below.'
      ) === 'DELETE'
    ) {
      deleteRow(members[key].id)
    }
  }

  const deleteButton = (key) => {
    return (
      <button
        className="btn btn-sm btn-danger mr-1"
        onClick={() => {
          deleteItem(key)
        }}>
        Delete
      </button>
    )
  }

  const rows = members.map((value, key) => {
    let addMember
    if (filter.tripId === 0) {
      if (filter.orgId == 0) {
        addMember = (
          <button className="btn btn-success btn-sm" onClick={() => add(key)}>
            Add to Org
          </button>
        )
      } else {
        addMember = (
          <button
            className="btn btn-success btn-sm"
            onClick={() => {
              add(key)
            }}>
            Add to trip
          </button>
        )
      }
    }
    return (
      <tr key={'gridrow-' + key}>
        <td style={{width: '25%'}}>
          <button
            className="btn btn-sm btn-primary mr-1"
            onClick={() => {
              edit(value.id)
            }}>
            Edit
          </button>
          {deleteButton(key)}
          {addMember}
        </td>
        <td>
          {value.lastName}, {value.firstName}
        </td>
        <td>
          <a href={`mailto:${value.email}`}>{value.email}</a>
        </td>
        <td>{value.phone}</td>
      </tr>
    )
  })

  return (
    <div>
      <table className="table table-striped">
        <tbody>
          <tr>
            <td>&nbsp;</td>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
          </tr>
          {rows}
        </tbody>
      </table>
    </div>
  )
}

Grid.propTypes = {
  members: PropTypes.array,
  edit: PropTypes.func,
  deleteRow: PropTypes.func,
  filter: PropTypes.object,
  add: PropTypes.func,
}

export default Grid
