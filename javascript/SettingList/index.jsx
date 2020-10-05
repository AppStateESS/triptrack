'use strict'
import React, {useState, useEffect} from 'react'
import ReactDOM from 'react-dom'
import BigCheckbox from 'canopy-react-bigcheckbox'
import {Slide} from 'react-awesome-reveal'
import PropTypes from 'prop-types'
import axios from 'axios'

/* global settings */

const saveButtonDefault = {
  siteContactName: false,
  siteContactEmail: false,
  hostLabel: false,
  organizationLabel: false,
}

const SettingList = ({currentSettings}) => {
  const [settings, setSettings] = useState(Object.assign({}, currentSettings))
  const [saveButton, setSaveButton] = useState(
    Object.assign({}, saveButtonDefault)
  )

  const update = (settingName, value) => {
    const current = Object.assign({}, settings)
    switch (settingName) {
      case 'allowUpload':
        if (value === false) {
          current.uploadRequired = false
        }
    }
    current[settingName] = value
    setSettings(current)
    updateButton(settingName, true)
  }

  const updateButton = (settingName, value) => {
    console.log('in updateButton with')
    console.log(settingName)
    const buttons = Object.assign({}, saveButton)
    if (buttons[settingName] !== undefined) {
      console.log('button exist setting to true')
      buttons[settingName] = value
      console.log(buttons)
      setSaveButton(buttons)
    }
  }

  const resetButton = (settingName) => {
    console.log('in reset button with')
    console.log(settingName)
    updateButton(settingName, false)
  }

  const save = (settingName) => {
    let url = './triptrack/Admin/Setting/'

    axios({
      method: 'post',
      url,
      data: {varName: settingName, value: settings[settingName]},
      timeout: 3000,
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
      },
    })
      .then((response) => {
        console.log('resetting button')
        resetButton(settingName)
      })
      .catch((error) => {
        console.log('Error:', error)
      })
    resetButton(settingName)
  }

  const uploadRequiredRow = () => {
    if (settings.allowUpload) {
      return (
        <Slide direction="down">
          <div className="row py-2 border-bottom mb-3">
            <div className="col-sm-6 mb-2 pl-5">
              <strong>Upload required</strong>
              <br />
              <small className="form-text text-muted">
                If enabled, the trip is incomplete without an uploaded document.
              </small>
            </div>
            <div className="col-sm-6">
              <BigCheckbox
                label={settings.uploadRequired ? 'Yes' : 'No'}
                checked={settings.uploadRequired}
                handle={() => {
                  update('uploadRequired', !settings.uploadRequired)
                }}
              />
            </div>
          </div>
          <div className="row py-2 border-bottom mb-3">
            <div className="col-sm-6 mb-2 pl-5">
              <strong>Upload notes</strong>
              <br />
              <small className="form-text text-muted">
                If you want any notes displayed concerning the upload, add them
                here.
              </small>
            </div>
            <div className="col-sm-6">
              <textarea
                className="form-control"
                value={settings.uploadInstructions}
                onChange={(e) => update('uploadInstructions', e.target.value)}
              />
            </div>
          </div>
        </Slide>
      )
    }
  }

  return (
    <div>
      <h2>Trip Track Settings</h2>
      <div className="row py-2 border-bottom mb-3">
        <div className="col-sm-6 mb-2">
          <strong>Allow international</strong>
          <small className="form-text text-muted">
            If enabled, other countries may be chosen as destinations.
          </small>
        </div>
        <div className="col-sm-6">
          <BigCheckbox
            label={settings.allowInternational ? 'Yes' : 'No'}
            checked={settings.allowInternational}
            handle={() => {
              update('allowInternational', !settings.allowInternational)
            }}
          />
        </div>
      </div>

      <div className="row py-2 border-bottom mb-3">
        <div className="col-sm-6 mb-2">
          <strong>Contact banner id</strong>
          <br />
          <small className="form-text text-muted">
            If enabled, the trip contact&apos;s banner id number is required.
          </small>
        </div>
        <div className="col-sm-6">
          <BigCheckbox
            label={settings.contactBannerRequired ? 'Yes' : 'No'}
            checked={settings.contactBannerRequired}
            handle={() => {
              update('allowInternational', !settings.contactBannerRequired)
            }}
          />
        </div>
      </div>
      <div className="row py-2 border-bottom mb-3">
        <div className="col-sm-6 mb-2">
          <strong>Approval required</strong>
          <br />
          <small className="form-text text-muted">
            If approval is required, a trip is not complete until approved by an
            admininstrator.
          </small>
        </div>
        <div className="col-sm-6">
          <BigCheckbox
            label={settings.approvalRequired ? 'Yes' : 'No'}
            checked={settings.approvalRequired}
            handle={() => {
              update('approvalRequired', !settings.approvalRequired)
            }}
          />
        </div>
      </div>
      <div className="row py-2 border-bottom mb-3">
        <div className="col-sm-6 mb-2">
          <strong>Allow uploads</strong>
          <br />
          <small className="form-text text-muted">
            If enabled, trips will require documentation (i.e. uploaded PDFs)
          </small>
        </div>
        <div className="col-sm-6">
          <BigCheckbox
            label={settings.allowUpload ? 'Yes' : 'No'}
            checked={settings.allowUpload}
            handle={() => {
              update('allowUpload', !settings.allowUpload)
            }}
          />
        </div>
      </div>
      {uploadRequiredRow()}
      <div className="row py-2 border-bottom mb-3">
        <div className="col-sm-6 mb-2">
          <strong>Site contact name</strong>
          <br />
          <small className="form-text text-muted">
            The person or department responsible for user questions.
          </small>
        </div>
        <div className="col-sm-6">
          <div className="input-group">
            <input
              className="form-control"
              value={settings.siteContactName}
              onChange={(e) => update('siteContactName', e.target.value)}
            />
            <div className="input-group-append">
              <button
                disabled={!saveButton.siteContactName}
                className="btn btn-success"
                onClick={() => save('siteContactName')}
                type="button">
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="row py-2 border-bottom mb-3">
        <div className="col-sm-6 mb-2">
          <strong>Site contact email</strong>
          <br />
          <small className="form-text text-muted">
            Reply-to email address for coorespondence or questions.
          </small>
        </div>
        <div className="col-sm-6">
          <div className="input-group">
            <input
              className="form-control"
              value={settings.siteContactEmail}
              onChange={(e) => update('siteContactEmail', e.target.value)}
            />
            <div className="input-group-append">
              <button
                onClick={() => save('siteContactEmail')}
                disabled={!saveButton.siteContactEmail}
                className="btn btn-success"
                type="button">
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="row py-2 border-bottom mb-3">
        <div className="col-sm-6 mb-2">
          <strong>Host label</strong>
          <br />
          <small className="form-text text-muted">
            Name used for the &quot;host&quot; of the trip (e.g. opposing team,
            chapter, etc.)
          </small>
        </div>
        <div className="col-sm-6">
          <div className="input-group">
            <input
              placeholder='"Host" used if empty'
              className="form-control"
              value={settings.hostLabel}
              onChange={(e) => update('hostLabel', e.target.value)}
            />{' '}
            <div className="input-group-append">
              <button
                onClick={() => save('hostLabel')}
                disabled={!saveButton.hostLabel}
                className="btn btn-success"
                type="button">
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="row py-2 border-bottom mb-3">
        <div className="col-sm-6 mb-2">
          <strong>Organization label</strong>
          <br />
          <small className="form-text text-muted">
            Alternate label for &quot;organization&quot; (e.g. team name,
            department, college)
          </small>
        </div>
        <div className="col-sm-6">
          <div className="input-group">
            <input
              placeholder='"Organization" used if empty'
              className="form-control"
              value={settings.organizationLabel}
              onChange={(e) => update('organizationLabel', e.target.value)}
            />{' '}
            <div className="input-group-append">
              <button
                onClick={() => save('organizationLabel')}
                disabled={!saveButton.organizationLabel}
                className="btn btn-success"
                type="button">
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

SettingList.propTypes = {
  currentSettings: PropTypes.object,
}

ReactDOM.render(
  <SettingList currentSettings={settings} />,
  document.getElementById('SettingList')
)
