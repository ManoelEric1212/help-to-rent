// ** MUI Imports
import { Button, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { useRouter } from 'next/router'

// ** Data Import
export interface RealStateTypeTable {
  id: string
  name: string
  type: string
  region: string
  address: string
  area: number
  inclusion_date: string
}

export interface DataGridDataRealState {
  columns: GridColDef[]
  rows: RealStateTypeTable[]
}

const TableBasic = ({ columns, rows }: DataGridDataRealState) => {
  const router = useRouter()
  console.log(router.pathname)

  return (
    <Card>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: 4 }}>
        <Typography sx={{ display: 'flex', alignItems: 'center', fontWeight: 500, letterSpacing: 1.6 }}>
          {' '}
          Real States
        </Typography>
        <Button color='primary' variant='contained' onClick={() => router.push(`${router.pathname}/register`)}>
          Register
        </Button>
      </Box>

      <Box sx={{ height: 500 }}>
        <DataGrid columns={columns} rows={rows.slice(0, 10)} />
      </Box>
    </Card>
  )
}

export default TableBasic
