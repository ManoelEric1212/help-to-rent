import { GET_REAL_STATE, POST_REAL_STATE } from 'src/constants/urls'
import { api } from 'src/service/api'

export interface CreateRealStateDTO {
  name: string
  mensalRent: number
  area: number
  address: string
  type: string
  bathNumber: number
  roomsNumber: number
  numberElevator: number
  hasBalcony: string
  hasAirConditioner: string
  hasPool: string
  hasJacuzzi: string
  hasGarage: string
  petAccepts: string
  hasHotWater: string
  hasTerrace: string
  orientation: string
  energyEfficiency: number
  hasWifi: boolean
  additionalExpenses: string
  description: string
  lat: number
  lng: number
  region: string
  status: string
}

export interface RealStateType {
  id: string
  name: string
  mensalRent: number
  area: number
  address: string
  type: string
  bathNumber: number
  roomsNumber: number
  numberElevator: number
  status: string
  region: string

  hasBalcony: string
  hasAirConditioner: string
  hasPool: string
  hasJacuzzi: string
  hasGarage: string
  petAccepts: string
  hasHotWater: string
  hasTerrace: string

  orientation: string
  energyEfficiency: number
  hasWifi: boolean
  additionalExpenses: string
  description: string
  lat: number
  lng: number
  created_at: string
}

export async function registerRealState(body: CreateRealStateDTO) {
  try {
    const { data } = await api.post<RealStateType>(POST_REAL_STATE, body)

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
    throw new Error('Error - getUsers')
  }
}
