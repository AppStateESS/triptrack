'use strict'
import React from 'react'
import PropTypes from 'prop-types'

const Grid = ({trips, deleteRow}) => {
  const deleteItem = (key) => {
    if (
      prompt(
        'Are you certain you want to delete this trip?\nIf so, type DELETE below.'
      ) === 'DELETE'
    ) {
      deleteRow(key)
    }
  }

  const deleteButton = (key) => {
    return (
      <button
        className="btn btn-sm btn-danger"
        onClick={() => {
          deleteItem(key)
        }}>
        Delete
      </button>
    )
  }

  const rows = trips.map((value, key) => {
    return (
      <tr key={'gridrow-' + key}>
        <td style={{width: '15%'}}>
          <a
            className="btn btn-sm btn-primary mr-1"
            href={'triptrack/Admin/Trip/' + value.id + '/edit'}>
            Edit
          </a>
          {deleteButton(key)}
        </td>
        <td>{value.submitName}</td>
        <td>{value.destinationCity}</td>
        <td>{value.memberCount}</td>
      </tr>
    )
  })

  return (
    <div>
      <table className="table table-striped">
        <tbody>
          <tr>
            <td></td>
            <th>Submitter</th>
            <th>Destination city</th>
            <th>Members</th>
          </tr>
          {rows}
        </tbody>
      </table>
    </div>
  )
}

Grid.propTypes = {
  trips: PropTypes.array,
  edit: PropTypes.func,
  deleteRow: PropTypes.func,
  deity: PropTypes.bool,
}

export default Grid
