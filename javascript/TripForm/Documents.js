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
}) => {
  let currentFiles
  if (documents.length > 0) {
    const filelist = documents.map((value, key) => {
      return (
        <div key={`document-${value.id}`}>
          <span
            className="pointer badge badge-danger"
            onClick={() => {
              removeDocument(value.id, 'Admin').then(() => {
                documents.splice(key, 1)
                setDocuments([...documents])
              })
            }}>
            <i className="fas fa-times"></i>
          </span>{' '}
          {value.filePath}
        </div>
      )
    })
    currentFiles = (
      <div className="border-top mt-4 pt-2">
        <h4>Current files</h4>
        {filelist}
      </div>
    )
  }
  const uploadForm = allowUpload ? (
    <Upload
      {...{uploadRequired, uploadInstructions, tripId, setDocuments, documents}}
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
}

export default Documents
