'use strict'
import React, {useState, useEffect} from 'react'
import ReactDOM from 'react-dom'

const ImportForm = () => {
  return (
    <div>
      <h2>Import members</h2>
      <p>
        To import members to TripTrack, you must upload a CSV file with the
        following column headers:
      </p>
      <table className="table table-bordered">
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
      <p>A file without these headers will be refused.</p>
      <div className="row">
        <div className="col-sm-6">
          <input type="file" className="form-control" />
        </div>
        <div className="col-sm-6">
          <button className="btn btn-outline-dark" onClick={() => {}}>
            Upload CSV file
          </button>
        </div>
      </div>
    </div>
  )
}

ReactDOM.render(<ImportForm />, document.getElementById('ImportForm'))
