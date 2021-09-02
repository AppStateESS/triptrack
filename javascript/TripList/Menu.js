'use strict'
import React from 'react'
import PropTypes from 'prop-types'

const Menu = ({
  sendSearch,
  search,
  setSearch,
  resetSearch,
  unapprovedOnly,
  setUnapprovedOnly,
}) => {
  const unapprovedOnlyButton = () => {
    if (unapprovedOnly) {
      return (
        <button
          className="btn btn-primary"
          onClick={() => {
            setUnapprovedOnly(false)
          }}>
          Show all trips
        </button>
      )
    } else {
      return (
        <button
          className="btn btn-outline-primary"
          onClick={() => {
            setUnapprovedOnly(true)
          }}>
          Show unapproved only
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
            <li className="nav-item active mr-2">
              <a
                className="btn btn-success"
                href="./triptrack/Admin/Trip/create">
                Create trip
              </a>
            </li>
            <li className="nav-item active">{unapprovedOnlyButton()}</li>
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
}

Menu.defaultProps = {}
export default Menu
