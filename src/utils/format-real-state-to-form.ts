import { FormData } from 'src/pages/real-state/components/RegisterForm'
import { RealStateType } from 'src/requests/realStateRequest'

export function FormatRealStateToForm(data: RealStateType) {
  const dataFormatted: FormData = {
    additionalExpenses: data.additionalExpenses,
    address: data.address,
    area: data.area,
    bathNumber: data.bathNumber,
    description: data.description,
    alternativeNumberOwner: data.alternativeNumberOwner,
    availabilityDate: data.availabilityDate,
    country_code: data.country_code,
    intentionStatus: data.intentionStatus,
    ownerName: data.ownerName,
    ownerNumber: data.ownerNumber,
    ownerEmail: data.ownerEmail,
    area_region: data.area_region,
    ownerId: data.ownerId,
    hasAirConditioner: JSON.parse(data.hasAirConditioner),
    hasBalcony: JSON.parse(data.hasBalcony),
    hasGarage: JSON.parse(data.hasGarage),
    hasJacuzzi: JSON.parse(data.hasJacuzzi),
    hasPool: JSON.parse(data.hasPool),
    hasTerrace: JSON.parse(data.hasTerrace),
    hasWifi: data.hasWifi === true ? 'true' : 'false',
    images: data.images ?? [],
    mensalRent: data.mensalRent,
    name: data.name,
    numberElevator: data.numberElevator,
    orientation: data.orientation,
    region: data.region,
    roomsNumber: data.roomsNumber,
    status: data.status,
    type: data.type,
    petAcepts: JSON.parse(data.petAccepts)
  }

  return dataFormatted
}
