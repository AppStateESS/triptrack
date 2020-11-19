'use strict'
import React, {useState} from 'react'
import ReactDOM from 'react-dom'
import Form from './Form'
import axios from 'axios'

const ImportForm = () => {
  const [formReady, setFormReady] = useState(false)
  const [successFile, setSuccessFile] = useState('')

  const importFile = () => {
    axios
      .post(
        './triptrack/Admin/Member/importFile',
        {fileName: successFile},
        {
          headers: {'X-Requested-With': 'XMLHttpRequest'},
        }
      )
      .then((response) => {
        console.log(response.data)
      })
  }

  let content
  if (formReady) {
    content = (
      <div className="text-center">
        <p>Import file formatted correctly.</p>
        <button className="btn btn-success btn-lg" onClick={importFile}>
          Import members from uploaded file
        </button>
      </div>
    )
  } else {
    content = <Form {...{setFormReady, setSuccessFile}} />
  }
  return (
    <div>
      <h3>Import members</h3>
      {content}
    </div>
  )
}

ReactDOM.render(<ImportForm />, document.getElementById('ImportForm'))
