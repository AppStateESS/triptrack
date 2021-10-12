import {getList, postItem} from './Fetch'

const orgCount = () => {
  const url = './triptrack/Admin/Engage/count'
  return getList(url)
}

const updateOrganizations = () => {
  const url = './triptrack/Admin/Engage/importOrganizations'
  return getList(url)
}

const searchEngageOrganizations = (name) => {
  const url = './triptrack/Admin/Engage/searchOrganizations'
  return getList(url, {name})
}

const postOrganization = (organization) => {
  return postItem(organization, 'Organization', 'Admin')
}

const getOrganizationList = (engageOrgId) => {
  const url = './triptrack/Admin/Engage/memberListByOrganization'
  return getList(url, {engageOrgId})
}

const getOrganizationEvents = (organizationId, role = 'Admin') => {
  const url = `./triptrack/${role}/Engage/eventListByOrganization`
  return getList(url, {orgId: organizationId})
}

const getRSVPBannerIds = (eventId, role = 'Admin') => {
  const url = `./triptrack/${role}/Engage/rsvpListByEvent`
  return getList(url, {eventId})
}

export {
  orgCount,
  updateOrganizations,
  searchEngageOrganizations,
  postOrganization,
  getOrganizationList,
  getOrganizationEvents,
  getRSVPBannerIds,
}
