'use strict'
import React, {useState, useRef} from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'

const Upload = ({
  uploadRequired,
  uploadInstructions,
  tripId,
  setDocuments,
  documents,
}) => {
  const [uploadFile, setUploadFile] = useState({})
  const [message, setMessage] = useState('')
  const fileRef = useRef()

  const send = () => {
    const form = new FormData()
    if (uploadFile.target === undefined) {
      return
    }
    const file = uploadFile.target.files[0]

    form.append('file', file)
    form.append('tripId', tripId)
    axios
      .post('./triptrack/Admin/Document/upload', form, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-Requested-With': 'XMLHttpRequest',
        },
      })
      .then((response) => {
        if (response.data.success) {
          const copyDoc = [...documents]
          copyDoc.push(response.data.document)
          setDocuments(copyDoc)
          setMessage('')
        } else {
          fileRef.current.value = ''
          setUploadFile({})
          setMessage('Problem with uploaded file: ' + response.data.error)
        }
      })
  }

  return (
    <div>
      <h3>Upload documents</h3>
      {uploadRequired && documents.length === 0 ? (
        <p className="text-danger">
          You are required to upload one or more documents for this trip.
        </p>
      ) : (
        <p>You may upload one or more document pertaining to this trip.</p>
      )}
      <p>{uploadInstructions}</p>
      {message.length > 0 ? (
        <div className="alert alert-danger">{message}</div>
      ) : null}
      <div className="row">
        <div className="col-sm-9">
          <input
            type="file"
            name="upload"
            className="form-control"
            onChange={setUploadFile}
          />
        </div>
        <div className="col-sm-3">
          <button type="button" className="btn btn-primary" onClick={send}>
            Upload
          </button>
        </div>
      </div>
    </div>
  )
}

Upload.propTypes = {
  uploadRequired: PropTypes.bool,
  uploadInstructions: PropTypes.string,
  tripId: PropTypes.number,
  setDocuments: PropTypes.func,
  documents: PropTypes.array,
}

export default Upload
