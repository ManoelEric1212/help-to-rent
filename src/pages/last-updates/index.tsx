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
import { getRegionRequest, Region } from 'src/requests/regionRequest'
import LoadingOverlay from 'src/components/GlobalLoading'

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
  const [typeFilter, setTypeFilter] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const [regionOptions, setRegionOptions] = useState<Region[]>([])
  const [optionsRegions, setOptionsRegions] = useState<Region[]>([])

  const router = useRouter()

  const columns: GridColDef[] = [
    {
      flex: 0.1,
      field: 'id',
      minWidth: 200,
      headerName: 'Id',
      renderCell: ({ row }: CellType) => {
        return (
          <Box
            onClick={() => {
              router.push(`/real-state/real-state-by-id/?id=${row.id}`)
              console.log('EDIT PAGE', row)
            }}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative', // Necessário para o posicionamento absoluto
              cursor: 'pointer',
              width: '100%',
              height: '100%'
            }}
          >
            <img
              src={`https://atlammalta.com/uploads/${row.srcImg}`}
              alt='Real State Icon'
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
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
      flex: 0.1,
      minWidth: 80,
      field: 'id_number',
      headerName: 'ID'
    },
    {
      flex: 0.15,
      type: 'inclusion_date',
      minWidth: 130,
      headerName: 'Update date',
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

  const getRegionOptions = async () => {
    try {
      const dataOptions = await getRegionRequest()
      setRegionOptions(dataOptions)
    } catch (error) {
      throw new Error('Erro get region options')
    }
  }

  async function getRealStates() {
    try {
      setLoading(true)

      const data = await getAllRealStates()

      const orderedData = data.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
      setRealStates(orderedData)
      const dataTable: DataGridDataRealState = {
        columns: columns,
        rows: FormatRealStateToTable(orderedData)
      }
      setData(dataTable)
      setLoading(false)
    } catch (error) {
      setLoading(false)

      console.warn(error)
    }
  }

  useEffect(() => {
    if (realStates.length) {
      const uniquePropertyTypes = Array.from(new Set(realStates.map(item => item.type)))
      setPropertyTypes(uniquePropertyTypes)
    }
  }, [realStates])

  useEffect(() => {
    getRegionOptions()
  }, [])

  const handleArea = (e: SelectChangeEvent<string>): void => {
    const dataOptions = regionOptions.filter(item => item.area_region === e.target.value)
    if (dataOptions.length == 0) {
      setRegionFilter('')
    }
    setOptionsRegions(dataOptions ?? [])
    setAreaFilter(e.target.value)
  }

  // const handleStatus = (e: SelectChangeEvent) => setStatusFilter(e.target.value)

  const handleFiltersValues = async (): Promise<void> => {
    setLoading(true)

    const data = await getAllRealStates()
    const orderedData = data.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    console.log('aq', orderedData)
    console.log('area', areaFilter)
    console.log('loc', regionFilter)

    const filtered = orderedData.filter(realState => {
      const matchesRegion = regionFilter ? realState.region === regionFilter : true

      const matchesAvailability = availabilityFilter ? new Date(realState.availabilityDate) <= availabilityFilter : true

      const matchesBedrooms = bedroomsFilter
        ? (() => {
            const [min, max] = bedroomsFilter === '6+' ? [6, Infinity] : bedroomsFilter.split('-').map(Number)

            return realState.roomsNumber >= min && realState.roomsNumber <= max
          })()
        : true

      const matchesIdProperty = idPropertyFilter ? realState.id_number.toString() === idPropertyFilter : true

      const matchesUpdatedSince = updatedSinceFilter ? new Date(realState.updated_at) <= updatedSinceFilter : true

      const matchesOwnerNumber = ownerNumberFilter ? realState.ownerNumber.includes(ownerNumberFilter) : true

      const matchesOwnerName = ownerNameFilter
        ? realState.ownerName.toLowerCase().includes(ownerNameFilter.toLowerCase())
        : true

      const matchesDescription = descriptionKeywordFilter
        ? realState.description.toLowerCase().includes(descriptionKeywordFilter.toLowerCase())
        : true

      const matchesArea = areaFilter ? realState.area_region.toLowerCase().includes(areaFilter.toLowerCase()) : true
      setLoading(false)

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
                  <InputLabel id='type-label'>Area</InputLabel>
                  <Select labelId='type-label' value={areaFilter || ''} onChange={handleArea}>
                    <MenuItem value=''>
                      <em>None</em>
                    </MenuItem>

                    <MenuItem value='NORTH'>NORTH</MenuItem>
                    <MenuItem value='CENTER'>CENTER</MenuItem>
                    <MenuItem value='SOUTH'>SOUTH</MenuItem>
                    <MenuItem value='TOURIST_REGION'>TOURIST_REGION</MenuItem>

                    {/* Add more MenuItems as needed */}
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
                    {optionsRegions.map(region => (
                      <MenuItem key={region.id} value={region.region_name}>
                        {region.region_name}
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
      <LoadingOverlay loading={loading} message='Loading informations' />
    </Grid>
  )
}

export default RealState
