'use strict'
import React, {useState, useEffect} from 'react'
import ReactDOM from 'react-dom'
import Form from './Form'
import OrgTripSelect from '../Share/OrgTripSelect'
import {getList} from '../api/Fetch'
import axios from 'axios'
import 'regenerator-runtime'

const loadOrganizationList = async () => {
  const response = await getList('./triptrack/Admin/Organization')
  return response
}

const loadTrips = async (orgId) => {
  if (orgId > 0) {
    const response = await getList('./triptrack/Admin/Trip', {
      orgId,
    })
    return response
  }
}

const ImportForm = () => {
  const [formReady, setFormReady] = useState(false)
  const [successFile, setSuccessFile] = useState('')
  const [importComplete, setImportComplete] = useState(false)
  const [importStats, setImportStats] = useState({errorRow: []})
  const [filter, setFilter] = useState({orgId: 0, tripId: 0})
  const [organizations, setOrganizations] = useState([])
  const [trips, setTrips] = useState([])

  useEffect(async () => {
    const response = await loadOrganizationList()
    setOrganizations(response.data)
  }, [])

  useEffect(async () => {
    if (filter.orgId > 0) {
      const response = await loadTrips(filter.orgId)
      setTrips(response.data)
    }
  }, [filter.orgId])

  const importFile = () => {
    axios
      .post(
        './triptrack/Admin/Member/importFile',
        {fileName: successFile, orgId: filter.orgId, tripId: filter.tripId},
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
  const errorsFound = importStats.errorRow.length
  if (errorsFound > 0) {
    errorRowOutput = importStats.errorRow.map((value, key) => {
      const comma = key > 0 ? ', ' : ''
      return `${value}${comma} `
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
              <th>Restricted from trips:</th>
              <td>{importStats.restrictedTrip}</td>
            </tr>
            <tr>
              <th>Rows with errors:</th>
              <td>{errorRowOutput}</td>
            </tr>
          </tbody>
        </table>
        <p>
          <a
            href="./triptrack/Admin/Member/"
            className="btn btn-outline-success mr-2">
            Back to member list
          </a>
          <a
            href="./triptrack/Admin/Member/import"
            className="btn btn-outline-primary">
            Import more members
          </a>
        </p>
      </div>
    )
  } else if (formReady) {
    content = (
      <div className="text-center">
        <p className="alert alert-success lead">
          Import file formatted correctly!
        </p>

        <p>Upload the students into a specific organization or trip below.</p>
        <OrgTripSelect
          {...{filter, setFilter, organizations, trips, loadTrips}}
        />

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
