/* eslint-disable lines-around-comment */
// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import CardHeader from '@mui/material/CardHeader'
import TableBasic from './components/TableBasic'
import { Button, CardContent, TextField } from '@mui/material'
import { ChangeEvent, useEffect, useState } from 'react'
import { GridColDef } from '@mui/x-data-grid'

import DialogEdit from './components/DialogEdit'
import { getRegionRequest, Region } from 'src/requests/regionRequest'
import DialogCreate from './components/DialogCreate'

export interface CellType {
  row: Region
}

export interface DataGridDataRegionType {
  columns: GridColDef[]
  rows: Region[]
}

const Regions = () => {
  const [data, setData] = useState<DataGridDataRegionType>({ columns: [], rows: [] })
  const [regions, setRegions] = useState<Region[]>([])
  const [nameFilter, setNameFilter] = useState<string>('')

  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [modalOpenCreate, setModalOpenCreate] = useState<boolean>(false)

  const [modalData, setModalData] = useState<Region | null>(null)

  const columns: GridColDef[] = [
    {
      flex: 0.1,
      field: 'region_name',
      minWidth: 230,
      headerName: 'Name'
    },
    {
      flex: 0.25,
      minWidth: 80,
      field: 'description',
      headerName: 'Description'
    },

    {
      flex: 0.05,
      field: 'action',
      minWidth: 80,
      headerName: 'Action',
      renderCell: ({ row }: CellType) => {
        return (
          <Button
            variant='outlined'
            color='primary'
            onClick={() => {
              setModalData(row)
              setTimeout(() => {
                setModalOpen(true)
              }, 100)
            }}
          >
            {' '}
            Edit{' '}
          </Button>
        )
      }
    }
  ]

  async function getRegions() {
    try {
      const data = await getRegionRequest()
      setRegions(data)
      const dataTable: DataGridDataRegionType = {
        columns: columns,
        rows: data
      }
      setData(dataTable)
    } catch (error) {
      console.warn(error)
    }
  }

  const handleCloseModal = () => {
    setTimeout(() => {
      getRegions()
    }, 700)

    setModalOpen(false)
  }
  const handleCloseModalCreate = () => {
    setTimeout(() => {
      getRegions()
    }, 700)

    setModalOpenCreate(false)
  }

  const handleName = (event: ChangeEvent<HTMLInputElement>) => setNameFilter(event.target.value)

  const handleFiltersValues = () => {
    const filtered = regions.filter(region => {
      const matchesName = region.region_name.toLowerCase().includes(nameFilter.toLowerCase())

      return matchesName
    })
    const dataTableFiltered: DataGridDataRegionType = {
      columns: columns,
      rows: filtered
    }
    setData(dataTableFiltered)
  }
  useEffect(() => {
    getRegions()
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
                <TextField fullWidth label='Name' placeholder='Region 1...' value={nameFilter} onChange={handleName} />
              </Grid>
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
        <TableBasic columns={data.columns} rows={data.rows} setModalOpen={setModalOpenCreate} />
      </Grid>
      <DialogEdit open={modalOpen} onClose={handleCloseModal} data={modalData} />
      <DialogCreate onClose={handleCloseModalCreate} open={modalOpenCreate} />
    </Grid>
  )
}

export default Regions
