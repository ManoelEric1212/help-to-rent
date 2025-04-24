/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from 'react'
import Grid from '@mui/material/Grid'

import { ThemeProvider, createTheme } from '@mui/material/styles'
import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, TextField, Button } from '@mui/material'
import { getRegionRequest, Region } from 'src/requests/regionRequest'
import SearchIcon from '@mui/icons-material/Search'
import { filters, getFilteredRealStates } from 'src/requests/realStateRequest'
import { useItems } from 'src/context/ItemsContext'
import FiltersModal from '../searchItemsFilter/modalFilters'

import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd'

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536
    }
  }
})

const SearchProperties = () => {
  const [intentionStatus, setIntentionStatus] = React.useState<string>('')
  const [typeFilter, setTypeFilter] = React.useState<string>('')
  const [regionFilter, setRegionFilter] = React.useState<string>('')
  const [optionsRegions, setOptionsRegions] = React.useState<Region[]>([])
  const [areaFilter, setAreaFilter] = React.useState<string>('')
  const [isModalOpen2, setIsModalOpen2] = React.useState(false)
  const [bedroomsFilter, setBedroomsFilter] = React.useState<number>(0)

  const [subIntentionStatus, setSubIntentionStatus] = React.useState<string>('')

  const { setItemsMosted2, setLoading } = useItems()

  const handleArea = (e: SelectChangeEvent<string>): void => {
    const dataOptions = optionsRegions.filter(item => item.area_region === e.target.value)

    setOptionsRegions(dataOptions ?? [])
    setAreaFilter(e.target.value)
  }

  const handleArea2 = (e: SelectChangeEvent<string>): void => {
    if (e.target.value === '') {
      setSubIntentionStatus('')
    }
    setIntentionStatus(e.target.value)
  }

  const handleArea3 = (e: SelectChangeEvent<string>): void => {
    setSubIntentionStatus(e.target.value)
  }

  const handleType = (e: SelectChangeEvent<string>): void => {
    setTypeFilter(e.target.value)
  }
  const [minPrice, setMinPrice] = React.useState<number>(0)
  const [maxPrice, setMaxPrice] = React.useState<number>(0)
  const getRegionOptions = async () => {
    try {
      const dataOptions = await getRegionRequest()
      setOptionsRegions(dataOptions)
    } catch (error) {
      throw new Error('Erro get region options')
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
        roomsNumber: data.roomsNumber,
        type: data.type
      })
      setLoading(false)

      return realStates
    } catch (error) {
      console.error(error)
      setLoading(false)
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
    console.log('filters', filters)

    // Remove campos vazios (null, undefined ou strings vazias)
    const filteredData = Object.fromEntries(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Object.entries(filters).filter(
        ([_, value]) => value !== undefined && value !== null && value !== '' && value !== 0
      )
    )

    const data = await fetchRealStates(filteredData)
    console.log('aa', data)

    if (typeFilter.length && data?.length) {
      const filters = data?.filter(item => item.type === typeFilter)
      setItemsMosted2(filters ?? [])

      return
    }
    setItemsMosted2(data ?? [])
  }

  const handleCloseModal2 = () => {
    setIsModalOpen2(false)
  }

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

  React.useEffect(() => {
    getRegionOptions()
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <>
        <Grid
          container
          spacing={2}
          sx={{
            flexDirection: { xs: 'column', sm: 'row' },
            background: '#fff',
            padding: '1.2rem',
            borderRadius: '10px'
          }}
        >
          <Grid item sm={2} md={2} xs={12}>
            <FormControl fullWidth>
              <InputLabel id='type-label' sx={{ color: '#8B181B', '&.Mui-focused': { color: '#8B181B' } }}>
                Category
              </InputLabel>
              <Select
                labelId='type-label'
                defaultValue='FOR_RENT'
                label='Category'
                value={intentionStatus || ''}
                onChange={handleArea2}
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

                <MenuItem value='FOR_RENT'>FOR RENT</MenuItem>
                <MenuItem value='FOR_SALE'>FOR SALE</MenuItem>
                <MenuItem value='COMMERCIAL'>COMMERCIAL</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {intentionStatus.length ? (
            <Grid item sm={2} md={2} xs={12}>
              <FormControl fullWidth>
                <InputLabel id='type-label' sx={{ color: '#8B181B', '&.Mui-focused': { color: '#8B181B' } }}>
                  Sub-category
                </InputLabel>
                <Select
                  labelId='type-label'
                  defaultValue='FOR_RENT'
                  label='Sub-category'
                  value={subIntentionStatus || ''}
                  onChange={handleArea3}
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

                  {formatSubIntentionStatus(intentionStatus).map((item, i) => (
                    <MenuItem value={item} key={i}>
                      {item.replace('_', ' ').toUpperCase()}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          ) : (
            <></>
          )}

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
                  <InputLabel id='type-label' sx={{ color: '#8B181B', '&.Mui-focused': { color: '#8B181B' } }}>
                    Type
                  </InputLabel>
                  <Select
                    labelId='type-label'
                    value={typeFilter || ''}
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

          <Grid item sm={2} md={2} xs={12}>
            <FormControl fullWidth>
              <InputLabel id='type-label' sx={{ color: '#8B181B', '&.Mui-focused': { color: '#8B181B' } }}>
                Area
              </InputLabel>
              <Select
                labelId='type-label'
                value={areaFilter || ''}
                label='Area'
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
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 300, // altura máxima do menu
                      width: 250 // largura do menu
                    }
                  }
                }}
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

          <Grid item sm={2} md={2} xs={12}>
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
          <Grid item sm={2} md={2} xs={12}>
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
          <Grid item sm={2} md={2} xs={12} sx={{ display: 'flex' }}>
            <Button onClick={handleFiltersValues}>
              <SearchIcon fontSize='large' sx={{ color: '#8B181B' }} />
            </Button>
            {/* <Button
              onClick={() => {
                setIsModalOpen2(true)
              }}
            >
              <PlaylistAddIcon fontSize='large' sx={{ color: '#8B181B' }} />
            </Button> */}
          </Grid>
        </Grid>
        <FiltersModal handleClose={handleCloseModal2} open={isModalOpen2} />
      </>
    </ThemeProvider>
  )
}

export default SearchProperties
