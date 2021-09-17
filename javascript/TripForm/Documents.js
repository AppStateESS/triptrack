'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import Upload from './Upload'
import {removeDocument} from '../api/TripAjax'
import '../api/pointer.css'

const Documents = ({
  documents,
  setDocuments,
  allowUpload,
  tripId,
  uploadRequired,
  uploadInstructions,
  role,
  completed,
}) => {
  const dropDocument = (document, key) => {
    removeDocument(document.id, role).then(() => {
      documents.splice(key, 1)
      setDocuments([...documents])
    })
  }

  const canDelete =
    uploadRequired === false || documents.length > 1 || !completed
  let currentFiles
  if (documents.length > 0) {
    const filelist = documents.map((value, key) => {
      return (
        <div key={`document-${value.id}`}>
          {canDelete ? (
            <span
              className="pointer badge badge-danger mr-2"
              onClick={() => dropDocument(value, key)}>
              <i className="fas fa-times"></i>
            </span>
          ) : null}
          {value.filePath}
        </div>
      )
    })
    currentFiles = (
      <div className="border-top mt-4 pt-2">
        <div className="border-bottom mb-3">
          <h4 className="mb-0">Current files</h4>
          {!canDelete ? (
            <div className="small text-danger">
              Trip requires at least one file.
            </div>
          ) : null}
        </div>
        {filelist}
      </div>
    )
  }
  const uploadForm = allowUpload ? (
    <Upload
      {...{
        uploadRequired,
        uploadInstructions,
        tripId,
        setDocuments,
        documents,
        role,
      }}
    />
  ) : null
  return (
    <div>
      {uploadForm}
      {currentFiles}
    </div>
  )
}

Documents.propTypes = {
  documents: PropTypes.array,
  tripId: PropTypes.number,
  allowUpload: PropTypes.bool,
  uploadRequired: PropTypes.bool,
  uploadInstructions: PropTypes.string,
  setDocuments: PropTypes.func,
  role: PropTypes.string,
  completed: PropTypes.bool,
}

export default Documents
