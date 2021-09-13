'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import {formatPhone} from '../api/String'
import SortButton from '../api/SortButton'
import '../api/pointer.css'
import {restrictMember, unrestrictMember} from '../api/MemberAjax'
import {faBan, faDoorOpen} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'

const Grid = ({
  members,
  edit,
  deleteRow,
  filter,
  add,
  tripsExist,
  tripApproved,
  dropMemberFromTrip,
  dropMemberFromOrg,
  selectedTripId,
  selectedOrgId,
  setSort,
  sort,
  load,
}) => {
  const deleteItem = (key) => {
    if (
      prompt(
        'Are you certain you want to delete this member?\nTheir membership in all trips will also be removed.\nIf you are sure, type "DELETE" below.'
      ) === 'DELETE'
    ) {
      deleteRow(members[key].id)
    }
  }

  const deleteOption = (key) => {
    return (
      <a
        title="Delete member"
        className="dropdown-item text-danger"
        onClick={() => {
          deleteItem(key)
        }}>
        <i className="fas fa-trash"></i> Delete member
      </a>
    )
  }

  const dropMemberOption = (key) => {
    if (selectedTripId > 0) {
      return (
        <a
          title="Drop from trip"
          className="dropdown-item"
          onClick={() => {
            if (tripApproved) {
              if (
                confirm(
                  'Are you sure you want to remove this member from an approved trip?'
                )
              ) {
                dropMemberFromTrip(members[key].id, selectedTripId)
              }
            } else {
              dropMemberFromTrip(members[key].id, selectedTripId)
            }
          }}>
          <i className="fas fa-user-times"></i> Drop from trip
        </a>
      )
    } else if (selectedOrgId > 0) {
      return (
        <a
          title="Drop from organization"
          className="dropdown-item"
          onClick={() => {
            dropMemberFromOrg(members[key].id, selectedOrgId)
          }}>
          <i className="fas fa-user-times"></i> Drop from organization
        </a>
      )
    }
  }

  const restrictOption = (key) => {
    if (members[key].restricted === 1) {
      return (
        <a
          className="dropdown-item"
          title="Restrict member"
          onClick={() => unrestrictMember(members[key].id).then(load)}>
          <FontAwesomeIcon icon={faDoorOpen} />
          &nbsp;Unrestrict
        </a>
      )
    } else {
      return (
        <a
          className="dropdown-item"
          title="Restrict member"
          onClick={() => restrictMember(members[key].id).then(load)}>
          <FontAwesomeIcon icon={faBan} />
          &nbsp;Restrict
        </a>
      )
    }
  }

  const addMemberOption = (key) => {
    let addMemberOption
    if (filter.tripId === 0) {
      if (filter.orgId == 0) {
        addMemberOption = (
          <a
            className="dropdown-item"
            title="Add to organization"
            onClick={() => add(key)}>
            <i className="fas fa-plus"></i> Add to organization
          </a>
        )
      } else if (tripsExist && members[key].restricted === 0) {
        addMemberOption = (
          <a
            className="dropdown-item"
            title="Add to trip"
            onClick={() => {
              add(key)
            }}>
            <i className="fas fa-plus"></i> Add to trip
          </a>
        )
      }
    }
    return addMemberOption
  }

  const rows = members.map((value, key) => {
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
              {addMemberOption(key)}
              {dropMemberOption(key)}
              <a
                title="Edit member"
                className="dropdown-item"
                onClick={() => {
                  edit(value.id)
                }}>
                <i className="fas fa-edit"></i> Edit member
              </a>
              {restrictOption(key)}
              {deleteOption(key)}
            </div>
          </div>
        </td>
        <td>
          <span className={value.restricted === 1 ? 'text-danger' : null}>
            {value.lastName}, {value.firstName}
          </span>
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
      <span className="text-danger small">
        Red names are restricted from joining trips.
      </span>
      <table className="table table-striped">
        <tbody>
          <tr>
            <td>&nbsp;</td>
            <th>
              Name{' '}
              <SortButton sort={sort} colName="lastName" handle={setSort} />
            </th>
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
  dropMemberFromTrip: PropTypes.func,
  dropMemberFromOrg: PropTypes.func,
  selectedTripId: PropTypes.number,
  selectedOrgId: PropTypes.number,
  tripApproved: PropTypes.bool,
  setSort: PropTypes.func,
  sort: PropTypes.object,
  load: PropTypes.func,
}

export default Grid
