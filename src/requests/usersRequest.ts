import { GET_USER, LOGIN_USER, POST_USER, UPDATE_USER_BY_AGENT } from 'src/constants/urls'
import { api } from 'src/service/api'

export interface User {
  id: string
  name: string
  email: string
  password_hash: string
  role: string
  activity: boolean
  created_at: string
}

export async function getUserRequest() {
  try {
    const { data } = await api.get<User[]>(GET_USER)

    return data
  } catch (error) {
    throw new Error('Error - getUsers')
  }
}

export interface CreateUserDTO {
  name: string
  email: string
  password_hash: string
  role: string
  activity: boolean
}

export async function registerUser(body: CreateUserDTO) {
  try {
    const { data } = await api.post<User>(POST_USER, body)

    return data
  } catch (error) {
    throw new Error('Error - getUsers')
  }
}

export interface LoginUserDTO {
  email: string
  password: string
}

export async function loginUser(body: LoginUserDTO) {
  try {
    const { data } = await api.post<User>(LOGIN_USER, body)

    return data
  } catch (error) {
    throw new Error('Error - loginUser')
  }
}

export interface UpdateUserByAgentProps {
  id: string
  new_role: string
}

export async function updateUserByAgent(body: UpdateUserByAgentProps) {
  try {
    const { data } = await api.post<User>(UPDATE_USER_BY_AGENT, body)

    return data
  } catch (error) {
    throw new Error('Error - updateUserByAgent')
  }
}
