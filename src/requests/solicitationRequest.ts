import { GET_SOLICITATIONS, ASSOCIATE_REQUEST, GET_REQUEST_BY_AGENT_ID, UPDATE_SOLICITATIONS } from 'src/constants/urls'
import { api } from 'src/service/api'
import { RealStateType } from './realStateRequest'

export interface AssignedAgentsType {
  id: string
  requestId: string
  agentId: string
  assignedAt: string
}

export interface SolicitationType {
  id: string
  created_at: string
  requesterEmail: string
  requesterPhone: string
  description: string
  status: string
  realStateId: string
  userId: string | null
  realState: RealStateType
  assignedAgents: AssignedAgentsType[]
}

export async function getSolicitaionRequest() {
  try {
    const { data } = await api.get<SolicitationType[]>(GET_SOLICITATIONS)

    return data
  } catch (error) {
    throw new Error('Error - getRegionRequest')
  }
}

export interface CreateSolicitationDTO {
  requestId: string
  agentIds: string[]
}

export async function associateSolicitation(body: CreateSolicitationDTO) {
  try {
    const { data } = await api.post(ASSOCIATE_REQUEST, body)

    return data
  } catch (error) {
    throw new Error('Error - associateSolicitation')
  }
}

export interface UpdateRequestDTO {
  id: string
  requesterEmail: string
  requesterPhone: string
  description: string
  status: string
  realStateId: string
  userId: string | null
}

export async function updateRequest(body: UpdateRequestDTO) {
  try {
    const { data } = await api.post(UPDATE_SOLICITATIONS, body)

    return data
  } catch (error) {
    throw new Error('Error - updateRequest')
  }
}

export async function getSolicitaionRequestByAgentId(id: string) {
  try {
    const { data } = await api.get<SolicitationType[]>(GET_REQUEST_BY_AGENT_ID(id))

    return data
  } catch (error) {
    throw new Error('Error - getSolicitaionRequestByAgentId')
  }
}
