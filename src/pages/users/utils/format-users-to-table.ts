import { User } from 'src/requests/usersRequest'
import { UserType } from '../components/TableBasic'

export function FormatUserToTable(data: User[]) {
  const dataReturnFormat: UserType[] = data.map(item => {
    return {
      id: item.id,
      name: item.name,
      number: item.email,
      role: item.role,
      solicitation_date: item.created_at,
      status: item.activity
    }
  })

  return dataReturnFormat
}
