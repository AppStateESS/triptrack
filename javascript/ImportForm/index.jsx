'use strict'
import React, {useState} from 'react'
import ReactDOM from 'react-dom'
import Form from './Form'
import axios from 'axios'

const ImportForm = () => {
  const [formReady, setFormReady] = useState(false)
  const [successFile, setSuccessFile] = useState('')
  const [importComplete, setImportComplete] = useState(false)
  const [importStats, setImportStats] = useState({errorRow: []})

  const importFile = () => {
    axios
      .post(
        './triptrack/Admin/Member/importFile',
        {fileName: successFile},
        {
          headers: {'X-Requested-With': 'XMLHttpRequest'},
        }
      )
      .then((response) => {
        setImportComplete(true)
        setImportStats(response.data.stats)
      })
  }

  let content

  let errorRowOutput = 'No errors'
  if (importStats.errorRow.length > 0) {
    return importStats.errorRow.map((value) => {
      return `${value}, `
    })
  }

  if (importComplete) {
    content = (
      <div>
        <div className="text-center alert alert-success lead">
          Import complete!
        </div>
        <h4>Stats</h4>
        <table className="table w-50">
          <tbody>
            <tr>
              <th>Total rows:</th>
              <td>{importStats.counting}</td>
            </tr>
            <tr>
              <th>Members added:</th>
              <td>{importStats.added}</td>
            </tr>
            <tr>
              <th>Previous members:</th>
              <td>{importStats.previousMember}</td>
            </tr>
            <tr>
              <th>Bad rows:</th>
              <td>{importStats.badRow}</td>
            </tr>
            <tr>
              <th>Rows with errors:</th>
              <td>{errorRowOutput}</td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  } else if (formReady) {
    content = (
      <div className="text-center">
        <p>Import file formatted correctly.</p>
        <button className="btn btn-success btn-lg" onClick={importFile}>
          Import members from uploaded file
        </button>
      </div>
    )
  } else {
    content = <Form {...{setFormReady, setSuccessFile}} />
  }
  return (
    <div>
      <h3>Import members</h3>
      {content}
    </div>
  )
}

ReactDOM.render(<ImportForm />, document.getElementById('ImportForm'))
