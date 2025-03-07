import axios from 'axios'
import { GET_REAL_STATE, GET_REAL_STATE_BY_ID, POST_REAL_STATE, UDPATE_REAL_STATE } from 'src/constants/urls'
import { api } from 'src/service/api'

export interface CreateRealStateDTO {
  name: string
  mensalRent: number
  area: number
  address: string
  type: string
  bathNumber: number
  roomsNumber: number
  hasBalcony: string
  hasAirConditioner: string
  hasPool: string
  hasJacuzzi: string
  hasGarage: string
  hasElevator: string
  hasGarden: string
  hasUnfurnished: string
  hasYard: string
  hasUse_of_Roof: string
  hasDishWasher: string
  hasWashingMachine: string
  hasTumbleDryer: string
  hasSeafront: string
  hasSeaview: string

  userUpdated: string
  petAccepts: string
  ownerEmail: string
  ownerId: string
  area_region: string
  hasTerrace: string
  additionalExpenses: string
  description: string
  flagClient: string
  parameters: string
  lat: number
  lng: number
  region: string
  status: string
  images: any[]
}

export interface images {
  id: string
  url: string
  realStateId: string
  created_at: string
}

export interface RealStateType {
  id: string
  id_number: number
  name: string
  mensalRent: number
  area: number
  address: string
  type: string
  bathNumber: number
  roomsNumber: number

  status: string
  region: string

  hasBalcony: string
  hasAirConditioner: string
  hasPool: string
  hasJacuzzi: string
  hasGarage: string
  petAccepts: string
  hasTerrace: string

  intentionStatus: string
  subIntentionStatus: string
  country_code: string
  availabilityDate: string
  ownerName: string
  ownerNumber: string
  ownerEmail: string
  ownerId: string
  area_region: string
  alternativeNumberOwner: string
  userUpdated: string
  hasElevator: string
  hasGarden: string
  hasUnfurnished: string
  hasYard: string
  hasUse_of_Roof: string
  hasLift: string

  hasDishWasher: string
  hasWashingMachine: string
  hasTumbleDryer: string
  hasSeafront: string
  hasSeaview: string

  flagClient: string
  parameters: string

  energyEfficiency: number

  additionalExpenses: string
  description: string
  lat: number
  lng: number
  images?: images[]
  created_at: string
  updated_at: string
}

export async function registerRealState(body: FormData) {
  try {
    const { data } = await api.post<RealStateType>(POST_REAL_STATE, body, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    return data
  } catch (error) {
    throw new Error('Error - getUsers')
  }
}

interface updateRealStateProps {
  body: FormData
  id: string
}

export async function updateRealState({ body, id }: updateRealStateProps) {
  try {
    const { data } = await api.post<RealStateType>(UDPATE_REAL_STATE(id), body, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    return data
  } catch (error) {
    throw new Error('Error - getUsers')
  }
}

export async function getAllRealStates() {
  try {
    const { data } = await api.get<RealStateType[]>(GET_REAL_STATE)

    return data
  } catch (error) {
    throw new Error('Error - getAllRealStates')
  }
}

export async function getRealStateById(id: string) {
  try {
    const { data } = await api.get<RealStateType>(GET_REAL_STATE_BY_ID(id))

    return data
  } catch (error) {
    throw new Error('Error - getRealStateById')
  }
}

export interface getLatAndLng {
  address: string
  region: string
}

export interface OpenStretMapReturn {
  place_id: number
  licence: string
  osm_type: string
  osm_id: number
  lat: string
  lon: string
  class: string
  type: string
  place_rank: number
  importance: number
  addresstype: string
  name: string
  display_name: string
  boundingbox: string[]
}

export async function getLatAndLngReq({ address, region }: getLatAndLng) {
  try {
    const { data } = await axios.get<OpenStretMapReturn[]>('https://nominatim.openstreetmap.org/search', {
      params: {
        q: region.length ? `${address},+${region}` : `${address}`,
        format: 'json',
        limit: 5
      }
    })

    return data
  } catch (error) {
    throw new Error('Error - getRealStateById')
  }
}

export interface filters {
  intentionStatus?: string
  subIntentionStatus?: string
  region?: string
  area_region?: string
  maxPrice?: number
  minPrice?: number
  roomsNumber?: number
  type?: string
}

export async function getFilteredRealStates(params?: {
  intentionStatus?: string
  subIntentionStatus?: string
  region?: string
  area_region?: string
  maxPrice?: number
  minPrice?: number
  roomsNumber?: number
  type?: string
}): Promise<RealStateType[]> {
  try {
    // Remove campos undefined para evitar envio de parâmetros vazios
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const filteredParams = Object.fromEntries(Object.entries(params || {}).filter(([_, value]) => value !== undefined))

    const { data } = await api.get<RealStateType[]>('/realstates/filters/real', { params: filteredParams })

    return data
  } catch (error) {
    throw new Error('Error - getFilteredRealStates')
  }
}
