// ** MUI Imports
import { Button, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { useRouter } from 'next/router'

// ** Data Import
export interface RealStateTypeTable {
  id: string
  id_number: number
  name: string
  type: string
  region: string
  address: string
  area: number
  inclusion_date: string
  available_date: string
  srcImg?: string
}

export interface DataGridDataRealState {
  columns: GridColDef[]
  rows: RealStateTypeTable[]
}

const TableBasic = ({ columns, rows }: DataGridDataRealState) => {
  const router = useRouter()

  return (
    <Card>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: 2 }}>
        <Typography sx={{ display: 'flex', alignItems: 'center', fontWeight: 500, letterSpacing: 1.6 }}>
          {' '}
          Real Estates
        </Typography>
        <Button color='primary' variant='contained' onClick={() => router.push(`${router.pathname}/register`)}>
          Register
        </Button>
      </Box>

      <Box sx={{ height: 700 }}>
        {rows?.length && columns?.length && (
          <DataGrid
            columns={columns}
            rows={rows}
            rowHeight={110}
            sx={{
              '& .MuiDataGrid-cell': {
                alignItems: 'center',
                py: 2 // padding vertical (top + bottom)
              }
            }}
          />
        )}
      </Box>
    </Card>
  )
}

export default TableBasic
