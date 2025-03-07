import React, { useEffect, useState } from 'react'
import {
  Modal,
  Box,
  useMediaQuery,
  Grid,
  Checkbox,
  FormControlLabel,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Button
} from '@mui/material'
import { Region, getRegionRequest } from 'src/requests/regionRequest'
import SearchIcon from '@mui/icons-material/Search'
import { filters, getFilteredRealStates } from 'src/requests/realStateRequest'
import { useItems } from 'src/context/ItemsContext'
import { useRouter } from 'next/router'

// interface Owner {
//   mainPhone: string
//   altPhone?: string
//   name?: string
//   codeNumber: string
//   email?: string
// }

interface OwnerDetailsModalProps {
  open: boolean
  handleClose: () => void
}

const checkBoxOptions = [
  'APARTMENT',
  'BLOCK OF APARTMENTS',
  'DETACHED VILLA',
  'DUPLEX APARTMENT',
  'FARMHOUSE',
  'HOUSE OF CHARACTER',
  'MAISONETTE',
  'PENTHOUSE',
  'STUDIO',
  'TOWNHOUSE',
  'VILLA',
  'TERRACE HOUSE'
]

const FiltersModal: React.FC<OwnerDetailsModalProps> = ({ open, handleClose }) => {
  const isSmallScreen = useMediaQuery('(max-width:600px)')
  const [intentionStatus, setIntentionStatus] = useState<string>('')
  const [areaFilter, setAreaFilter] = useState<string>('')
  const [regionFilter, setRegionFilter] = useState<string>('')
  const [regionOptions, setRegionOptions] = useState<Region[]>([])
  const [optionsRegions, setOptionsRegions] = useState<Region[]>([])
  const [bedroomsFilter, setBedroomsFilter] = useState<number>(2)
  const [minPrice, setMinPrice] = useState<number>(0)
  const [maxPrice, setMaxPrice] = useState<number>(2000)

  const router = useRouter()

  const { setItemsMosted2 } = useItems()

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

  useEffect(() => {
    getRegionOptions()
  }, [])

  const [selectedValues, setSelectedValues] = useState<string[]>([])

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
      roomsNumber: bedroomsFilter
    })
    console.log('data', data)

    setItemsMosted2(data ?? [])
    handleClose()
    router.replace('/acl/properties')
  }

  const handleCheckboxChange = (value: string) => {
    setSelectedValues(prev => (prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]))
  }

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: isSmallScreen ? '90%' : 800,
          maxHeight: '80vh', // Altura fixa para o modal
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 2,
          borderRadius: 2,
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto' // Scroll ativado
        }}
      >
        <Box sx={{ padding: '1rem', borderBottom: 'solid 1px #000' }}>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: '0.7rem', flexDirection: { md: 'row', xs: 'column', sm: 'row' } }}>
              {['FOR_RENT', 'FOR_SALE', 'COMMERCIAL'].map(status => (
                <Box
                  key={status}
                  onClick={() => setIntentionStatus(status)}
                  sx={{
                    display: 'flex',
                    borderRadius: '16px',
                    border: 'solid 1px #000',
                    cursor: 'pointer',
                    padding: '7px',
                    fontSize: '1rem',
                    color: intentionStatus === status ? '#fff' : '#8B181B',
                    background: intentionStatus === status ? '#8B181B' : '#fff',
                    fontWeight: 'bold',
                    justifyContent: 'center',
                    '&:hover': {
                      backgroundColor: '#804345',
                      color: '#fff'
                    }
                  }}
                >
                  {status.replace('_', ' ').toUpperCase()}
                </Box>
              ))}
            </Box>
          </Grid>
        </Box>

        <Box
          sx={{
            padding: '1rem',
            borderBottom: 'solid 1px #000',
            flexGrow: 1 // Permite que o conteúdo cresça
          }}
        >
          <h3>Property Types</h3>
          <Grid container spacing={6}>
            {[0, 1].map(col => (
              <Grid item sm={6} xs={12} key={col}>
                <Grid container spacing={2} direction='column'>
                  {checkBoxOptions
                    .filter((_, index) => index % 2 === col)
                    .map(option => (
                      <Grid item key={option}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={selectedValues.includes(option)}
                              onChange={() => handleCheckboxChange(option)}
                            />
                          }
                          label={option}
                        />
                      </Grid>
                    ))}
                </Grid>
              </Grid>
            ))}
          </Grid>
        </Box>
        <Box
          sx={{
            padding: '1rem',
            borderBottom: 'solid 1px #000',
            flexGrow: 1 // Permite que o conteúdo cresça
          }}
        >
          <h3>Another details</h3>
          <Grid container spacing={1}>
            <Grid item sm={4} md={4} xs={12}>
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
            <Grid item sm={4} md={4} xs={12}>
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
          </Grid>
        </Box>
        <Box
          sx={{
            padding: '1rem',
            flexGrow: 1 // Permite que o conteúdo cresça
          }}
        >
          <h3>Rooms</h3>
          <Grid container spacing={1}>
            <Grid item sm={4} md={4} xs={12}>
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
          </Grid>
        </Box>
        <Box
          sx={{
            padding: '1rem',
            dispay: 'flex',
            alignItems: 'center',
            justifyItems: 'end'
          }}
        >
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
        </Box>
      </Box>
    </Modal>
  )
}

export default FiltersModal
