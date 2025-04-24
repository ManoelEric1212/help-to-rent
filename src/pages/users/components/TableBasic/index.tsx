// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import { DataGrid, GridColDef } from '@mui/x-data-grid'

// ** Data Import
export interface UserType {
  id: string
  name: string
  number: string
  role: string
  solicitation_date: string
  status: boolean
}

export interface DataGridDataUser {
  columns: GridColDef[]
  rows: UserType[]
}

const TableBasic = ({ columns, rows }: DataGridDataUser) => {
  return (
    <Card>
      <CardHeader title='Users' />
      <Box sx={{ height: 500, padding: '1rem' }}>
        {rows?.length && columns?.length && <DataGrid columns={columns} rows={rows} />}
      </Box>
    </Card>
  )
}

export default TableBasic
