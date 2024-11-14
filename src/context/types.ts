import { Agent } from 'src/requests/agentRequest'

export type ErrCallbackType = (err: { [key: string]: string }) => void

export type LoginParams = {
  email: string
  password: string
  rememberMe?: boolean
}

export type UserDataType = {
  id: string
  role: string
  email: string
  fullName: string
  username: string
  password: string
  avatar?: string | null
  updatedProfile?: boolean
}

export type AuthValuesType = {
  loading: boolean
  logout: () => void
  user: UserDataType | null
  agent: Agent | null
  setLoading: (value: boolean) => void
  setUser: (value: UserDataType | null) => void
  login: (params: LoginParams, errorCallback?: VoidFunction) => Promise<void>
}
