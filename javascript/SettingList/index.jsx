'use strict'
import React, {useState, useEffect, useRef} from 'react'
import SaveButton from '../Share/SaveButton'
import ReactDOM from 'react-dom'
import BigCheckbox from '@essappstate/canopy-react-bigcheckbox'
// Removed due to update issue. Check later to restore.
//import {Slide} from 'react-awesome-reveal'
import PropTypes from 'prop-types'
import axios from 'axios'
import {countries} from '../Share/Countries'
import {states} from '../Share/States'
import {createOptions} from '../Share/CreateOptions'

/* global settings */

const saveButtonDefault = {
  uploadInstructions: {disabled: true, saving: false},
  confirmationInstructions: {disabled: true, saving: false},
  siteContactName: {disabled: true, saving: false},
  siteContactEmail: {disabled: true, saving: false},
  hostLabel: {disabled: true, saving: false},
  organizationLabel: {disabled: true, saving: false},
}

const SettingList = ({currentSettings}) => {
  const [settings, setSettings] = useState(Object.assign({}, currentSettings))
  const [saveButton, setSaveButton] = useState(
    Object.assign({}, saveButtonDefault)
  )
  const rendered = useRef(false)
  const countryList = createOptions(countries)
  const stateList = createOptions(states)
  const [duration, setDuration] = useState(1000)

  useEffect(() => {
    if (settings.allowUpload) {
      setDuration(0)
    }
  }, [])

  useEffect(() => {
    if (rendered.current) {
      save('allowInternational')
    }
  }, [settings.allowInternational])

  useEffect(() => {
    if (rendered.current) {
      save('uploadRequired')
    }
  }, [settings.uploadRequired])

  useEffect(() => {
    if (rendered.current) {
      save('contactBannerRequired')
    }
  }, [settings.contactBannerRequired])

  useEffect(() => {
    if (rendered.current) {
      if (duration == 0) {
        setDuration(1000)
      }
      save('approvalRequired')
    }
  }, [settings.approvalRequired])

  useEffect(() => {
    if (rendered.current) {
      save('allowUpload')
    }
  }, [settings.allowUpload])

  useEffect(() => {
    if (rendered.current) {
      save('secondaryRequired')
    }
  }, [settings.secondaryRequired])

  useEffect(() => {
    if (rendered.current) {
      save('accommodationRequired')
    }
  }, [settings.accommodationRequired])

  useEffect(() => {
    if (rendered.current) {
      save('confirmationRequired')
    }
  }, [settings.confirmationRequired])

  useEffect(() => {
    if (rendered.current) {
      save('defaultCountry')
    }
  }, [settings.defaultCountry])

  useEffect(() => {
    if (rendered.current) {
      save('defaultState')
    }
  }, [settings.defaultState])

  const updateText = (settingName, value) => {
    rendered.current = true
    const current = Object.assign({}, settings)
    current[settingName] = value
    setSettings(current)
    enableButton(settingName)
  }

  const updateSelect = (settingName, value) => {
    rendered.current = true
    const current = Object.assign({}, settings)
    current[settingName] = value
    setSettings(current)
  }

  const updateCheck = (settingName) => {
    rendered.current = true
    const current = Object.assign({}, settings)
    current[settingName] = !current[settingName]
    if (settingName === 'allowUpload' && current.allowUpload === false) {
      current.uploadRequired = false
    }
    setSettings(current)
  }

  const enableButton = (settingName) => {
    const buttons = Object.assign({}, saveButton)
    buttons[settingName].disabled = false
    setSaveButton(buttons)
  }

  const disableButton = (settingName) => {
    if (saveButton[settingName] === undefined) {
      return
    }
    const buttons = Object.assign({}, saveButton)
    buttons[settingName].disabled = true
    setSaveButton(buttons)
  }

  const savingStatus = (settingName, status) => {
    if (saveButton[settingName] === undefined) {
      return
    }
    const buttons = Object.assign({}, saveButton)
    buttons[settingName].saving = status
    setSaveButton(buttons)
  }

  const wait = (delay) => {
    const promise = new Promise((resolve) => setTimeout(resolve, delay))
    return promise
  }

  const save = (settingName) => {
    savingStatus(settingName, true)
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
      .then(() => {
        wait(1000).then(() => {
          savingStatus(settingName, false)
          disableButton(settingName)
        })
      })
      .catch((error) => {
        console.log('Error:', error)
      })
  }

  const uploadRequiredRow = () => {
    if (settings.allowUpload) {
      return (
        <div>
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
                  updateCheck('uploadRequired', !settings.uploadRequired)
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
                onChange={(e) =>
                  updateText('uploadInstructions', e.target.value)
                }
              />
              <SaveButton
                disabled={saveButton.uploadInstructions.disabled}
                saving={saveButton.uploadInstructions.saving}
                click={() => save('uploadInstructions')}
              />
            </div>
          </div>
        </div>
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
              updateCheck('allowInternational')
            }}
          />
        </div>
      </div>
      <div className="row py-2 border-bottom mb-3">
        <div className="col-sm-6 mb-2">
          <strong>Default country</strong>
          <small className="form-text text-muted">
            If international, this country will be chosen by default.
          </small>
        </div>
        <div className="col-sm-6">
          <select
            className="form-control"
            value={settings.defaultCountry}
            onChange={(e) => updateSelect('defaultCountry', e.target.value)}>
            {countryList}
          </select>
        </div>
      </div>
      <div className="row py-2 border-bottom mb-3">
        <div className="col-sm-6 mb-2">
          <strong>Default state</strong>
          <small className="form-text text-muted">
            The state option will not show if the country is not the United
            States.
          </small>
        </div>
        <div className="col-sm-6">
          <select
            className="form-control"
            value={settings.defaultState}
            onChange={(e) => updateSelect('defaultState', e.target.value)}>
            {stateList}
          </select>
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
              updateCheck('contactBannerRequired')
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
              updateCheck('approvalRequired')
            }}
          />
        </div>
      </div>
      <div className="row py-2 border-bottom mb-3">
        <div className="col-sm-6 mb-2">
          <strong>Secondary contact required</strong>
          <br />
          <small className="form-text text-muted">
            If enabled, trips require an additional contact.
          </small>
        </div>
        <div className="col-sm-6">
          <BigCheckbox
            label={settings.secondaryRequired ? 'Yes' : 'No'}
            checked={settings.secondaryRequired}
            handle={() => {
              updateCheck('secondaryRequired')
            }}
          />
        </div>
      </div>
      <div className="row py-2 border-bottom mb-3">
        <div className="col-sm-6 mb-2">
          <strong>Accommodation required</strong>
          <br />
          <small className="form-text text-muted">
            If enabled, trips require an address where the members will be
            staying during the trip.
          </small>
        </div>
        <div className="col-sm-6">
          <BigCheckbox
            label={settings.accommodationRequired ? 'Yes' : 'No'}
            checked={settings.accommodationRequired}
            handle={() => {
              updateCheck('accommodationRequired')
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
              updateCheck('allowUpload')
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
              onChange={(e) => updateText('siteContactName', e.target.value)}
            />
            <div className="input-group-append">
              <SaveButton
                disabled={saveButton.siteContactName.disabled}
                saving={saveButton.siteContactName.saving}
                click={() => save('siteContactName')}
              />
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
              onChange={(e) => updateText('siteContactEmail', e.target.value)}
            />
            <div className="input-group-append">
              <SaveButton
                disabled={saveButton.siteContactEmail.disabled}
                saving={saveButton.siteContactEmail.saving}
                click={() => save('siteContactEmail')}
              />
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
              onChange={(e) => updateText('hostLabel', e.target.value)}
            />{' '}
            <div className="input-group-append">
              <SaveButton
                disabled={saveButton.hostLabel.disabled}
                saving={saveButton.hostLabel.saving}
                click={() => save('hostLabel')}
              />
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
              onChange={(e) => updateText('organizationLabel', e.target.value)}
            />
            <div className="input-group-append">
              <SaveButton
                disabled={saveButton.organizationLabel.disabled}
                saving={saveButton.organizationLabel.saving}
                click={() => save('organizationLabel')}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="row py-2 border-bottom mb-3">
        <div className="col-sm-6 mb-2">
          <strong>Confirmation</strong>
          <small className="form-text text-muted">
            If enabled, the submitter cannot submit the trip until they confirm
            the established travel conditionals.
          </small>
          <br />
        </div>
        <div className="col-sm-6 mb-2">
          <BigCheckbox
            label={settings.confirmationRequired ? 'Yes' : 'No'}
            checked={settings.confirmationRequired}
            handle={() => {
              updateCheck('confirmationRequired')
            }}
          />
          <textarea
            className="form-control"
            value={settings.confirmationInstructions}
            onChange={(e) =>
              updateText('confirmationInstructions', e.target.value)
            }
          />
          <SaveButton
            disabled={saveButton.confirmationInstructions.disabled}
            saving={saveButton.confirmationInstructions.saving}
            click={() => save('confirmationInstructions')}
          />
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
