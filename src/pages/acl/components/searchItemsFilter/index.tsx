/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  TextField,
  Box,
  Button
} from '@mui/material'
import { useEffect, useState } from 'react'
import {
  filters,
  getAllRealStates,
  getAllRealStatesClient,
  getFilteredRealStates,
  RealStateType
} from 'src/requests/realStateRequest'
import { getRegionRequest, Region } from 'src/requests/regionRequest'
import SearchIcon from '@mui/icons-material/Search'
import { useItems } from 'src/context/ItemsContext'

// import ManageSearchIcon from '@mui/icons-material/ManageSearch'
import FiltersModal from './modalFilters'
import { useRouter } from 'next/router'

export interface SubItemsIntention {
  intention: 'FOR_RENT' | 'FOR_SALE' | 'COMMERCIAL'
  subItems: string[]
}

const SearchFiltersItem = () => {
  const [areaFilter, setAreaFilter] = useState<string>('')
  const [regionFilter, setRegionFilter] = useState<string>('')
  const [regionOptions, setRegionOptions] = useState<Region[]>([])
  const [typeFilter, setTypeFilter] = useState<string>('')

  const [optionsRegions, setOptionsRegions] = useState<Region[]>([])
  const [bedroomsFilter, setBedroomsFilter] = useState<number>(0)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [realStates, setRealStates] = useState<RealStateType[]>([])
  const [intentionStatus, setIntentionStatus] = useState<string>('')
  const [subIntentionStatus, setSubIntentionStatus] = useState<string>('')

  // const [realStatesFilter, setRealStatesFilter] = useState<RealStateType[]>([])
  const { setItemsMosted, setLoading, setItemsMosted2 } = useItems()

  const [minPrice, setMinPrice] = useState<number>(0)
  const [maxPrice, setMaxPrice] = useState<number>(0)
  const [isModalOpen2, setIsModalOpen2] = useState(false)

  const router = useRouter()

  // const theme = useTheme()

  const handleArea = (e: SelectChangeEvent<string>): void => {
    const dataOptions = regionOptions.filter(item => item.area_region === e.target.value)

    setOptionsRegions(dataOptions ?? [])
    setAreaFilter(e.target.value)
  }

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
      const data = await getAllRealStates()
      setItemsMosted2(data)
      const dataFiltered = data.filter(item => item.flagClient === 'TRUE')
      setRealStates(dataFiltered)
      setItemsMosted(dataFiltered)
    } catch (error) {
      console.warn(error)
    }
  }

  async function getRealStates2() {
    try {
      const data = await getAllRealStatesClient()
      setItemsMosted(data)
    } catch (error) {
      console.warn(error)
    }
  }
  const handleCloseModal2 = () => {
    setIsModalOpen2(false)
  }
  const handleType = (e: SelectChangeEvent<string>): void => {
    setTypeFilter(e.target.value)
  }

  useEffect(() => {
    getRealStates()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    getRealStates2()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    getRegionOptions()
  }, [])

  const formatSubIntentionStatus = (intention: string) => {
    switch (intention) {
      case 'FOR_RENT':
        return ['LONG_LET', 'SHORT_LET']
        break
      case 'FOR_SALE':
        return ['RESIDENTIAL', 'COMMERCIAL']

        break
      case 'COMMERCIAL':
        return ['FOR_RENT']
        break
      default:
        return ['']
    }
  }

  async function fetchRealStates(data: filters) {
    setLoading(true)
    try {
      const realStates = await getFilteredRealStates({
        region: data.region,
        area_region: data.area_region,
        intentionStatus: data.intentionStatus,
        subIntentionStatus: data.subIntentionStatus,
        minPrice: data.minPrice,
        maxPrice: data.maxPrice,
        type: data.type,
        roomsNumber: data.roomsNumber
      })
      setLoading(false)

      return realStates
    } catch (error) {
      setLoading(false)

      console.error(error)
    }
  }

  const handleFiltersValues = async (): Promise<void> => {
    const filters = {
      intentionStatus,
      maxPrice: maxPrice,
      minPrice,
      region: regionFilter,
      subIntentionStatus,
      roomsNumber: bedroomsFilter,
      area_region: areaFilter,
      type: typeFilter
    }

    const filteredData = Object.fromEntries(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Object.entries(filters).filter(
        ([_, value]) => value !== undefined && value !== null && value !== '' && value !== 0
      )
    )

    const data = await fetchRealStates(filteredData)

    console.log('data222', data)

    setItemsMosted2(data ?? [])
    router.replace('/acl/properties')
  }

  return (
    <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Grid container spacing={1}>
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box
            sx={{
              display: 'flex',
              gap: '0.7rem',
              flexDirection: { md: 'row', xs: 'column', sm: 'row' },
              width: '100%'
            }}
          >
            {['FOR_RENT', 'FOR_SALE', 'COMMERCIAL'].map(status => (
              <Box
                key={status}
                onClick={() => {
                  setIntentionStatus(status)
                }}
                sx={{
                  display: 'flex',
                  borderRadius: '16px',
                  border: 'solid 1px #000',
                  cursor: 'pointer',
                  padding: '7px',
                  fontSize: '1rem',
                  color: intentionStatus == status ? '#fff' : '#8B181B',
                  background: intentionStatus == status ? '#8B181B' : '#fff',
                  fontWeight: 'bold',
                  justifyContent: 'center',
                  '&:hover': {
                    backgroundColor: '#804345',
                    color: '#fff'
                  }
                }}
              >
                {status.replace('_', ' ').toUpperCase()}
                {}
              </Box>
            ))}
          </Box>
          {/* <Box>
            <Box
              onClick={() => {
                setIsModalOpen2(true)
              }}
              sx={{
                display: 'flex',
                borderRadius: '16px',
                border: 'solid 1px #ebebeb',
                cursor: 'pointer',
                backgroundColor: '#8B181B',
                padding: '7px',
                fontSize: '1rem',
                color: '#e5e0e0',
                fontWeight: 'bold',
                justifyContent: 'center',
                gap: '4px',
                '&:hover': {
                  backgroundColor: '#804345',
                  color: '#fff'
                }
              }}
            >
              <ManageSearchIcon />
              Detailed Search
            </Box>
          </Box> */}
        </Grid>

        {intentionStatus.length ? (
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: '0.7rem', flexDirection: { md: 'row', xs: 'row', sm: 'row' } }}>
              {formatSubIntentionStatus(intentionStatus).map(status => (
                <Box
                  key={status}
                  onClick={() => {
                    setSubIntentionStatus(status)
                  }}
                  sx={{
                    display: 'flex',
                    borderRadius: '16px',
                    border: 'solid 1px #000',
                    cursor: 'pointer',
                    padding: '7px',
                    fontSize: '1rem',
                    color: subIntentionStatus == status ? '#fff' : '#8B181B',
                    background: subIntentionStatus == status ? '#8B181B' : '#fff',
                    fontWeight: 'bold',
                    justifyContent: 'center',
                    '&:hover': {
                      backgroundColor: '#804345',
                      color: '#fff'
                    }
                  }}
                >
                  {status.replace('_', ' ').toUpperCase()}
                  {}
                </Box>
              ))}
            </Box>
          </Grid>
        ) : (
          <></>
        )}
      </Grid>
      <Grid
        container
        spacing={1}
        sx={{
          background: 'white',
          paddingBottom: '10px',
          paddingRight: '5px',
          borderRadius: '16px',
          display: 'flex',
          justifyContent: 'space-around'
        }}
      >
        <Grid item sm={2} md={2} xs={12}>
          <FormControl fullWidth>
            <InputLabel id='type-label' sx={{ color: '#8B181B', '&.Mui-focused': { color: '#8B181B' } }}>
              Area
            </InputLabel>
            <Select
              labelId='type-label'
              id='type-label'
              label='Area'
              value={areaFilter}
              onChange={handleArea}
              sx={{
                color: '#8B181B', // Cor do texto selecionado
                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#8B181B' }, // Cor da borda normal
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#8B181B' }, // Borda ao passar o mouse
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#8B181B' }, // Borda quando focado
                '& .MuiSelect-icon': { color: '#8B181B' } // Ícone da setinha do Select branco
              }}
            >
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
        <Grid item sm={2} md={2} xs={12}>
          <FormControl fullWidth>
            <InputLabel id='region' sx={{ color: '#8B181B', '&.Mui-focused': { color: '#8B181B' } }}>
              Location
            </InputLabel>
            <Select
              sx={{
                color: '#8B181B', // Cor do texto selecionado
                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#8B181B' }, // Cor da borda normal
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#8B181B' }, // Borda ao passar o mouse
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#8B181B' }, // Borda quando focado
                '& .MuiSelect-icon': { color: '#8B181B' } // Ícone da setinha do Select branco
              }}
              value={regionFilter}
              id='region'
              label='Location'
              labelId='region'
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 300, // altura máxima do menu
                    width: 250 // largura do menu
                  }
                }
              }}
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

        {intentionStatus === 'COMMERCIAL' ? (
          <>
            <Grid item sm={2} md={2} xs={12}>
              <FormControl fullWidth>
                <InputLabel id='type-label' sx={{ color: '#8B181B', '&.Mui-focused': { color: '#8B181B' } }}>
                  Type
                </InputLabel>
                <Select
                  labelId='type-label'
                  value={typeFilter || ''}
                  onChange={handleType}
                  label='Type'
                  sx={{
                    color: '#8B181B', // Cor do texto selecionado
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#8B181B' }, // Cor da borda normal
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#8B181B' }, // Borda ao passar o mouse
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#8B181B' }, // Borda quando focado
                    '& .MuiSelect-icon': { color: '#8B181B' } // Ícone da setinha do Select branco
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
                <InputLabel id='type' sx={{ color: '#8B181B', '&.Mui-focused': { color: '#8B181B' } }}>
                  Type
                </InputLabel>
                <Select
                  labelId='type'
                  value={typeFilter || ''}
                  id='type'
                  label='Type'
                  onChange={handleType}
                  sx={{
                    color: '#8B181B', // Cor do texto selecionado
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#8B181B' }, // Cor da borda normal
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#8B181B' }, // Borda ao passar o mouse
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#8B181B' }, // Borda quando focado
                    '& .MuiSelect-icon': { color: '#8B181B' } // Ícone da setinha do Select branco
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

        <Grid item sm={1.5} md={1.5} xs={12}>
          <FormControl fullWidth>
            <InputLabel sx={{ color: '#8B181B', '&.Mui-focused': { color: '#8B181B' } }} id='bedrooms'>
              Nº of Bedrooms
            </InputLabel>
            <Select
              sx={{
                color: '#8B181B', // Cor do texto selecionado
                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#8B181B' }, // Cor da borda normal
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#8B181B' }, // Borda ao passar o mouse
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#8B181B' }, // Borda quando focado
                '& .MuiSelect-icon': { color: '#8B181B' } // Ícone da setinha do Select branco
              }}
              value={String(bedroomsFilter)}
              id='bedrooms'
              label='Nº of Bedrooms'
              labelId='bedrooms'
              onChange={(e: SelectChangeEvent<string>) => setBedroomsFilter(Number(e.target.value))}
            >
              <MenuItem value='2'>1-2</MenuItem>
              <MenuItem value='3'>3-4</MenuItem>
              <MenuItem value='4'>5-6</MenuItem>
              <MenuItem value='5'>Above 6</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item sm={1.5} md={1.5} xs={6}>
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
            sx={{
              '& label': { color: '#8B181B' }, // Cor do label
              '& label.Mui-focused': { color: '#8B181B' }, // Cor do label quando focado
              '& .MuiOutlinedInput-root': {
                color: '#8B181B', // Cor do texto digitado
                '& fieldset': { borderColor: '#8B181B' }, // Cor da borda normal
                '&:hover fieldset': { borderColor: '#8B181B' }, // Borda ao passar o mouse
                '&.Mui-focused fieldset': { borderColor: '#8B181B' } // Borda quando focado
              },
              '& .MuiInputBase-input': { color: '#8B181B' } // Cor do texto dentro do input
            }}
          />
        </Grid>
        <Grid item sm={1.5} md={1.5} xs={6}>
          <TextField
            label='Max Price(€)'
            value={maxPrice === 0 ? '' : maxPrice}
            sx={{
              '& label': { color: '#8B181B' }, // Cor do label
              '& label.Mui-focused': { color: '#8B181B' }, // Cor do label quando focado
              '& .MuiOutlinedInput-root': {
                color: 'white', // Cor do texto digitado
                '& fieldset': { borderColor: '#8B181B' }, // Cor da borda normal
                '&:hover fieldset': { borderColor: '#8B181B' }, // Borda ao passar o mouse
                '&.Mui-focused fieldset': { borderColor: '#8B181B' } // Borda quando focado
              },
              '& .MuiInputBase-input': { color: '#8B181B' } // Cor do texto dentro do input
            }}
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

        <Grid item sx={{ display: 'flex', alignItems: 'center' }}>
          <Button
            endIcon={<SearchIcon />}
            onClick={handleFiltersValues}
            sx={{
              background: '#8B181B',
              color: '#fff',
              height: '7vh',
              '&:hover': {
                backgroundColor: '#8c3d3f'
              }
            }}
          >
            Search
          </Button>
        </Grid>
      </Grid>
      <FiltersModal handleClose={handleCloseModal2} open={isModalOpen2} />
    </Grid>
  )
}

export default SearchFiltersItem
