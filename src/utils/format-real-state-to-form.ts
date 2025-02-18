import { FormData } from 'src/pages/real-state/components/RegisterForm'
import { RealStateType } from 'src/requests/realStateRequest'

export function FormatRealStateToForm(data: RealStateType) {
  console.log('data', data)
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
    hasElevator: JSON.parse(data.hasElevator),
    hasGarden: JSON.parse(data.hasGarden),
    hasUnfurnished: JSON.parse(data.hasUnfurnished),
    hasYard: JSON.parse(data.hasYard),
    hasUse_of_Roof: JSON.parse(data.hasUse_of_Roof),
    hasDishWasher: JSON.parse(data.hasDishWasher),
    hasWashingMachine: JSON.parse(data.hasWashingMachine),
    hasTumbleDryer: JSON.parse(data.hasTumbleDryer),
    hasSeafront: JSON.parse(data.hasSeafront),
    hasSeaview: JSON.parse(data.hasSeaview),
    hasLift: JSON.parse(data.hasElevator),
    subIntentionStatus: data.subIntentionStatus,

    userUpdated: data.userUpdated,
    hasPool: JSON.parse(data.hasPool),
    hasTerrace: JSON.parse(data.hasTerrace),
    images: data.images ?? [],
    mensalRent: data.mensalRent,
    name: data.name,
    region: data.region,
    roomsNumber: data.roomsNumber,
    status: data.status,
    type: data.type,
    petAcepts: JSON.parse(data.petAccepts)
  }

  return dataFormatted
}
