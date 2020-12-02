'use strict'
import React, {useState, useRef} from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'

const Form = ({setFormReady, setSuccessFile}) => {
  const [uploadFile, setUploadFile] = useState({})
  const [message, setMessage] = useState('')
  const fileRef = useRef()

  const checkFile = () => {
    const form = new FormData()
    form.append('file', uploadFile.target.files[0])
    axios
      .post('./triptrack/Admin/Member/upload', form, {
        headers: {'Content-Type': 'multipart/form-data'},
      })
      .then((response) => {
        if (response.data.success) {
          setMessage('')
          setSuccessFile(response.data.file)
          setFormReady(true)
        } else {
          fileRef.current.value = ''
          setUploadFile({})
          setMessage('Problem with uploaded file: ' + response.data.error)
        }
      })
  }

  const button = () => {
    return uploadFile.target && uploadFile.target.files.length > 0 ? (
      <button className="btn btn-outline-dark" onClick={checkFile}>
        Upload CSV file
      </button>
    ) : null
  }

  return (
    <div>
      <p>
        To import members to TripTrack, you must upload a CSV file with either
        the following column headers (note the capitalization):
      </p>
      {message.length > 0 ? (
        <div className="alert alert-danger">{message}</div>
      ) : null}
      <table className="table">
        <tbody>
          <tr>
            <td>firstName</td>
            <td>lastName</td>
            <td>email</td>
            <td>phone</td>
            <td>bannerId</td>
            <td>username</td>
          </tr>
        </tbody>
      </table>
      <hr />
      <p>
        Alternatively, you may upload a CSV file with Banner ID numbers only
        (header not necessary).
      </p>
      <p>Any other file type or format will be rejected.</p>
      <div className="row">
        <div className="col-sm-6">
          <input
            type="file"
            className="form-control"
            onChange={setUploadFile}
            ref={fileRef}
          />
        </div>
        <div className="col-sm-6">{button()}</div>
      </div>
    </div>
  )
}

Form.propTypes = {setFormReady: PropTypes.func, setSuccessFile: PropTypes.func}

export default Form
