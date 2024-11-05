// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import { DataGrid, GridColDef } from '@mui/x-data-grid'

// ** Data Import
export interface RealStateType {
  id: string
  avatar: string
  name: string
  type: string
  action: string
  agent_name: string
  inclusion_date: string
  status: boolean
}

export interface DataGridDataRealState {
  columns: GridColDef[]
  rows: RealStateType[]
}

const TableBasic = ({ columns, rows }: DataGridDataRealState) => {
  return (
    <Card>
      <CardHeader title='Real States' />
      <Box sx={{ height: 500 }}>
        <DataGrid columns={columns} rows={rows.slice(0, 10)} />
      </Box>
    </Card>
  )
}

export default TableBasic
