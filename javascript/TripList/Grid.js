'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import dayjs from 'dayjs'
import {faCheckCircle, faTimesCircle} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'

import SortButton from '../api/SortButton'
import '../api/pointer.css'

const approvedIcon = (approved, tripId) => {
  return approved ? (
    <span className="text-success">
      <FontAwesomeIcon icon={faCheckCircle} size="lg" />
    </span>
  ) : (
    <button className="btn btn-link">
      <a
        href={`triptrack/Admin/Trip/${tripId}`}
        title="View trip"
        className="text-danger">
        <FontAwesomeIcon icon={faTimesCircle} size="lg" />
      </a>
    </button>
  )
}

const Grid = ({trips, deleteRow, hostLabel, setSort, sort, tripCopy}) => {
  const deleteItem = (key) => {
    if (
      prompt(
        'Are you certain you want to delete this trip?\nIf so, type DELETE in all caps below.'
      ) === 'DELETE'
    ) {
      deleteRow(key)
    }
  }

  const rows = trips.map((value, key) => {
    return (
      <tr key={'gridrow-' + value.id}>
        <td>
          <div className="dropdown">
            <button
              className="btn btn-outline-dark dropdown-toggle btn-sm"
              data-boundary="viewport"
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
                href={`./triptrack/Admin/Trip/${value.id}/assign`}
                title="Assign members">
                <i className="fas fa-user-check"></i>&nbsp;Assign members
              </a>
              <a
                className="dropdown-item"
                onClick={() => tripCopy(value.id)}
                title="Copy trip">
                <i className="fas fa-copy"></i>&nbsp;Copy trip
              </a>
              <a
                title="Edit trip"
                className="dropdown-item"
                href={'triptrack/Admin/Trip/' + value.id + '/edit'}>
                <i className="fas fa-edit"></i>&nbsp;Edit
              </a>
              <a
                className="dropdown-item"
                href={`triptrack/Admin/Report/trip/?tripId=${value.id}`}
                title="Member report">
                <i className="fas fa-users"></i>&nbsp;Member report
              </a>
              <a
                className="dropdown-item"
                href={`triptrack/Admin/Trip/emailMembers?orgId=${value.organizationId}&tripId=${value.id}`}
                title="Email members">
                <i className="fas fa-envelope"></i>&nbsp;Email
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
          {approvedIcon(value.approved, value.id)}
        </td>
        <td>
          <a href={`./triptrack/Admin/Trip/${value.id}`}>{value.host}</a>
        </td>
        <td>{dayjs(value.timeDeparting * 1000).format('MMM D, YYYY ')}</td>
        <td>
          {value.destinationCity}, {value.destinationState}
        </td>
        <td className="text-right">
          <a
            href={`./triptrack/Admin/Trip/${value.id}/assign`}
            className={
              value.membercount === 0
                ? 'btn btn-outline-danger'
                : 'btn btn-outline-primary'
            }>
            {value.memberCount}
          </a>
        </td>
      </tr>
    )
  })

  return (
    <div>
      <table className="table table-striped table-responsive">
        <tbody>
          <tr>
            <td style={{width: '10%'}}></td>
            <th style={{width: '5%'}}>Approved?</th>
            <th>
              {hostLabel}{' '}
              <SortButton sort={sort} colName="host" handle={setSort} />
            </th>
            <th style={{width: '20%'}}>
              Departure date{' '}
              <SortButton
                sort={sort}
                colName="timeDeparting"
                handle={setSort}
              />
            </th>
            <th style={{width: '20%'}}>City, State</th>
            <th className="text-right" style={{width: '5%'}}>
              Members
            </th>
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
  role: PropTypes.string,
  reload: PropTypes.func,
}

export default Grid
