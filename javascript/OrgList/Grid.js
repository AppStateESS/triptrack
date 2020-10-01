'use strict'
import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import Menu from './Menu'

const Grid = ({organizations, edit}) => {
  const rows = organizations.map((value, key) => {
    return (
      <tr key={key}>
        <td style={{width: '5%'}}>
          <button
            className="btn btn-sm btn-primary"
            onClick={() => {
              edit(value.id)
            }}>
            Edit
          </button>
        </td>
        <td>{value.name}</td>
      </tr>
    )
  })

  return (
    <div>
      <table className="table table-striped">
        <tbody>{rows}</tbody>
      </table>
    </div>
  )
}

Grid.propTypes = {organizations: PropTypes.array, edit: PropTypes.func}

export default Grid
