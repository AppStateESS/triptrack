'use strict'
import React, {useState} from 'react'
import PropTypes from 'prop-types'
import {addAttendeeList} from '../api/MemberAjax'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'

const Attended = ({newMembers, setAttendedModal, memberLoad, orgId}) => {
  if (newMembers.length === 0) {
    return <div>No members</div>
  }

  const [saving, setSaving] = useState(false)
  const [attendees, setAttendees] = useState([])
  const [toggleAll, setToggleAll] = useState(false)
  const [error, setError] = useState(false)

  const toggleAllAttendee = () => {
    const resetAttendees = []
    if (!toggleAll) {
      newMembers.forEach((value) => {
        resetAttendees.push(value.bannerId)
      })
    }
    setAttendees(resetAttendees)
    setToggleAll(!toggleAll)
  }

  const toggleMember = (bannerId) => {
    const banIdx = attendees.indexOf(bannerId)
    if (banIdx === -1) {
      attendees.push(bannerId)
    } else {
      attendees.splice(banIdx, 1)
    }
    setAttendees([...attendees])
  }

  const addAttendees = () => {
    setSaving(true)
    addAttendeeList(attendees, orgId)
      .then(() => {
        memberLoad()
        setAttendedModal(false)
      })
      .catch(() => {
        setSaving(false)
        setError(true)
      })
  }
  return (
    <div>
      <p>
        Some participants of this event are not members of this organization.
      </p>
      <button className="btn btn-primary btn-sm" onClick={toggleAllAttendee}>
        Toggle all
      </button>
      <hr />
      <ul className="list-unstyled">
        {newMembers.map((member) => {
          return (
            <li key={member.bannerId}>
              <label>
                <input
                  type="checkbox"
                  name="attendees"
                  value={member.bannerId}
                  checked={attendees.indexOf(member.bannerId) !== -1}
                  onChange={() => toggleMember(member.bannerId)}
                />{' '}
                {member.email}
              </label>
            </li>
          )
        })}
      </ul>
      {saving ? (
        <div>
          <FontAwesomeIcon icon="spinner" spin />
          &nbsp; Saving attendees...
        </div>
      ) : (
        <div>
          <button
            className="btn btn-success mr-3"
            disabled={error}
            onClick={addAttendees}>
            Add these attendees to the organization
          </button>
          <button
            className="btn btn-danger"
            onClick={() => {
              setAttendedModal(false)
            }}>
            Ignore attendees
          </button>
          {error && (
            <div className="alert alert-danger mt-3">
              Sorry, an error occurred during the update.
            </div>
          )}
        </div>
      )}
    </div>
  )
}

Attended.propTypes = {
  newMembers: PropTypes.array,
  setAttendedModal: PropTypes.func,
  memberLoad: PropTypes.func,
  orgId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}

export default Attended
