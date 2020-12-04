'use strict'
import React from 'react'
import PropTypes from 'prop-types'

const Grid = ({members, edit, deleteRow, filter, add, tripsExist}) => {
  const deleteItem = (key) => {
    if (
      prompt(
        'Are you certain you want to delete this member?\nTheir membership in all trips will also be removed.\nIf you are sure, type "DELETE" below.'
      ) === 'DELETE'
    ) {
      deleteRow(members[key].id)
    }
  }

  const formatPhone = (value) => {
    var numbers = value.toString().replace(/\D/g, ''),
      char = {0: '(', 3: ') ', 6: '-'}
    value = ''
    for (var i = 0; i < numbers.length; i++) {
      value += (char[i] || '') + numbers[i]
    }
    return value
  }

  const deleteButton = (key) => {
    return (
      <button
        title="Delete member"
        className="btn btn-sm btn-danger mr-1"
        onClick={() => {
          deleteItem(key)
        }}>
        <i className="fas fa-trash"></i>
      </button>
    )
  }

  const rows = members.map((value, key) => {
    let addMemberButton
    if (filter.tripId === 0) {
      if (filter.orgId == 0) {
        addMemberButton = (
          <button
            className="btn btn-success btn-sm"
            title="Add to organization"
            onClick={() => add(key)}>
            <i className="fas fa-plus"></i>
          </button>
        )
      } else if (tripsExist) {
        addMemberButton = (
          <button
            className="btn btn-success btn-sm"
            title="Add to trip"
            onClick={() => {
              add(key)
            }}>
            <i className="fas fa-plus"></i>
          </button>
        )
      }
    }
    return (
      <tr key={'gridrow-' + key}>
        <td style={{width: '25%'}}>
          <button
            title="Edit member"
            className="btn btn-sm btn-primary mr-1"
            onClick={() => {
              edit(value.id)
            }}>
            <i className="fas fa-edit"></i>
          </button>
          {deleteButton(key)}
          {addMemberButton}
        </td>
        <td>
          {value.lastName}, {value.firstName}
        </td>
        <td>
          <a href={`mailto:${value.email}`}>{value.email}</a>
        </td>
        <td>{formatPhone(value.phone)}</td>
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
  tripsExist: PropTypes.bool,
}

export default Grid
