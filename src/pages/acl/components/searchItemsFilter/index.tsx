import {
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  TextField,
  IconButton,
  Box,
  Button
} from '@mui/material'
import { useEffect, useState } from 'react'
import { getAllRealStates, RealStateType } from 'src/requests/realStateRequest'
import { getRegionRequest, Region } from 'src/requests/regionRequest'
import SearchIcon from '@mui/icons-material/Search'

const SearchFiltersItem = () => {
  const [areaFilter, setAreaFilter] = useState<string>('')
  const [regionFilter, setRegionFilter] = useState<string>('')
  const [regionOptions, setRegionOptions] = useState<Region[]>([])
  const [optionsRegions, setOptionsRegions] = useState<Region[]>([])
  const [bedroomsFilter, setBedroomsFilter] = useState<string>('')
  const [realStates, setRealStates] = useState<RealStateType[]>([])
  const [intentionStatus, setIntentionStatus] = useState<string>('')

  // const [realStatesFilter, setRealStatesFilter] = useState<RealStateType[]>([])

  const [minPrice, setMinPrice] = useState<string>('')
  const [maxPrice, setMaxPrice] = useState<string>('')

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
    } catch (error) {
      console.warn(error)
    }
  }
  useEffect(() => {
    getRealStates()
  }, [])
  useEffect(() => {
    getRegionOptions()
  }, [])

  const handleButtonClick = (status: string) => {
    setIntentionStatus(status)
  }

  const handleFiltersValues = (): void => {
    const filtered = realStates.filter(realState => {
      const matchesRegion = regionFilter ? realState.region === regionFilter : true

      const matchesArea = areaFilter ? realState.area_region.toLowerCase().includes(areaFilter.toLowerCase()) : true
      const matchesMinPrice = minPrice ? realState.mensalRent >= parseFloat(minPrice) : true

      const matchesMaxPrice = maxPrice ? realState.mensalRent <= parseFloat(maxPrice) : true
      const matchesBedrooms = bedroomsFilter
        ? (() => {
            const [min, max] = bedroomsFilter === '6+' ? [6, Infinity] : bedroomsFilter.split('-').map(Number)

            return realState.roomsNumber >= min && realState.roomsNumber <= max
          })()
        : true

      return matchesArea && matchesRegion && matchesMinPrice && matchesMaxPrice && matchesBedrooms
    })

    // setRealStatesFilter(filtered)
    console.log('realStatesFilter', filtered)
  }

  return (
    <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Grid container>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', flexDirection: { md: 'row', xs: 'column', sm: 'row' } }}>
            {['FOR_RENT', 'FOR_SALE', 'COMMERCIAL_SALE', 'COMMERCIAL_LEASE'].map(status => (
              <Button
                key={status}
                variant={intentionStatus === status ? 'contained' : 'outlined'}
                onClick={() => handleButtonClick(status)}
                fullWidth
                sx={{ margin: 1 }}
              >
                {status.replace('_', ' ').toUpperCase()}
              </Button>
            ))}
          </Box>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item sm={3} md={4} xs={12}>
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
        <Grid item sm={3} md={4} xs={12}>
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

        <Grid item sm={3} md={4} xs={12}>
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
      </Grid>
      <Grid container spacing={2}>
        <Grid item sm={3} md={4} xs={12}>
          <TextField
            label='Min Price(€)'
            type='number'
            value={minPrice}
            onChange={e => setMinPrice(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item sm={3} md={4} xs={12}>
          <TextField
            label='Max Price(€)'
            type='number'
            value={maxPrice}
            onChange={e => setMaxPrice(e.target.value)}
            fullWidth
          />
        </Grid>

        <Grid item sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton aria-label='delete' onClick={handleFiltersValues}>
            <SearchIcon />
          </IconButton>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default SearchFiltersItem
