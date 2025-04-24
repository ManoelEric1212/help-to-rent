import { RealStateTypeTable } from 'src/pages/real-state/components/TableBasic'
import { images, RealStateType } from 'src/requests/realStateRequest'

function verifyFavoriteImage(data: images[]) {
  const index = data.findIndex(imagem => imagem.url.startsWith('1-'))

  return index !== -1 ? index : 0
}

export function FormatRealStateToTable(data: RealStateType[]) {
  const dataReturnFormat: RealStateTypeTable[] = data.map(item => {
    return {
      id: item.id,
      id_number: item.id_number,
      name: item.name,
      address: item.address,
      area: item.area,
      inclusion_date: item.updated_at,
      price: item.mensalRent,
      region: item.region,
      type: item.type,
      listedBy: item.userUpdated,
      srcImg: item.images?.length ? item.images[verifyFavoriteImage(item.images)].url : ''
    }
  })

  return dataReturnFormat
}
