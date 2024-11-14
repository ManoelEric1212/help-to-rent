import { RealStateType } from 'src/requests/realStateRequest'
import { RealStateTypeTable } from '../components/TableBasic'

export function FormatRealStateToTable(data: RealStateType[]) {
  const dataReturnFormat: RealStateTypeTable[] = data.map(item => {
    return {
      id: item.id,
      name: item.name,
      address: item.address,
      area: item.area,
      inclusion_date: item.created_at,

      region: item.region,
      type: item.type
    }
  })

  return dataReturnFormat
}
