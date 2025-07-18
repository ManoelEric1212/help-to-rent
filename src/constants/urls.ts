export const GET_USER = '/users'
export const POST_USER = '/users'
export const LOGIN_USER = '/users/login'
export const UPDATE_USER_BY_AGENT = '/users/changeUserByAgent'
export const DELETE_USER = (id: string) => `/users/${id}`

export const GET_AGENT_BY_EMAIL = (email: string) => `/agents/${email}`

export const UPDATE_AGENT = `/agents/update`
export const GET_AGENTS = `/agents`

export const POST_REAL_STATE = '/realstates'
export const UDPATE_REAL_STATE = (id: string) => `/realstates/update/${id}`

export const GET_REAL_STATE = '/realstates'
export const GET_REAL_STATE_FLAG = '/realstates/clients/flag'

export const GET_REAL_STATE_BY_ID = (id: string) => `/realstates/${id}`
export const DELETE_REAL_STATE_BY_ID = (id: string) => `/realstates/${id}`

export const GET_REGIONS = '/regions'
export const POST_REGIONS = '/regions'
export const UPDATE_REGION = '/regions/update'

export const GET_SOLICITATIONS = '/requests'
export const UPDATE_SOLICITATIONS = '/requests/update'
export const ASSOCIATE_REQUEST = '/requests/associate'
export const GET_REQUEST_BY_AGENT_ID = (id: string) => `/requests/agent/${id}`

export const SEND_EMAIL = `/email/send`
export const SEND_EMAIL_RENT = `/email/send/rent`
export const SEND_EMAIL_CAREERS = `/email/send/careers`
