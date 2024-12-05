// ** MUI Imports
import { Button, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import { DataGrid, GridColDef } from '@mui/x-data-grid'

import { Dispatch, SetStateAction } from 'react'
import { Region } from 'src/requests/regionRequest'

// ** Data Import
export interface RegionType {
  id: string
  region_name: string
  description: string
}

export interface DataGridDataRegion {
  columns: GridColDef[]
  rows: Region[]
  setModalOpen: Dispatch<SetStateAction<boolean>>
}

const TableBasic = ({ columns, rows, setModalOpen }: DataGridDataRegion) => {
  return (
    <Card>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: 4 }}>
        <Typography sx={{ display: 'flex', alignItems: 'center', fontWeight: 500, letterSpacing: 1.6 }}>
          {' '}
          Regions
        </Typography>
        <Button
          color='primary'
          variant='contained'
          onClick={() =>
            setTimeout(() => {
              setModalOpen(true)
            }, 100)
          }
        >
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
