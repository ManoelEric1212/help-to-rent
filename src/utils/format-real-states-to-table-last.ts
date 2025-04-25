import { images, RealStateType } from 'src/requests/realStateRequest'

function verifyFavoriteImage(data: images[]) {
  const index = data.findIndex(imagem => imagem.url.startsWith('1-'))

  return index !== -1 ? index : 0
}

export interface RealStateTypeTableLast {
  id: string
  id_number: number
  name: string
  type: string
  region: string
  address: string
  area: number
  inclusion_date: string
  price: number
  lastUpdated: string
  avaliable: string
  srcImg?: string
}

export function FormatRealStateToTableLast(data: RealStateType[]) {
  const dataReturnFormat: RealStateTypeTableLast[] = data.map(item => {
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
      srcImg: item.images?.length ? item.images[verifyFavoriteImage(item.images)].url : '',
      avaliable: item.availabilityDate,
      lastUpdated: item.updated_at
    }
  })

  return dataReturnFormat
}
