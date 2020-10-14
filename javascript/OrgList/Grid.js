'use strict'
import React from 'react'
import PropTypes from 'prop-types'

const Grid = ({organizations, edit, deleteRow, deity = false}) => {
  const deleteItem = (key) => {
    if (
      prompt(
        'Are you certain you want to delete this organization?\nAll associated trips and members will be deleted as well.\nIf you are sure, type "DELETE" below.'
      ) === 'DELETE'
    ) {
      deleteRow(key)
    }
  }

  const deleteButton = (key) => {
    if (deity === false) {
      return <span></span>
    } else {
      return (
        <button
          className="btn btn-sm btn-danger"
          onClick={() => {
            deleteItem(key)
          }}>
          Delete
        </button>
      )
    }
  }

  const rows = organizations.map((value, key) => {
    return (
      <tr key={'gridrow-' + key}>
        <td style={{width: '15%'}}>
          <button
            className="btn btn-sm btn-primary mr-1"
            onClick={() => {
              edit(value.id)
            }}>
            Edit
          </button>
          {deleteButton(key)}
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

Grid.propTypes = {
  organizations: PropTypes.array,
  edit: PropTypes.func,
  deleteRow: PropTypes.func,
  deity: PropTypes.bool,
}

export default Grid
