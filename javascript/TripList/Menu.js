'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import DateRangePicker from '@wojtekmaj/react-daterange-picker'
import './menu.css'

const Menu = ({
  incomplete,
  sendSearch,
  search,
  setSearch,
  resetSearch,
  unapprovedOnly,
  setUnapprovedOnly,
  setDateRange,
  dateRange,
}) => {
  const unapprovedOnlyButton = () => {
    if (unapprovedOnly) {
      return (
        <button
          className="btn btn-primary"
          onClick={() => {
            setUnapprovedOnly(false)
          }}>
          Showing unapproved
        </button>
      )
    } else {
      return (
        <button
          className="btn btn-outline-primary"
          onClick={() => {
            setUnapprovedOnly(true)
          }}>
          Showing all
        </button>
      )
    }
  }
  return (
    <div className="mb-3">
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
            <li className="nav-item mr-2">
              {incomplete ? (
                <a
                  className="btn btn-warning"
                  href={`./triptrack/Admin/Trip/${incomplete.id}/edit`}>
                  Finish incomplete trip
                </a>
              ) : (
                <a
                  className="btn btn-success"
                  href="./triptrack/Admin/Trip/create">
                  Create trip
                </a>
              )}
            </li>
            <li className="nav-item mr-2">{unapprovedOnlyButton()}</li>
            <li className="nav-item">
              <DateRangePicker
                className="form-control"
                onChange={setDateRange}
                value={dateRange}
              />
            </li>
          </ul>
          <div className="d-flex justify-content-end">
            <div className="input-group">
              <input
                className="form-control"
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search"
                aria-label="Search"
              />
              <div className="input-group-append">
                <button
                  className="btn btn-outline-success my-2 my-sm-0"
                  onClick={sendSearch}
                  type="button">
                  Search
                </button>
                <button
                  className="btn btn-outline-danger my-2 my-sm-0"
                  onClick={() => {
                    resetSearch()
                  }}
                  type="button">
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  )
}

Menu.propTypes = {
  showModal: PropTypes.func,
  sendSearch: PropTypes.func,
  search: PropTypes.string,
  setSearch: PropTypes.func,
  resetSearch: PropTypes.func,
  unapprovedOnly: PropTypes.bool,
  setUnapprovedOnly: PropTypes.func,
  setDateRange: PropTypes.func,
  dateRange: PropTypes.array,
}

Menu.defaultProps = {}
export default Menu
