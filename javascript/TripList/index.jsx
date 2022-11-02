'use strict'
import React, {useState, useEffect, useRef} from 'react'
import ReactDOM from 'react-dom'
import Grid from './Grid'
import Menu from './Menu'
import Message from '../Share/Message'
import {getList} from '../api/Fetch'
import PropTypes from 'prop-types'
import {deleteTrip, getIncomplete, copyTrip} from '../api/TripAjax'

/* global hostLabel, unapproved */

const TripList = ({hostLabel, unapproved}) => {
  const today = new Date()
  let startRange = new Date()
  startRange.setMonth(today.getMonth() - 1)
  let endRange = new Date()
  endRange.setMonth(today.getMonth() + 1)

  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState('danger')
  const [search, setSearch] = useState('')
  const [unapprovedOnly, setUnapprovedOnly] = useState(unapproved)
  const [init, setInit] = useState(false)
  const [sort, setSort] = useState({column: '', dir: 0})
  const [incomplete, setIncomplete] = useState(null)
  const [dateStart, setDateStart] = useState(startRange)
  const [dateEnd, setDateEnd] = useState(endRange)

  let searchTimeout = useRef(null)

  useEffect(() => {
    if (dateStart.getTime() < dateEnd.getTime()) {
      load()
    }
  }, [sort, dateStart, dateEnd])

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
      startDate: Math.floor(dateStart.getTime() / 1000),
      endDate: Math.floor(dateEnd.getTime() / 1000),
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
        getIncomplete().then((response) => {
          if (response.data) {
            setIncomplete(response.data)
          }
        })
        setLoading(false)
      }
    })
  }

  const tripCopy = (tripId) => {
    copyTrip(tripId, 'Admin').then((resource) => {
      const copyId = resource.data.copyId
      location.href = `./triptrack/Admin/Trip/${copyId}/edit`
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

  const menu = (
    <Menu
      {...{
        search,
        incomplete,
        setSearch,
        sendSearch: load,
        resetSearch,
        setUnapprovedOnly,
        unapprovedOnly,
        setDateStart,
        setDateEnd,
        dateStart,
        dateEnd,
      }}
    />
  )
  if (loading) {
    return <div>Loading trips...</div>
  } else if (trips.length === 0) {
    let emptyMessage = (
      <span>
        No{unapprovedOnly ? ' unapproved ' : ' '}
        trips found.
      </span>
    )

    if (search.length > 0) {
      emptyMessage = (
        <span>
          No {unapprovedOnly ? 'unapproved' : ''}
          trips found with for search query:
          <strong>{search}</strong>.
        </span>
      )
    }
    return (
      <div>
        {menu}
        <Message message={message} type={messageType} />
        <p>{emptyMessage}</p>
      </div>
    )
  } else {
    return (
      <div>
        {menu}
        <Message message={message} type={messageType} />
        <Grid
          setSort={setSort}
          sort={sort}
          trips={trips}
          load={load}
          deleteRow={deleteRow}
          hostLabel={hostLabel}
          tripCopy={tripCopy}
        />
      </div>
    )
  }
}

TripList.propTypes = {
  hostLabel: PropTypes.string,
  unapproved: PropTypes.array,
}

ReactDOM.render(
  <TripList hostLabel={hostLabel} unapproved={unapproved} />,
  document.getElementById('TripList')
)
