'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import dayjs from 'dayjs'

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
        <td style={{width: '20%'}}>
          <a
            className="btn btn-success btn-sm mr-1"
            href={`triptrack/Admin/Member/?orgId=${value.organizationId}&tripId=${value.id}`}>
            Members
          </a>
          <a
            className="btn btn-sm btn-primary mr-1"
            href={'triptrack/Admin/Trip/' + value.id + '/edit'}>
            Edit
          </a>
          {deleteButton(key)}
        </td>
        <td>{value.host}</td>
        <td>
          {dayjs(value.timeDeparting * 1000).format('h:mma, MMM D, YYYY ')}
        </td>
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
            <th>Host</th>
            <th>Departure date</th>
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
