import { RealStateTypeTable } from 'src/pages/real-state/components/TableBasic'
import { RealStateType } from 'src/requests/realStateRequest'

export function FormatRealStateToTable(data: RealStateType[]) {
  const dataReturnFormat: RealStateTypeTable[] = data.map(item => {
    return {
      id: item.id,
      id_number: item.id_number,
      name: item.name,
      address: item.address,
      area: item.area,
      inclusion_date: item.updated_at,

      region: item.region,
      type: item.type,
      srcImg: item.images?.length ? item.images[0].url : ''
    }
  })

  return dataReturnFormat
}
