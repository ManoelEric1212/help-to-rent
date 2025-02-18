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
import { filters, getAllRealStates, getFilteredRealStates, RealStateType } from 'src/requests/realStateRequest'
import { getRegionRequest, Region } from 'src/requests/regionRequest'
import SearchIcon from '@mui/icons-material/Search'
import { useItems } from 'src/context/ItemsContext'

export interface SubItemsIntention {
  intention: 'FOR_RENT' | 'FOR_SALE' | 'COMMERCIAL'
  subItems: string[]
}

const SearchFiltersItem = () => {
  const [areaFilter, setAreaFilter] = useState<string>('')
  const [regionFilter, setRegionFilter] = useState<string>('')
  const [regionOptions, setRegionOptions] = useState<Region[]>([])
  const [optionsRegions, setOptionsRegions] = useState<Region[]>([])
  const [bedroomsFilter, setBedroomsFilter] = useState<number>(2)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [realStates, setRealStates] = useState<RealStateType[]>([])
  const [intentionStatus, setIntentionStatus] = useState<string>('')
  const [subIntentionStatus, setSubIntentionStatus] = useState<string>('')

  // const [realStatesFilter, setRealStatesFilter] = useState<RealStateType[]>([])
  const { setItemsMosted } = useItems()

  const [minPrice, setMinPrice] = useState<number>(0)
  const [maxPrice, setMaxPrice] = useState<number>(2000)

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
      setRealStates(data)
      setItemsMosted(data)
    } catch (error) {
      console.warn(error)
    }
  }
  useEffect(() => {
    getRealStates()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    getRegionOptions()
  }, [])

  const formatSubIntentionStatus = (intention: string) => {
    switch (intention) {
      case 'FOR_RENT':
        return ['SHORT_LET', 'LONG_LET']
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
    try {
      const realStates = await getFilteredRealStates({
        region: data.region,
        area_region: data.area_region,
        intentionStatus: data.intentionStatus,
        subIntentionStatus: data.intentionStatus,
        minPrice: data.minPrice,
        maxPrice: data.maxPrice,
        roomsNumber: data.roomsNumber
      })

      return realStates
    } catch (error) {
      console.error(error)
    }
  }

  const handleFiltersValues = async (): Promise<void> => {
    const data = await fetchRealStates({
      area_region: areaFilter,
      intentionStatus: intentionStatus,
      maxPrice: maxPrice,
      minPrice: minPrice,
      region: regionFilter,

      roomsNumber: bedroomsFilter,
      subIntentionStatus: subIntentionStatus
    })
    console.log('data', data)

    setItemsMosted(data ?? [])
  }

  return (
    <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', gap: '0.7rem', flexDirection: { md: 'row', xs: 'column', sm: 'row' } }}>
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
              value={areaFilter || ''}
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
              <MenuItem value='TOURIST_REGION'>TOURIST_REGION</MenuItem>

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

        <Grid item sm={2} md={2} xs={12}>
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

        <Grid item sm={2} md={2} xs={6}>
          <TextField
            label='Min Price(€)'
            type='number'
            value={minPrice}
            onChange={e => setMinPrice(Number(e.target.value))}
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
        <Grid item sm={2} md={2} xs={6}>
          <TextField
            label='Max Price(€)'
            type='number'
            value={maxPrice}
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
            onChange={e => setMaxPrice(Number(e.target.value))}
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
                backgroundColor: '#815556'
              }
            }}
          >
            Search
          </Button>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default SearchFiltersItem
