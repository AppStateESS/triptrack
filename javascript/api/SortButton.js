'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faSort, faSortUp, faSortDown} from '@fortawesome/free-solid-svg-icons'

const SortButton = ({sort, colName, handle}) => {
  if (colName === sort.column) {
    switch (sort.dir) {
      case -1:
        return (
          <button
            className="btn btn-link btn-sm text-dark"
            onClick={() => handle({column: colName, dir: 0})}>
            <FontAwesomeIcon icon={faSortDown} size="sm" />
          </button>
        )
      case 1:
        return (
          <button
            className="btn btn-link btn-sm text-dark"
            onClick={() => handle({column: colName, dir: -1})}>
            <FontAwesomeIcon icon={faSortUp} size="sm" />
          </button>
        )
      case 0:
      default:
        return (
          <button
            className="btn btn-link btn-sm text-dark"
            onClick={() => {
              handle({column: colName, dir: 1})
            }}>
            <FontAwesomeIcon icon={faSort} />
          </button>
        )
    }
  } else {
    return (
      <button
        className="btn btn-link btn-sm text-dark"
        onClick={() => {
          handle({column: colName, dir: 1})
        }}>
        <FontAwesomeIcon icon={faSort} />
      </button>
    )
  }
}

SortButton.propTypes = {currentSort: PropTypes.number, setSort: PropTypes.func}

export default SortButton
