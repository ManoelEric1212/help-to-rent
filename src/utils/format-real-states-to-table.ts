import { RealStateTypeTable } from 'src/pages/real-state/components/TableBasic'
import { RealStateType } from 'src/requests/realStateRequest'

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
