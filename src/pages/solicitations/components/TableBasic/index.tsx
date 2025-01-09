// ** MUI Imports
import { Typography } from '@mui/material'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import { DataGrid, GridColDef } from '@mui/x-data-grid'

// ** Data Import
export interface SolicitationTypeTable {
  id: string
  solicitation_date: string
  email_solicitation: string
  phone_solicitation: string
  status: string
  realStateId: string
}

export interface DataGridDataSolicitation {
  columns: GridColDef[]
  rows: SolicitationTypeTable[]
}

const TableBasic = ({ columns, rows }: DataGridDataSolicitation) => {
  return (
    <Card>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: 4 }}>
        <Typography sx={{ display: 'flex', alignItems: 'center', fontWeight: 500, letterSpacing: 1.6 }}>
          {' '}
          Solicitations
        </Typography>
      </Box>

      <Box sx={{ height: 500 }}>
        {rows?.length && columns?.length && <DataGrid columns={columns} rows={rows} autoHeight rowHeight={100} />}
      </Box>
    </Card>
  )
}

export default TableBasic
