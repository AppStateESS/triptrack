const defaultTrip = {
  contactName: '',
  contactEmail: '',
  contactPhone: '',
  destinationCity: '',
  destinationCountry: 'United States',
  destinationState: '',
  host: '',
  housingAddress: '',
  organizationId: 0,
  secContactName: '',
  secContactEmail: '',
  secContactPhone: '',
  submitEmail: '',
  submitName: '',
  submitUsername: '',
  timeDeparting: 0,
  timeEventStarts: 0,
  timeReturn: 0,
  visitPurpose: '',
  memberCount: 0,
  engageEventId: 0,
}

const testTrip = {
  contactName: 'Doug Dale',
  contactEmail: 'doug@aol.com',
  contactPhone: '555-123-4567',
  destinationCity: 'New York',
  destinationCountry: 'United States',
  destinationState: 'New York',
  host: 'Academy of Visits',
  housingAddress: '123 Elm Street, New York, NY, 12304',
  organizationId: 1,
  secContactName: 'Eddy Brick',
  secContactEmail: 'brick@aol.com',
  secContactPhone: '555-555-1525',
  submitEmail: 'iamsubmitting@gmail.com',
  submitName: 'Sammy Submitter',
  submitUsername: 'submitsg',
  timeDeparting: 1603374481,
  timeEventStarts: 1603384481,
  timeReturn: 1603394481,
  visitPurpose: 'Attending big event',
  memberCount: 0,
  engageEventId: 0,
}

const tripSettings = {
  yes: {
    submitName: true,
    submitEmail: true,
    host: true,
    destinationCity: true,
    contactName: true,
    contactEmail: true,
    contactPhone: true,
    secContactName: true,
    secContactEmail: true,
    secContactPhone: true,
    timeDeparting: true,
    timeEventStart: true,
    timeReturn: true,
    memberCount: true,
    organizationId: true,
  },
  no: {
    submitName: false,
    submitEmail: false,
    host: false,
    destinationCity: false,
    contactName: false,
    contactEmail: false,
    contactPhone: false,
    secContactName: false,
    secContactEmail: false,
    secContactPhone: false,
    timeDeparting: false,
    timeEventStart: false,
    timeReturn: false,
    memberCount: false,
    organizationId: false,
  },
}

const saveReady = (ready) => {
  return (
    ready.submitName &&
    ready.submitEmail &&
    ready.host &&
    ready.destinationCity &&
    ready.contactName &&
    ready.contactEmail &&
    ready.contactPhone &&
    ready.secContactName &&
    ready.secContactEmail &&
    ready.secContactPhone
  )
}

export {defaultTrip, testTrip, tripSettings, saveReady}
