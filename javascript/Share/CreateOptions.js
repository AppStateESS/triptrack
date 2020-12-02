import React from 'react'

const createOptions = (options, idName = null, labelName = null) => {
  const dash = (key) => {
    return key > 0 ? ' - ' : ''
  }
  const inputs = []
  if (options.length > 0) {
    options.forEach((element) => {
      if (typeof element === 'string') {
        inputs.push(<option key={element}>{element}</option>)
      } else {
        let labelValue
        if (typeof labelName === 'object') {
          labelValue = labelName.map((value, key) => {
            return dash(key) + element[value]
          })
        } else {
          labelValue = element[labelName]
        }
        inputs.push(
          <option value={element[idName]} key={'key-' + element[idName]}>
            {labelValue}
          </option>
        )
      }
    })
    return inputs
  } else {
    return null
  }
}

export {createOptions}
