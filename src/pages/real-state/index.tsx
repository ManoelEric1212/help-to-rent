/* eslint-disable lines-around-comment */
// ** MUI Imports

import TableBasic, { DataGridDataRealState, RealStateTypeTable } from './components/TableBasic'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography
} from '@mui/material'
import { ChangeEvent, useEffect, useState } from 'react'
import EditIcon from '@mui/icons-material/Edit'

import { GridColDef } from '@mui/x-data-grid'

import { format } from 'date-fns'
import { getAllRealStates, RealStateType } from 'src/requests/realStateRequest'
import { useRouter } from 'next/router'
import { FormatRealStateToTable } from 'src/utils/format-real-states-to-table'
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { getRegionRequest, Region } from 'src/requests/regionRequest'
import LoadingOverlay from 'src/components/GlobalLoading'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'

export type DateType = Date | null | undefined

export interface CellType {
  row: RealStateTypeTable
}
interface dados {
  label: string
  value: string
}

const RealState = () => {
  const [data, setData] = useState<DataGridDataRealState>({ columns: [], rows: [] })
  const [realStates, setRealStates] = useState<RealStateType[]>([])
  const [areaFilter, setAreaFilter] = useState<string>('')

  const [regionFilter, setRegionFilter] = useState<dados[]>([])
  const [availabilityFilter, setAvailabilityFilter] = useState<Date | null>(null)
  const [bedroomsFilter, setBedroomsFilter] = useState<string>('')
  const [idPropertyFilter, setIdPropertyFilter] = useState<string>('')
  const [updatedSinceFilter, setUpdatedSinceFilter] = useState<Date | null>(null)
  const [ownerNumberFilter, setOwnerNumberFilter] = useState<string>('')
  const [ownerNameFilter, setOwnerNameFilter] = useState<string>('')
  const [descriptionKeywordFilter, setDescriptionKeywordFilter] = useState<string>('')

  const [listeds, setListeds] = useState<string[]>([])

  const [typeFilter, setTypeFilter] = useState<string>('')
  const [listed, setListed] = useState<dados[]>([])
  const [loading, setLoading] = useState(false)
  const [accordionExpanded, setAccordionExpanded] = useState(true)

  const [intentionStatus, setIntentionStatus] = useState<string>('')

  const [regionOptions, setRegionOptions] = useState<Region[]>([])
  const [optionsRegions, setOptionsRegions] = useState<Region[]>([])
  const [minPrice, setMinPrice] = useState<number>(0)
  const [maxPrice, setMaxPrice] = useState<number>(0)

  const router = useRouter()

  const columns: GridColDef[] = [
    {
      flex: 0.1,
      field: 'id',
      minWidth: 160,
      headerName: 'Real Estate',
      renderCell: ({ row }: CellType) => {
        return (
          <Box
            onClick={() => {
              window.open(`/real-state/real-state-by-id/?id=${row.id}`, '_blank')
              // router.push(`/real-state/real-state-by-id/?id=${row.id}`)
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
              src={
                row.srcImg?.length !== 0 ? `https://atlamproperties.com/uploads/${row.srcImg}` : '/images/logo100.png'
              }
              onError={e => {
                e.currentTarget.onerror = null // evita loop infinito se logo100 falhar também
                e.currentTarget.src = '/images/logo100.png'
              }}
              alt='Real State Icon'
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '0.5rem'
              }}
            />
          </Box>
        )
      }
    },
    {
      flex: 0.1,
      field: 'name',
      minWidth: 140,
      headerName: 'Name'
    },
    {
      flex: 0.11,
      minWidth: 60,
      field: 'type',
      headerName: 'Type'
    },
    {
      flex: 0.09,
      minWidth: 90,
      field: 'region',
      headerName: 'Region'
    },

    {
      flex: 0.03,
      minWidth: 50,
      field: 'id_number',
      headerName: 'ID'
    },
    {
      flex: 0.09,
      minWidth: 60,
      field: 'price',
      headerName: 'Monthly'
    },

    {
      flex: 0.08,
      type: 'inclusion_date',
      minWidth: 130,
      headerName: 'Last update',
      field: 'inclusion_date',
      valueGetter: params => format(new Date(params.value), 'dd/MM/yyyy')
    },
    {
      flex: 0.08,
      minWidth: 130,
      field: 'available_date',
      headerName: 'Availability',
      valueGetter: params => format(new Date(params.value), 'dd/MM/yyyy')
    },
    {
      flex: 0.1,
      field: 'action',
      minWidth: 70,
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
            <EditIcon />
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

      const orderedData = data.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
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
      const uniqueListed = Array.from(new Set(realStates.map(item => item.userUpdated)))
      setListeds(uniqueListed)
    }
  }, [realStates])

  useEffect(() => {
    getRegionOptions()
  }, [])

  const handleArea = (e: SelectChangeEvent<string>): void => {
    const dataOptions = regionOptions.filter(item => item.area_region === e.target.value)
    if (dataOptions.length == 0) {
      setRegionFilter([])
    }

    setOptionsRegions(dataOptions ?? [])
    setAreaFilter(e.target.value)
    setTimeout(() => {
      const activeElement = document.activeElement as HTMLElement
      if (activeElement) {
        activeElement.blur()
      }
    }, 0)
  }

  const handleArea2 = (e: SelectChangeEvent<string>): void => {
    setIntentionStatus(e.target.value)
    setTimeout(() => {
      const activeElement = document.activeElement as HTMLElement
      if (activeElement) {
        activeElement.blur()
      }
    }, 0)
  }

  const matchesDescription = (realState: RealStateType, descriptionKeywordFilter: string): boolean => {
    if (descriptionKeywordFilter.length === 0) return true

    const keywords = descriptionKeywordFilter
      .toLowerCase()
      .split(',')
      .map(keyword => keyword.trim())

    // Verificar se alguma palavra-chave corresponde à descrição
    const matchesText = keywords.some(keyword => realState.description.toLowerCase().includes(keyword))

    // Verificar se alguma palavra-chave corresponde a um atributo booleano
    const matchesAttributes = keywords.some(keyword => {
      // Procurar por atributos que contenham o texto digitado no filtro
      const matchingAttributes = Object.keys(realState).filter(key => key.toLowerCase().includes(keyword.toLowerCase()))

      return matchingAttributes.some(attributeName => {
        const attributeValue = realState[attributeName as keyof RealStateType]

        // Verificação para garantir que o valor seja um booleano ou algo que possa ser convertido
        if (typeof attributeValue === 'boolean') {
          return attributeValue === true
        }

        if (typeof attributeValue === 'string') {
          try {
            const parsed = JSON.parse(attributeValue)

            return parsed?.has === true
          } catch {
            return false
          }
        }

        // Garantindo que arrays e números não sejam considerados como verdadeiros
        return false
      })
    })

    return matchesText || matchesAttributes
  }

  // const handleStatus = (e: SelectChangeEvent) => setStatusFilter(e.target.value)
  const [isReadyToFilter, setIsReadyToFilter] = useState(false)

  const handleFiltersValues = async (): Promise<void> => {
    setLoading(true)

    const data = await getAllRealStates()
    const orderedData = data.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())

    const filtered = orderedData.filter(realState => {
      const matchesRegion = regionFilter.length === 0 || regionFilter.map(r => r.value).includes(realState.region)
      const matchesType = typeFilter ? realState.type === typeFilter : true

      const matchesAvailability = availabilityFilter
        ? new Date(realState.availabilityDate) <= new Date(availabilityFilter)
        : true

      const matchesListed = listed.length === 0 || listed.map(r => r.value).includes(realState.userUpdated)

      const matchesintention = intentionStatus ? realState.intentionStatus === intentionStatus : true

      const matchesBedrooms = bedroomsFilter
        ? (() => {
            const [min, max] = bedroomsFilter === '6+' ? [6, Infinity] : bedroomsFilter.split('-').map(Number)

            return realState.roomsNumber >= min && realState.roomsNumber <= max
          })()
        : true

      const matchesIdProperty = idPropertyFilter ? realState.id_number.toString() === idPropertyFilter : true

      const matchesUpdatedSince = updatedSinceFilter
        ? new Date(realState.updated_at) <= new Date(updatedSinceFilter)
        : true

      const matchesOwnerNumber = ownerNumberFilter ? realState.ownerNumber.includes(ownerNumberFilter) : true

      const matchesOwnerName = ownerNameFilter
        ? realState.ownerName.toLowerCase().includes(ownerNameFilter.toLowerCase())
        : true

      // const matchesDescription = descriptionKeywordFilter
      //   ? realState.description.toLowerCase().includes(descriptionKeywordFilter.toLowerCase())
      //   : true

      const matchesArea =
        areaFilter && regionFilter.length === 0
          ? realState.area_region.toLowerCase().includes(areaFilter.toLowerCase())
          : true

      const matchesPrice =
        minPrice !== 0 || maxPrice !== 0 ? realState.mensalRent >= minPrice && realState.mensalRent <= maxPrice : true

      setLoading(false)
      setAccordionExpanded(false)

      return (
        matchesArea &&
        matchesRegion &&
        matchesListed &&
        matchesAvailability &&
        matchesintention &&
        matchesBedrooms &&
        matchesIdProperty &&
        matchesUpdatedSince &&
        matchesOwnerNumber &&
        matchesOwnerName &&
        matchesType &&
        matchesDescription(realState, descriptionKeywordFilter) &&
        matchesPrice
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
    setAccordionExpanded(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (isReadyToFilter === true) {
      handleFiltersValues()
      setIsReadyToFilter(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReadyToFilter])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        event.preventDefault()
        setIsReadyToFilter(true)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    // Limpar o event listener quando o componente desmontar
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])
  // ** States

  return (
    <Grid container spacing={6} sx={{ padding: '1rem' }}>
      <Grid item xs={12}>
        <Accordion expanded={accordionExpanded} onChange={() => setAccordionExpanded(!accordionExpanded)}>
          <AccordionSummary expandIcon={<ArrowDownwardIcon />} aria-controls='panel1-content' id='panel1-header'>
            <Typography>Search Filters</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid sx={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <Grid container spacing={6}>
                <Grid item sm={2} xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id='type-label'>Area</InputLabel>
                    <Select label='Area' labelId='type-label' value={areaFilter || ''} onChange={handleArea}>
                      <MenuItem value=''>
                        <em>None</em>
                      </MenuItem>

                      <MenuItem value='NORTH'>NORTH</MenuItem>
                      <MenuItem value='CENTER'>CENTER</MenuItem>
                      <MenuItem value='SOUTH'>SOUTH</MenuItem>
                      <MenuItem value='TOURIST_REGION'>TOURIST REGION</MenuItem>

                      {/* Add more MenuItems as needed */}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item sm={4} xs={12}>
                  <Autocomplete
                    disablePortal
                    multiple
                    id='combo-box-demo'
                    options={optionsRegions.map(item => {
                      return {
                        value: item.region_name,
                        label: item.region_name
                      }
                    })}
                    value={regionFilter}
                    onChange={(event, newValue) => setRegionFilter(newValue)}
                    renderInput={params => <TextField {...params} label='Location' />}
                  />
                </Grid>

                <Grid item sm={2} md={2} xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id='type-label'>Category</InputLabel>
                    <Select
                      labelId='type-label'
                      defaultValue='FOR_RENT'
                      label='Category'
                      value={intentionStatus || ''}
                      onChange={handleArea2}
                    >
                      <MenuItem value=''>
                        <em>None</em>
                      </MenuItem>

                      <MenuItem value='FOR_RENT'>FOR RENT</MenuItem>
                      <MenuItem value='FOR_SALE'>FOR SALE</MenuItem>
                      <MenuItem value='COMMERCIAL'>COMMERCIAL</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {intentionStatus === 'COMMERCIAL' ? (
                  <>
                    <Grid item sm={2} md={2} xs={12}>
                      <FormControl fullWidth>
                        <InputLabel id='type-label'>Type</InputLabel>
                        <Select
                          labelId='type-label'
                          value={typeFilter || ''}
                          label='Type'
                          MenuProps={{
                            PaperProps: {
                              style: {
                                maxHeight: 300, // altura máxima do menu
                                width: 250 // largura do menu
                              }
                            }
                          }}
                          onChange={(e: SelectChangeEvent<string>) => {
                            setTypeFilter(e.target.value)
                            setTimeout(() => {
                              const activeElement = document.activeElement as HTMLElement
                              if (activeElement) {
                                activeElement.blur()
                              }
                            }, 0)
                          }}
                        >
                          <MenuItem value=''>
                            <em>None</em>
                          </MenuItem>

                          <MenuItem value='BARS_RESTAURANTS'>Bars & Restaurants</MenuItem>
                          <MenuItem value='COLD_STORAGE'>Cold Storage</MenuItem>
                          <MenuItem value='FACTORY'>Factory</MenuItem>
                          <MenuItem value='GARAGE_STORE'>Garage / Store (Industrial)</MenuItem>
                          <MenuItem value='HOTELS_GUESTHOUSES'>Hotels & Guesthouses</MenuItem>
                          <MenuItem value='NIGHT_CLUB'>Nightclub</MenuItem>
                          <MenuItem value='OFFICE_OFFICE_SPACE'>Office/Office Space</MenuItem>
                          <MenuItem value='PLOT'>Plot(Commercial)</MenuItem>
                          <MenuItem value='SCHOOL'>School</MenuItem>
                          <MenuItem value='SHOP'>Shop</MenuItem>
                          <MenuItem value='SHOWROOM'>Showroom</MenuItem>
                          <MenuItem value='SITE'>Site(Commercial)</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </>
                ) : (
                  <>
                    <Grid item sm={2} md={2} xs={12}>
                      <FormControl fullWidth>
                        <InputLabel id='type-label'>Type</InputLabel>
                        <Select
                          labelId='type-label'
                          value={typeFilter || ''}
                          MenuProps={{
                            PaperProps: {
                              style: {
                                maxHeight: 300, // altura máxima do menu
                                width: 250 // largura do menu
                              }
                            }
                          }}
                          label='Type'
                          onChange={(e: SelectChangeEvent<string>) => {
                            setTypeFilter(e.target.value)
                            setTimeout(() => {
                              const activeElement = document.activeElement as HTMLElement
                              if (activeElement) {
                                activeElement.blur()
                              }
                            }, 0)
                          }}
                        >
                          <MenuItem value=''>
                            <em>None</em>
                          </MenuItem>

                          <MenuItem value='APARTMENT'>APARTMENT</MenuItem>
                          <MenuItem value='BLOCK OF APARTMENTS'>BLOCK OF APARTMENTS</MenuItem>
                          <MenuItem value='DETACHED VILLA'>DETACHED VILLA</MenuItem>
                          <MenuItem value='DUPLEX APARTMENT'>DUPLEX APARTMENT</MenuItem>
                          <MenuItem value='FARMHOUSE'>FARMHOUSE</MenuItem>
                          <MenuItem value='HOUSE OF CHARACTER'>HOUSE OF CHARACTER</MenuItem>
                          <MenuItem value='MAISONETTE'>MAISONETTE</MenuItem>
                          <MenuItem value='PENTHOUSE'>PENTHOUSE</MenuItem>
                          <MenuItem value='STUDIO'>STUDIO</MenuItem>
                          <MenuItem value='TOWNHOUSE'>TOWNHOUSE</MenuItem>
                          <MenuItem value='VILLA'>VILLA</MenuItem>
                          <MenuItem value='TERRACE HOUSE'>TERRACE HOUSE</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </>
                )}

                <Grid item sm={2} xs={12}>
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
                      onChange={(e: SelectChangeEvent<string>) => {
                        setBedroomsFilter(e.target.value)
                        setTimeout(() => {
                          const activeElement = document.activeElement as HTMLElement
                          if (activeElement) {
                            activeElement.blur()
                          }
                        }, 0)
                      }}
                    >
                      <MenuItem value='1-2'>1-2</MenuItem>
                      <MenuItem value='3-4'>3-4</MenuItem>
                      <MenuItem value='5-6'>5-6</MenuItem>
                      <MenuItem value='6+'>Above 6</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item sm={4} xs={12}>
                  {/* <FormControl fullWidth>
                    <InputLabel id='property-type2'>Listed By</InputLabel>
                    <Select
                      value={listed}
                      id='property-type2'
                      label='Listed By'
                      labelId='property-type2'
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 300, // altura máxima do menu
                            width: 250 // largura do menu
                          }
                        }
                      }}
                      onChange={(e: SelectChangeEvent<string>) => setListed(e.target.value)}
                    >
                      {listeds.map(type => (
                        <MenuItem key={type} value={type}>
                          {type.replace(/_/g, ' ')}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl> */}

                  <Autocomplete
                    disablePortal
                    multiple
                    id='combo-box-demo'
                    options={listeds.map(item => {
                      return {
                        value: item,
                        label: item
                      }
                    })}
                    value={listed}
                    onChange={(event, newValue) => setListed(newValue)}
                    renderInput={params => <TextField {...params} label='Listed By' />}
                  />
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

                <Grid item sm={2} md={2} xs={6}>
                  <TextField
                    label='Min Price(€)'
                    value={minPrice === 0 ? '' : minPrice}
                    onChange={e => {
                      const value = e.target.value
                      if (value === '') {
                        setMinPrice(0) // Considera 0 quando o campo for vazio
                      } else {
                        setMinPrice(Number(value)) // Converte para número
                      }
                    }}
                    fullWidth
                  />
                </Grid>
                <Grid item sm={2} md={2} xs={6}>
                  <TextField
                    label='Max Price(€)'
                    value={maxPrice === 0 ? '' : maxPrice}
                    onChange={e => {
                      const value = e.target.value
                      if (value === '') {
                        setMaxPrice(0) // Considera 0 quando o campo for vazio
                      } else {
                        setMaxPrice(Number(value)) // Converte para número
                      }
                    }}
                    fullWidth
                  />
                </Grid>
              </Grid>
              <Grid sx={{ display: 'flex', justifyContent: 'end' }}>
                <Button variant='contained' color='primary' onClick={handleFiltersValues}>
                  Search
                </Button>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
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
