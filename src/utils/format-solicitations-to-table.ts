import { SolicitationTypeTable } from 'src/pages/solicitations/components/TableBasic'
import { SolicitationType } from 'src/requests/solicitationRequest'

export function FormatSolicitationToTable(data: SolicitationType[]) {
  const dataReturnFormat: SolicitationTypeTable[] = data.map(item => {
    return {
      email_solicitation: item.requesterEmail,
      id: item.id,
      phone_solicitation: item.requesterPhone,
      realStateId: item.realState.id_number.toString(),
      solicitation_date: item.created_at,
      status: item.status
    }
  })

  return dataReturnFormat
}
