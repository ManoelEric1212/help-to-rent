/* eslint-disable lines-around-comment */
// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import CardHeader from '@mui/material/CardHeader'
import TableBasic, { DataGridDataRealState, RealStateTypeTable } from './components/TableBasic'
import {
  Button,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField
} from '@mui/material'
import { ChangeEvent, useEffect, useState } from 'react'
import { GridColDef } from '@mui/x-data-grid'

import { FormatRealStateToTable } from './utils/format-real-states-to-table'
import { format } from 'date-fns'
import { getAllRealStates, RealStateType } from 'src/requests/realStateRequest'

export type DateType = Date | null | undefined

export interface CellType {
  row: RealStateTypeTable
}

const RealState = () => {
  const [data, setData] = useState<DataGridDataRealState>({ columns: [], rows: [] })
  const [realStates, setRealStates] = useState<RealStateType[]>([])
  const [nameFilter, setNameFilter] = useState<string>('')
  const [typeFilter, setTypeFilter] = useState<string>('')
  // const [regionFilter, setRegionFilter] = useState<string>('')
  // const [addressFilter, setAdressFilter] = useState<string>('')

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
      field: 'region',
      headerName: 'Region'
    },
    {
      flex: 0.15,
      minWidth: 80,
      field: 'address',
      headerName: 'Address'
    },
    {
      flex: 0.15,
      minWidth: 80,
      field: 'area',
      headerName: 'Area'
    },
    {
      flex: 0.15,
      type: 'inclusion_date',
      minWidth: 130,
      headerName: 'Inclusion Date',
      field: 'inclusion_date',
      valueGetter: params => format(new Date(params.value), 'dd/MM/yyyy HH:mm')
    },
    {
      flex: 0.1,
      field: 'action',
      minWidth: 80,
      headerName: 'Action',
      renderCell: ({ row }: CellType) => {
        return (
          <Button
            variant='outlined'
            color='primary'
            onClick={() => {
              console.log('EDIT PAGE', row)
            }}
          >
            {' '}
            Edit{' '}
          </Button>
        )
      }
    }
  ]

  async function getRealStates() {
    try {
      const data = await getAllRealStates()
      setRealStates(data)
      const dataTable: DataGridDataRealState = {
        columns: columns,
        rows: FormatRealStateToTable(data)
      }
      setData(dataTable)
    } catch (error) {
      console.warn(error)
    }
  }

  const handleName = (event: ChangeEvent<HTMLInputElement>) => setNameFilter(event.target.value)

  const handleType = (e: SelectChangeEvent) => setTypeFilter(e.target.value)

  // const handleStatus = (e: SelectChangeEvent) => setStatusFilter(e.target.value)

  const handleFiltersValues = () => {
    const filtered = realStates.filter(realStates => {
      const matchesName = realStates.name.toLowerCase().includes(nameFilter.toLowerCase())
      const matchestype = realStates.type.toLowerCase().includes(typeFilter.toLowerCase())

      return matchesName && matchestype
    })
    const dataTableFiltered: DataGridDataRealState = {
      columns: columns,
      rows: FormatRealStateToTable(filtered)
    }
    setData(dataTableFiltered)
  }
  useEffect(() => {
    getRealStates()
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
                <TextField
                  fullWidth
                  label='Name'
                  placeholder='Terraced House'
                  value={nameFilter}
                  onChange={handleName}
                />
              </Grid>
              <Grid item sm={4} xs={12}>
                <FormControl fullWidth>
                  <InputLabel id='type'>Type</InputLabel>
                  <Select
                    value={typeFilter}
                    id='type'
                    label='Select role'
                    labelId='type'
                    onChange={handleType}
                    inputProps={{ placeholder: 'Select a Role' }}
                  >
                    <MenuItem value='HOUSE'>HOUSE</MenuItem>
                    <MenuItem value='APARTMENT'>APARTMENT</MenuItem>
                    <MenuItem value='COMMERCIAL'>COMMERCIAL</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              {/* <Grid item sm={4} xs={12}>
                <FormControl fullWidth>
                  <InputLabel id='status'>Status</InputLabel>
                  <Select
                    value={statusFilter}
                    id='status'
                    label='Select Status'
                    labelId='status'
                    onChange={handleStatus}
                    inputProps={{ placeholder: 'Select Agent' }}
                  >
                    <MenuItem value=''>None</MenuItem>
                    <MenuItem value='active'>Active</MenuItem>
                    <MenuItem value='inactive'>Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Grid> */}
            </Grid>
            <Grid sx={{ display: 'flex', justifyContent: 'end' }}>
              <Button variant='contained' color='primary' onClick={handleFiltersValues}>
                Search
              </Button>
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

export default RealState
