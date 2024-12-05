export const GET_USER = '/users'
export const POST_USER = '/users'
export const LOGIN_USER = '/users/login'
export const UPDATE_USER_BY_AGENT = '/users/changeUserByAgent'

export const GET_AGENT_BY_EMAIL = (email: string) => `/agents/${email}`

export const UPDATE_AGENT = `/agents/update`

export const POST_REAL_STATE = '/realstates'
export const UDPATE_REAL_STATE = (id: string) => `/realstates/update/${id}`

export const GET_REAL_STATE = '/realstates'

export const GET_REAL_STATE_BY_ID = (id: string) => `/realstates/${id}`

export const GET_REGIONS = '/regions'
export const POST_REGIONS = '/regions'
export const UPDATE_REGION = '/regions/update'
