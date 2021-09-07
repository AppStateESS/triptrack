'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import dayjs from 'dayjs'
import {patchApproval} from '../api/TripAjax'
import {faCheckCircle, faTimesCircle} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import SortButton from '../api/SortButton'

const approvedIcon = (approved, patch) => {
  return approved ? (
    <span className="text-success">
      <FontAwesomeIcon icon={faCheckCircle} size="lg" />
    </span>
  ) : (
    <button className="text-danger btn btn-link">
      <FontAwesomeIcon icon={faTimesCircle} size="lg" onClick={patch} />
    </button>
  )
}

const Grid = ({trips, deleteRow, hostLabel, load, setSort, sort}) => {
  const deleteItem = (key) => {
    if (
      prompt(
        'Are you certain you want to delete this trip?\nIf so, type DELETE below.'
      ) === 'DELETE'
    ) {
      deleteRow(key)
    }
  }

  const approveTrip = (tripId) => {
    if (
      confirm('Are you sure this trip meets all qualifications for approval?')
    ) {
      patchApproval(tripId).then(load)
    }
  }

  const rows = trips.map((value, key) => {
    return (
      <tr key={'gridrow-' + value.id}>
        <td>
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
                href={`triptrack/Admin/Trip/${value.id}`}
                title="View trip">
                <i className="fas fa-search"></i>&nbsp;View trip
              </a>
              <a
                className="dropdown-item"
                href={`triptrack/Admin/Member/?orgId=${value.organizationId}&tripId=${value.id}`}
                title="View members">
                <i className="fas fa-users"></i>&nbsp;Members
              </a>
              <a
                className="dropdown-item"
                href={`triptrack/Admin/Trip/emailMembers?orgId=${value.organizationId}&tripId=${value.id}`}
                title="Email members">
                <i className="fas fa-envelope"></i>&nbsp;Email
              </a>
              <a
                title="Edit trip"
                className="dropdown-item"
                href={'triptrack/Admin/Trip/' + value.id + '/edit'}>
                <i className="fas fa-edit"></i>&nbsp;Edit
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
        <td className="text-center">
          {approvedIcon(value.approved, () => approveTrip(value.id))}
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
            <td style={{width: '10%'}}></td>
            <th style={{width: '10%'}}>Approved?</th>
            <th>
              {hostLabel}{' '}
              <SortButton sort={sort} colName="host" handle={setSort} />
            </th>
            <th style={{width: '15%'}}>
              Departure date{' '}
              <SortButton
                sort={sort}
                colName="timeDeparting"
                handle={setSort}
              />
            </th>
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
  hostLabel: PropTypes.string,
  load: PropTypes.func,
  sort: PropTypes.object,
  setSort: PropTypes.func,
}

export default Grid
