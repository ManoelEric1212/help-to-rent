import { GET_REGIONS, POST_REGIONS, UPDATE_REGION } from 'src/constants/urls'
import { api } from 'src/service/api'

export interface Region {
  id: string
  region_name: string
  description: string
}

export async function getRegionRequest() {
  try {
    const { data } = await api.get<Region[]>(GET_REGIONS)

    return data
  } catch (error) {
    throw new Error('Error - getRegionRequest')
  }
}

export interface CreateRegionDTO {
  region_name: string
  description: string
}

export async function registerRegion(body: CreateRegionDTO) {
  try {
    const { data } = await api.post<Region>(POST_REGIONS, body)

    return data
  } catch (error) {
    throw new Error('Error - registerRegion')
  }
}

export async function updateRegion(body: Region) {
  try {
    const { data } = await api.post<Region>(UPDATE_REGION, body)

    return data
  } catch (error) {
    throw new Error('Error - updateRegion')
  }
}
