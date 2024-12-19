/* eslint-disable lines-around-comment */
// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import CardHeader from '@mui/material/CardHeader'
import TableBasic, { DataGridDataRealState, RealStateTypeTable } from './components/TableBasic'
import {
  Box,
  Button,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography
} from '@mui/material'
import { ChangeEvent, useEffect, useState } from 'react'
import { GridColDef } from '@mui/x-data-grid'

import { format } from 'date-fns'
import { getAllRealStates, RealStateType } from 'src/requests/realStateRequest'
import { useRouter } from 'next/router'
import { FormatRealStateToTable } from 'src/utils/format-real-states-to-table'
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

export type DateType = Date | null | undefined

export interface CellType {
  row: RealStateTypeTable
}

const RealState = () => {
  const [data, setData] = useState<DataGridDataRealState>({ columns: [], rows: [] })
  const [realStates, setRealStates] = useState<RealStateType[]>([])
  const [areaFilter, setAreaFilter] = useState<string>('')

  const [regionFilter, setRegionFilter] = useState<string>('')
  const [availabilityFilter, setAvailabilityFilter] = useState<Date | null>(null)
  const [bedroomsFilter, setBedroomsFilter] = useState<string>('')
  const [idPropertyFilter, setIdPropertyFilter] = useState<string>('')
  const [updatedSinceFilter, setUpdatedSinceFilter] = useState<Date | null>(null)
  const [ownerNumberFilter, setOwnerNumberFilter] = useState<string>('')
  const [ownerNameFilter, setOwnerNameFilter] = useState<string>('')
  const [descriptionKeywordFilter, setDescriptionKeywordFilter] = useState<string>('')
  const [propertyTypes, setPropertyTypes] = useState<string[]>([])
  const [regions, setRegions] = useState<string[]>([])
  const [typeFilter, setTypeFilter] = useState<string>('')

  // const [regionFilter, setRegionFilter] = useState<string>('')
  // const [addressFilter, setAdressFilter] = useState<string>('')
  const router = useRouter()

  const columns: GridColDef[] = [
    {
      flex: 0.1,
      field: 'id_number',
      minWidth: 130,
      headerName: 'Id',
      renderCell: ({ row }: CellType) => {
        return (
          <Box
            onClick={() => {
              router.push(`/real-state/real-state-by-id/?id=${row.id}`)
              console.log('EDIT PAGE', row)
            }}
            sx={{ display: 'flex', cursor: 'pointer' }}
          >
            <Typography sx={{ color: '#5eb1b4', textDecoration: 'underline' }}>{row.id_number}</Typography>
          </Box>
        )
      }
    },
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
              router.push(`/real-state/register/?id=${row.id}`)
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

  useEffect(() => {
    const uniqueRegions = Array.from(new Set(realStates.map(item => item.region).filter(Boolean)))
    setRegions(uniqueRegions)

    const uniquePropertyTypes = Array.from(new Set(realStates.map(item => item.type)))
    setPropertyTypes(uniquePropertyTypes)
  }, [realStates])

  const handleArea = (e: SelectChangeEvent<string>): void => {
    setAreaFilter(e.target.value)
  }

  // const handleStatus = (e: SelectChangeEvent) => setStatusFilter(e.target.value)

  const handleFiltersValues = (): void => {
    const filtered = realStates.filter(realState => {
      const matchesRegion = regionFilter ? realState.region === regionFilter : true

      const matchesAvailability = availabilityFilter ? new Date(realState.availabilityDate) <= availabilityFilter : true

      const matchesBedrooms = bedroomsFilter
        ? (() => {
            const [min, max] = bedroomsFilter === '6+' ? [6, Infinity] : bedroomsFilter.split('-').map(Number)

            return realState.roomsNumber >= min && realState.roomsNumber <= max
          })()
        : true

      const matchesIdProperty = idPropertyFilter ? realState.id_number.toString().includes(idPropertyFilter) : true

      const matchesUpdatedSince = updatedSinceFilter ? new Date(realState.updated_at) <= updatedSinceFilter : true

      const matchesOwnerNumber = ownerNumberFilter ? realState.ownerNumber.includes(ownerNumberFilter) : true

      const matchesOwnerName = ownerNameFilter
        ? realState.ownerName.toLowerCase().includes(ownerNameFilter.toLowerCase())
        : true

      const matchesDescription = descriptionKeywordFilter
        ? realState.description.toLowerCase().includes(descriptionKeywordFilter.toLowerCase())
        : true

      let matchesArea = true
      if (areaFilter) {
        const [min, max] = areaFilter.split('-').map(Number)
        if (areaFilter === '90+') {
          matchesArea = realState.area > 90
        } else {
          matchesArea = realState.area >= min && realState.area <= max
        }
      }

      return (
        // matchesName &&
        // matchesType &&
        matchesArea &&
        matchesRegion &&
        matchesAvailability &&
        matchesBedrooms &&
        matchesIdProperty &&
        matchesUpdatedSince &&
        matchesOwnerNumber &&
        matchesOwnerName &&
        matchesDescription
      )
    })

    const dataTableFiltered: DataGridDataRealState = {
      columns: columns,
      rows: FormatRealStateToTable(filtered)
    }
    setData(dataTableFiltered)
  }
  useEffect(() => {
    getRealStates()
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
                <FormControl fullWidth>
                  <InputLabel id='area'>Area</InputLabel>
                  <Select
                    value={areaFilter}
                    id='area'
                    label='Select area range'
                    labelId='area'
                    onChange={handleArea}
                    inputProps={{ placeholder: 'Select an Area Range' }}
                  >
                    <MenuItem value='0-10'>0-10</MenuItem>
                    <MenuItem value='10-20'>10-20</MenuItem>
                    <MenuItem value='20-30'>20-30</MenuItem>
                    <MenuItem value='30-40'>30-40</MenuItem>
                    <MenuItem value='40-50'>40-50</MenuItem>
                    <MenuItem value='50-70'>50-70</MenuItem>
                    <MenuItem value='70-90'>70-90</MenuItem>
                    <MenuItem value='90+'>Above 90</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item sm={4} xs={12}>
                <FormControl fullWidth>
                  <InputLabel id='region'>Location</InputLabel>
                  <Select
                    value={regionFilter}
                    id='region'
                    label='Location'
                    labelId='region'
                    onChange={(e: SelectChangeEvent<string>) => setRegionFilter(e.target.value)}
                  >
                    {regions.map(region => (
                      <MenuItem key={region} value={region}>
                        {region}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item sm={4} xs={12}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label='Availability'
                    value={availabilityFilter}
                    onChange={(newValue: Date | null) => setAvailabilityFilter(newValue)}
                    renderInput={params => <TextField {...params} fullWidth />}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>
            {/* line two */}
            <Grid container spacing={6}>
              <Grid item sm={4} xs={12}>
                <FormControl fullWidth>
                  <InputLabel id='bedrooms'>Nº of Bedrooms</InputLabel>
                  <Select
                    value={bedroomsFilter}
                    id='bedrooms'
                    label='Nº of Bedrooms'
                    labelId='bedrooms'
                    onChange={(e: SelectChangeEvent<string>) => setBedroomsFilter(e.target.value)}
                  >
                    <MenuItem value='1-2'>1-2</MenuItem>
                    <MenuItem value='3-4'>3-4</MenuItem>
                    <MenuItem value='5-6'>5-6</MenuItem>
                    <MenuItem value='6+'>Above 6</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item sm={4} xs={12}>
                <FormControl fullWidth>
                  <InputLabel id='property-type'>Property Type</InputLabel>
                  <Select
                    value={typeFilter}
                    id='property-type'
                    label='Property Type'
                    labelId='property-type'
                    onChange={(e: SelectChangeEvent<string>) => setTypeFilter(e.target.value)}
                  >
                    {propertyTypes.map(type => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item sm={4} xs={12}>
                <TextField
                  label='ID Property'
                  value={idPropertyFilter}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setIdPropertyFilter(e.target.value)}
                  fullWidth
                />
              </Grid>
            </Grid>

            {/* line three */}

            <Grid container spacing={6}>
              <Grid item sm={4} xs={12}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label='Updated Since'
                    value={updatedSinceFilter}
                    onChange={(newValue: Date | null) => setUpdatedSinceFilter(newValue)}
                    renderInput={params => <TextField {...params} fullWidth />}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item sm={4} xs={12}>
                <TextField
                  label="Owner's Number"
                  value={ownerNumberFilter}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setOwnerNumberFilter(e.target.value)}
                  fullWidth
                />
              </Grid>

              <Grid item sm={4} xs={12}>
                <TextField
                  label="Owner's Name"
                  value={ownerNameFilter}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setOwnerNameFilter(e.target.value)}
                  fullWidth
                />
              </Grid>

              <Grid item sm={4} xs={12}>
                <TextField
                  label='Description Keywords'
                  value={descriptionKeywordFilter}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setDescriptionKeywordFilter(e.target.value)}
                  fullWidth
                />
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
        {data.rows.length ? (
          <TableBasic columns={data.columns} rows={data.rows} />
        ) : (
          <Typography>Data not exists, please research your filters</Typography>
        )}
      </Grid>
    </Grid>
  )
}

export default RealState
