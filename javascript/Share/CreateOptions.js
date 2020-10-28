import React from 'react'

const createOptions = (options) => {
  const inputs = []
  options.forEach((element) => {
    inputs.push(<option key={element}>{element}</option>)
  })
  return inputs
}

export {createOptions}
