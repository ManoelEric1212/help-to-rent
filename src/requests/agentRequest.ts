import { GET_AGENT_BY_EMAIL, GET_AGENTS, UPDATE_AGENT } from 'src/constants/urls'
import { api } from 'src/service/api'

export interface Agent {
  id: string
  name: string
  email: string
  number: string
  role: string
  status: string
  type: string
  action: string
  updatedProfile: boolean
  created_at: Date
}

export async function getAgentByEmailRequest(email: string) {
  try {
    const { data } = await api.get<Agent>(GET_AGENT_BY_EMAIL(email))

    return data
  } catch (error) {
    throw new Error('Error - getUsers')
  }
}

export interface UpdateAgentDTO {
  id: string
  name: string
  email: string
  number: string
  role: string
  status: string
  type: string
  action: string
  updatedProfile: boolean
}

export async function updateAgent(body: UpdateAgentDTO) {
  try {
    const { data } = await api.post<Agent>(UPDATE_AGENT, body)

    return data
  } catch (error) {
    throw new Error('Error - getUsers')
  }
}

export async function getAgents() {
  try {
    const { data } = await api.get<Agent[]>(GET_AGENTS)

    return data
  } catch (error) {
    throw new Error('Error - getAgents')
  }
}
