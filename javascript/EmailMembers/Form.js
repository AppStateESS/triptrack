'use strict'
import React, {useState} from 'react'
import PropTypes from 'prop-types'
import {postItem} from '../api/Fetch'
import Overlay from '@essappstate/canopy-react-overlay'

const Form = ({orgId, tripId, memberCount}) => {
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [finished, setFinished] = useState(false)

  const sendEmail = (data) => {
    if (
      confirm(
        `Are you sure you want to send emails to ${data.memberCount} member(s)?`
      )
    ) {
      postItem(data, 'Email', 'Admin').then(() => {
        setFinished(true)
        setTimeout(() => {
          if (tripId > 0) {
            location.href = './triptrack/Admin/Trip/'
          } else {
            location.href = './triptrack/Admin/Organization/'
          }
        }, 3000)
      })
    }
  }

  return (
    <div>
      <Overlay show={finished} width="500px" title="Email sent">
        <p>Your message has been sent. Sending you back to the list.</p>
      </Overlay>
      <hr />
      <div className="row mb-3">
        <div className="col-sm-2">
          <strong>Subject:</strong>
        </div>
        <div className="col-sm-10">
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              name="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-sm-2">
          <strong>Message:</strong>
        </div>
        <div className="col-sm-10">
          <textarea
            name="message"
            style={{height: '200px'}}
            className="form-control"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
      </div>
      <button
        disabled={subject.length === 0 || message.length === 0}
        className="btn btn-primary btn-block"
        onClick={() =>
          sendEmail({subject, message, orgId, tripId, memberCount})
        }>
        Send email
      </button>
    </div>
  )
}

Form.propTypes = {
  send: PropTypes.func,
  orgId: PropTypes.number,
  tripId: PropTypes.number,
  memberCount: PropTypes.number,
}

export default Form
