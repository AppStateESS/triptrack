'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import dayjs from 'dayjs'
import {faCheckCircle, faTimesCircle} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'

const approvedIcon = (approved) => {
  return approved ? (
    <span className="text-success">
      <FontAwesomeIcon icon={faCheckCircle} size="lg" />
    </span>
  ) : (
    <span className="text-danger">
      <FontAwesomeIcon icon={faTimesCircle} size="lg" />
    </span>
  )
}

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
        title="Delete trip"
        className="btn btn-sm btn-danger"
        onClick={() => {
          deleteItem(key)
        }}>
        <i className="fas fa-trash"></i>
      </button>
    )
  }

  const rows = trips.map((value, key) => {
    return (
      <tr key={'gridrow-' + value.id}>
        <td style={{width: '15%'}}>
          <a
            title="View members"
            className="btn btn-success btn-sm mr-1"
            href={`triptrack/Admin/Member/?orgId=${value.organizationId}&tripId=${value.id}`}>
            <i className="fas fa-users"></i>
          </a>
          <a
            title="Edit trip"
            className="btn btn-sm btn-primary mr-1"
            href={'triptrack/Admin/Trip/' + value.id + '/edit'}>
            <i className="fas fa-edit"></i>
          </a>
          {deleteButton(key)}
        </td>
        <td className="text-center" style={{width: '10%'}}>
          {approvedIcon(value.approved)}
        </td>
        <td>
          <a href={`./triptrack/Admin/Trip/${value.id}`}>{value.host}</a>
        </td>
        <td>{dayjs(value.timeDeparting * 1000).format('MMM D, YYYY ')}</td>
        <td>
          {value.destinationCity}, {value.destinationState}
        </td>
        <td className="text-right">{value.memberCount}</td>
      </tr>
    )
  })

  return (
    <div>
      <table className="table table-striped">
        <tbody>
          <tr>
            <td></td>
            <th>Approved?</th>
            <th>Host</th>
            <th>Departure date</th>
            <th>City, State</th>
            <th className="text-right">Members</th>
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
