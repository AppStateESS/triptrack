'use strict'
import React, {useState, useEffect} from 'react'
import ReactDOM from 'react-dom'
import Grid from './Grid'
import Menu from './Menu'
import Message from '../Share/Message'
import {getList} from '../api/Fetch'
import axios from 'axios'

const TripList = () => {
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState('danger')
  const [search, setSearch] = useState('')
  const [unapprovedOnly, setUnapprovedOnly] = useState(false)

  useEffect(() => {
    load()
  }, [])

  useEffect(() => {
    load()
  }, [unapprovedOnly])

  const load = async (useSearch = true) => {
    setLoading(true)
    setTrips([])
    const options = {search: useSearch ? search : '', unapprovedOnly}
    let response = await getList('./triptrack/Admin/Trip/', options)
    if (response === false) {
      setMessage('Error: could not load trip list')
      setMessageType('danger')
      setLoading(false)
    } else {
      setTrips(response)
      setLoading(false)
    }
  }
  const sendSearch = () => {
    load()
  }

  const resetSearch = () => {
    setSearch('')
    load(false)
  }

  const deleteRow = (key) => {
    const trip = trips[key]
    const url = 'triptrack/Admin/Trip/' + trip.id
    axios({
      method: 'delete',
      url,
      timeout: 3000,
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
      },
    })
      .then(() => {
        load()
      })
      .catch((error) => {
        console.log('Error:', error)
      })
  }

  const update = () => {}

  if (loading) {
    return <div>Loading trips...</div>
  } else if (trips.length === 0) {
    let emptyMessage = (
      <span>No {unapprovedOnly ? 'unapproved' : ''} trips found.</span>
    )

    if (search.length > 0) {
      emptyMessage = (
        <span>
          No {unapprovedOnly ? 'unapproved' : ''} trips found with for search
          query: <strong>{search}</strong>.
        </span>
      )
    }
    return (
      <div>
        <Menu
          {...{
            search,
            setSearch,
            sendSearch,
            resetSearch,
            setUnapprovedOnly,
            unapprovedOnly,
          }}
        />
        <Message message={message} type={messageType} />
        <p>{emptyMessage}</p>
      </div>
    )
  } else {
    return (
      <div>
        <Menu
          {...{
            search,
            setSearch,
            sendSearch,
            resetSearch,
            setUnapprovedOnly,
            unapprovedOnly,
          }}
        />
        <Message message={message} type={messageType} />
        <Grid trips={trips} edit={update} deleteRow={deleteRow} />
      </div>
    )
  }
}

ReactDOM.render(<TripList />, document.getElementById('TripList'))
