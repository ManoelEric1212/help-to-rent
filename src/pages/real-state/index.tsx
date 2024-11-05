/* eslint-disable lines-around-comment */
// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import CardHeader from '@mui/material/CardHeader'
import TableBasic, { DataGridDataRealState, RealStateType } from './components/TableBasic'
import { CardContent, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import { useEffect, useState } from 'react'
import { GridColDef } from '@mui/x-data-grid'
import { rows } from './components/TableBasic/mock'

import Chip from 'src/components/chip'

export type DateType = Date | null | undefined

interface CellType {
  row: RealStateType
}
const columns: GridColDef[] = [
  {
    flex: 0.1,
    field: 'name',
    minWidth: 230,
    headerName: 'Name'
  },
  {
    flex: 0.15,
    minWidth: 80,
    field: 'type',
    headerName: 'Type'
  },
  {
    flex: 0.15,
    minWidth: 80,
    field: 'action',
    headerName: 'Action'
  },
  {
    flex: 0.15,
    minWidth: 120,
    field: 'agent_name',
    headerName: 'Agent'
  },
  {
    flex: 0.15,
    type: 'inlcusion_date',
    minWidth: 130,
    headerName: 'Inclusion Date',
    field: 'start_date',
    valueGetter: params => new Date(params.value)
  },
  {
    flex: 0.1,
    field: 'status',
    minWidth: 80,
    headerName: 'Status',
    renderCell: ({ row }: CellType) => {
      return (
        <Chip
          skin='light'
          size='small'
          label={row.status === true ? 'Active' : 'Inactive'}
          color={row.status === true ? 'success' : 'warning'}
          sx={{ textTransform: 'capitalize', '& .MuiChip-label': { lineHeight: '18px' } }}
        />
      )
    }
  }
]

const Home = () => {
  const [data, setData] = useState<DataGridDataRealState>({ columns: [], rows: [] })

  useEffect(() => {
    setTimeout(() => {
      const dataMock: DataGridDataRealState = {
        columns: columns,
        rows: rows
      }
      setData(dataMock)
    }, 2000)
  }, [])
  // ** States

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Search Filters' sx={{ pb: 4, '& .MuiCardHeader-title': { letterSpacing: '.15px' } }} />
          <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Grid container spacing={6}>
              <Grid item sm={4} xs={12}>
                <TextField fullWidth label='Name' placeholder='Terraced House' />
              </Grid>
              <Grid item sm={4} xs={12}>
                <FormControl fullWidth>
                  <InputLabel id='type'>Type</InputLabel>
                  <Select
                    // value={plan}
                    id='name'
                    label='Select type'
                    labelId='type'
                    // onChange={handlePlanChange}
                    inputProps={{ placeholder: 'Select a Type' }}
                  >
                    <MenuItem value='company'>Company</MenuItem>
                    <MenuItem value='enterprise'>Enterprise</MenuItem>
                    <MenuItem value='team'>Team</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item sm={4} xs={12}>
                <FormControl fullWidth>
                  <InputLabel id='agent-select'>Agent</InputLabel>
                  <Select
                    // value={status}
                    id='select-agent'
                    label='Select Agent'
                    labelId='agent-select'
                    // onChange={handleStatusChange}
                    inputProps={{ placeholder: 'Select Agent' }}
                  >
                    <MenuItem value='active'>Active</MenuItem>
                    <MenuItem value='inactive'>Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Grid container spacing={6}>
              <Grid item sm={4} xs={12}>
                <FormControl fullWidth>
                  <InputLabel id='status-select'>Status</InputLabel>
                  <Select
                    // value={status}
                    id='select-status'
                    label='Select Agent'
                    labelId='status-select'
                    // onChange={handleStatusChange}
                    inputProps={{ placeholder: 'Select Agent' }}
                  >
                    <MenuItem value='active'>Active</MenuItem>
                    <MenuItem value='inactive'>Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item sm={4} xs={12}>
                <FormControl fullWidth>
                  <InputLabel id='price'>Price</InputLabel>
                  <Select
                    // value={plan}
                    id='price'
                    label='Select price'
                    labelId='price'
                    // onChange={handlePlanChange}
                    inputProps={{ placeholder: 'Select a Price' }}
                  >
                    <MenuItem value='0-500'>0 - 500</MenuItem>
                    <MenuItem value='0-1000'>0 - 1000</MenuItem>
                    <MenuItem value='0-1500'>0 - 1500</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <TableBasic columns={data.columns} rows={data.rows} />
      </Grid>
    </Grid>
  )
}

export default Home
