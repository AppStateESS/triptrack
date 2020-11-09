import React from 'react'

const createOptions = (options, idName = null, labelName = null) => {
  const inputs = []
  if (options.length > 0) {
    options.forEach((element) => {
      if (typeof element === 'string') {
        inputs.push(<option key={element}>{element}</option>)
      } else {
        inputs.push(
          <option value={element[idName]} key={'key-' + element[idName]}>
            {element[labelName]}
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
