'use strict'
import React, {useState, useEffect, useRef} from 'react'
import ReactDOM from 'react-dom'
import Grid from './Grid'
import Menu from './Menu'
import Message from '../Share/Message'
import {getList} from '../api/Fetch'
import {deleteTrip} from '../api/TripAjax'
/* global hostLabel */

const TripList = ({hostLabel}) => {
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState('danger')
  const [search, setSearch] = useState('')
  const [unapprovedOnly, setUnapprovedOnly] = useState(false)
  const [init, setInit] = useState(false)
  const [sort, setSort] = useState({column: '', dir: 0})

  let searchTimeout = useRef(null)

  useEffect(() => {
    load()
  }, [sort])

  useEffect(() => {
    setInit(true)
  }, [])

  useEffect(() => {
    if (!init) {
      return
    }
    if (search.length > 3 || search.length === 0) {
      searchTimeout.current = setTimeout(() => {
        load()
      }, 1000)
    }
    return () => {
      clearTimeout(searchTimeout.current)
    }
  }, [search])

  useEffect(() => {
    if (!init) {
      return
    }
    load()
  }, [unapprovedOnly])

  const load = (useSearch = true) => {
    setLoading(true)
    setTrips([])
    const options = {
      search: useSearch ? search : '',
      unapprovedOnly,
    }
    switch (sort.dir) {
      case 1:
        options.orderBy = sort.column
        options.dir = 'asc'
        break
      case -1:
        options.orderBy = sort.column
        options.dir = 'desc'
        break
    }
    const promise = getList('./triptrack/Admin/Trip/', options)
    promise.then((response) => {
      if (response === false) {
        setMessage('Error: could not load trip list')
        setMessageType('danger')
        setLoading(false)
      } else {
        setTrips(response.data)
        setLoading(false)
      }
    })
  }

  const resetSearch = () => {
    setSearch('')
    load(false)
  }

  const deleteRow = (key) => {
    const trip = trips[key]
    deleteTrip(trip.id).then(() => {
      load()
    })
  }

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
            sendSearch: load,
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
            sendSearch: load,
            resetSearch,
            setUnapprovedOnly,
            unapprovedOnly,
          }}
        />
        <Message message={message} type={messageType} />
        <Grid
          setSort={setSort}
          sort={sort}
          trips={trips}
          load={load}
          deleteRow={deleteRow}
          hostLabel={hostLabel}
        />
      </div>
    )
  }
}

ReactDOM.render(
  <TripList hostLabel={hostLabel} />,
  document.getElementById('TripList')
)
