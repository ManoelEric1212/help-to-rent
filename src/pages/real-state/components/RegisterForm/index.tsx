import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'

import Box, { BoxProps } from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import Typography from '@mui/material/Typography'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import DirectionsIcon from '@mui/icons-material/Directions'

// ** Layout Import

// ** Hooks
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'
import {
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Switch
} from '@mui/material'
import MapRegisterComponent from '../mapComponent'
import { ChangeEvent, useEffect, useState } from 'react'
import { styled } from '@mui/material/styles'

import CloudUploadIcon from '@mui/icons-material/CloudUpload'

import CloseIcon from '@mui/icons-material/Close'
import {
  getLatAndLng,
  getLatAndLngReq,
  getRealStateById,
  RealStateType,
  registerRealState,
  updateRealState
} from 'src/requests/realStateRequest'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'
import { useMapRegister } from 'src/context/MapRegisterContext'

import { getRegionRequest, Region } from 'src/requests/regionRequest'
import { FormatRealStateToForm } from 'src/utils/format-real-state-to-form'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import { useAuth } from 'src/hooks/useAuth'

export const AvatarInput = styled(Box)(() => ({
  position: 'relative',
  alignSelf: 'center',

  '& img': {
    padding: '3px',
    border: 'solid 1px',
    width: '156px',
    opacity: '0.7',
    height: '156px',
    objectFit: 'cover'
  }
}))

type hasOrAceptType = {
  has: boolean
  observation?: string
}
export interface FormData {
  name: string
  mensalRent: number
  area: number
  address: string
  type: string
  bathNumber: number
  roomsNumber: number
  hasBalcony: hasOrAceptType
  hasAirConditioner: hasOrAceptType
  hasPool: hasOrAceptType
  hasJacuzzi: hasOrAceptType
  hasGarage: hasOrAceptType
  petAcepts: hasOrAceptType
  hasElevator: hasOrAceptType
  hasGarden: hasOrAceptType
  hasUnfurnished: hasOrAceptType
  hasYard: hasOrAceptType
  hasUse_of_Roof: hasOrAceptType
  userUpdated: string
  intentionStatus: string
  country_code: string
  availabilityDate: string
  ownerName: string
  ownerNumber: string
  ownerEmail: string
  ownerId: string
  area_region: string
  alternativeNumberOwner: string
  hasTerrace: hasOrAceptType
  additionalExpenses: string
  description: string
  status: string
  region: string
  images: any[]
}

const schema = yup.object().shape({
  name: yup.string(),
  mensalRent: yup.number(),
  area: yup.number(),
  address: yup.string(),
  type: yup.string(),
  bathNumber: yup.number(),
  roomsNumber: yup.number(),
  hasBalcony: yup.object(),
  hasAirConditioner: yup.object(),
  hasPool: yup.object(),
  hasJacuzzi: yup.object(),
  hasGarage: yup.object(),

  hasElevator: yup.object(),
  hasGarden: yup.object(),
  hasUnfurnished: yup.object(),
  hasYard: yup.object(),
  hasUse_of_Roof: yup.object(),
  userUpdated: yup.string(),

  petAcepts: yup.object(),
  energyEfficiency: yup.number(),
  hasTerrace: yup.object(),
  intentionStatus: yup.string(),
  country_code: yup.string(),
  availabilityDate: yup.string(),
  ownerName: yup.string(),
  ownerNumber: yup.string(),
  ownerEmail: yup.string(),
  ownerId: yup.string(),
  area_region: yup.string(),
  alternativeNumberOwner: yup.string(),
  additionalExpenses: yup.string(),
  description: yup.string(),
  floorPlan: yup.string(),
  status: yup.string(),
  region: yup.string(),
  petAccepts: yup.object(),
  images: yup.array()
})

const BoxWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.down('md')]: {
    maxWidth: 900
  }
}))

const RegisterRealStateComponent = () => {
  const [previews, setPreviews] = useState<string[]>([])
  const [files, setFiles] = useState<File[]>([])
  const [realStateById, setRealStateById] = useState<RealStateType | null>(null)
  const [hasFetched, setHasFetched] = useState(false)
  const [regionOptions, setRegionOptions] = useState<Region[]>([])
  const [optionsRegions, setOptionsRegions] = useState<Region[]>([])
  const [addressSearch, setAddressSearch] = useState<string>('')

  // const [regionSearch, setRegionSearch] = useState<string>('')

  const router = useRouter()
  const { id } = router.query

  const { user } = useAuth()

  const buildImageUrl = (imagePath: string) => {
    const { protocol, hostname } = window.location
    const baseUrl = `${protocol}//${hostname}${`:${5000}`}`

    return `${baseUrl}/uploads/${imagePath}`
  }

  const convertBackendImagesToFiles = async (images: { url: string }[]) => {
    const filesFromBackend = await Promise.all(
      images.map(async image => {
        const response = await fetch(buildImageUrl(image.url))
        const blob = await response.blob()

        return new File([blob], image.url.split('/').pop() || 'image', {
          type: blob.type
        })
      })
    )

    return filesFromBackend
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getRealStateByIdReq = async (idToData: string) => {
    try {
      const realStateById = await getRealStateById(idToData)
      const dataFormatted = FormatRealStateToForm(realStateById)

      setRealStateById(realStateById)
      reset(dataFormatted)
      if (dataFormatted.images.length) {
        setPreviews(dataFormatted.images.map(item => buildImageUrl(item.url)))
        const backendFiles = await convertBackendImagesToFiles(dataFormatted.images)
        setFiles(prevFiles => [...prevFiles, ...backendFiles])
      }
    } catch (error) {
      throw new Error('Error getRealStateById')
    }
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
    if (id && !hasFetched) {
      setHasFetched(true) // Marca como já executado
      getRealStateByIdReq(id as string)
    }
  }, [id, hasFetched, getRealStateByIdReq])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    setFiles(prevFiles => [...prevFiles, ...selectedFiles])

    const selectedPreviews = selectedFiles.map(file => URL.createObjectURL(file))
    setPreviews(prevPreviews => [...prevPreviews, ...selectedPreviews])
  }
  const handleRemoveImage = (index: number) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index))
    setPreviews(prevPreviews => prevPreviews.filter((_, i) => i !== index))
  }

  const { newPoint, setNewPointAddress } = useMapRegister()

  const getLatAndLng = async (data: getLatAndLng) => {
    console.log('data', data)
    try {
      const dataLatAndLng = await getLatAndLngReq(data)
      setNewPointAddress({ lat: parseFloat(dataLatAndLng[0].lat), lng: parseFloat(dataLatAndLng[0].lon) })
    } catch (error) {
      throw new Error('getLatAndLng')
    }
  }

  const defaultValues = {
    name: '',
    mensalRent: 0,
    area: 0,
    address: '',
    type: '',
    bathNumber: 0,
    roomsNumber: 0,
    hasBalcony: { has: false, observation: '' },
    hasAirConditioner: { has: false, observation: '' },
    hasPool: { has: false, observation: '' },
    hasJacuzzi: { has: false, observation: '' },
    hasGarage: { has: false, observation: '' },

    hasElevator: { has: false, observation: '' },
    hasGarden: { has: false, observation: '' },
    hasUnfurnished: { has: false, observation: '' },
    hasYard: { has: false, observation: '' },
    hasUse_of_Roof: { has: false, observation: '' },
    userUpdated: user?.fullName ?? '',

    orientation: '',
    petAcepts: { has: false, observation: '' },
    intentionStatus: '',
    country_code: '',
    availabilityDate: '',
    ownerName: '',
    ownerNumber: '',
    ownerEmail: '',
    ownerId: '',
    area_region: '',
    alternativeNumberOwner: '',

    hasTerrace: { has: false, observation: '' },
    additionalExpenses: '',
    description: '',
    floorPlan: '',
    status: '',
    region: '',
    petAccepts: { has: false, observation: '' },
    images: []
  }

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onBlur',

    resolver: yupResolver(schema)
  })

  useEffect(() => {
    getRegionOptions()
    console.log('sss')
    reset(defaultValues)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const onSubmit = async (data: FormData) => {
    const formData = new FormData()

    formData.append('name', data.name)
    formData.append('mensalRent', data.mensalRent.toString())
    formData.append('area', data.area.toString())
    formData.append('address', data.address)
    formData.append('type', data.type)
    formData.append('bathNumber', data.bathNumber.toString())
    formData.append('roomsNumber', data.roomsNumber.toString())
    formData.append('intentionStatus', data.intentionStatus)
    formData.append('country_code', data.country_code)
    formData.append('availabilityDate', data.availabilityDate)
    formData.append('ownerName', data.ownerName)
    formData.append('ownerNumber', data.ownerNumber)
    formData.append('ownerEmail', data.ownerEmail)
    formData.append('ownerId', data.ownerId)
    formData.append('area_region', data.area_region)
    formData.append('alternativeNumberOwner', data.alternativeNumberOwner)
    formData.append('additionalExpenses', data.additionalExpenses.toString())
    formData.append('description', data.description.toString())
    formData.append('hasAirConditioner', JSON.stringify(data.hasAirConditioner))
    formData.append('hasBalcony', JSON.stringify(data.hasBalcony))
    formData.append('hasGarage', JSON.stringify(data.hasGarage))
    formData.append('hasJacuzzi', JSON.stringify(data.hasJacuzzi))
    formData.append('hasPool', JSON.stringify(data.hasPool))

    formData.append('hasElevator', JSON.stringify(data.hasElevator))
    formData.append('hasGarden', JSON.stringify(data.hasGarden))
    formData.append('hasUnfurnished', JSON.stringify(data.hasUnfurnished))
    formData.append('hasYard', JSON.stringify(data.hasYard))
    formData.append('hasUse_of_Roof', JSON.stringify(data.hasUse_of_Roof))
    formData.append('userUpdated', data.userUpdated)

    formData.append('hasTerrace', JSON.stringify(data.hasTerrace))
    formData.append('petAccepts', JSON.stringify(data.petAcepts))
    formData.append('lat', (newPoint?.lat ?? 0).toString())
    formData.append('lng', (newPoint?.lng ?? 0).toString())
    formData.append('region', data.region)
    formData.append('status', data.status)

    // Adicionar as imagens no FormData
    files.forEach(file => {
      formData.append('images', file) // "images" deve ser o mesmo campo esperado no backend
    })

    try {
      if (id?.length) {
        console.log('files', files)
        const data = await updateRealState({ body: formData, id: id as string })
        if (data) {
          toast.success('Real state updated!')
          router.replace('/real-state')

          return
        }
      }
      const data = await registerRealState(formData)
      if (data) {
        toast.success('Real state registered!')
        router.replace('/real-state')
      }
    } catch (error) {
      toast.error('Real state not registered!')
    }
  }

  const handleButtonClick = (status: FormData['intentionStatus']) => {
    setValue('intentionStatus', status)
  }

  function convertTextForAddressSearch(texto: string) {
    const partes = texto.split(',', 2)

    return partes.map(parte => parte.trim())
  }

  const watchAreaRegion = watch('area_region')
  const watchIntentionStatus = watch('intentionStatus')

  useEffect(() => {
    if (watchAreaRegion && regionOptions) {
      const dataOptions = regionOptions.filter(item => item.area_region === watchAreaRegion)

      setOptionsRegions(dataOptions ?? [])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchAreaRegion])

  return (
    <Grid container spacing={1}>
      <Grid container spacing={6}>
        <Grid item sm={4} xs={12}>
          <TextField
            label='Search Address Map'
            value={addressSearch}
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <IconButton
                    type='button'
                    sx={{ p: '10px' }}
                    aria-label='search'
                    onClick={async () => {
                      if (addressSearch.length) {
                        const data = convertTextForAddressSearch(addressSearch)
                        await getLatAndLng({ address: data[0], region: data[1] ?? '' })
                      } else {
                        setNewPointAddress(null)
                      }
                    }}
                  >
                    <DirectionsIcon />
                  </IconButton>
                </InputAdornment>
              )
            }}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setAddressSearch(e.target.value)}
            fullWidth
          />
        </Grid>
      </Grid>
      <Box sx={{ width: '100vw', height: '70vh', marginTop: '0.3rem' }}>
        <MapRegisterComponent id={id as string} dataRealStateByid={realStateById} />
      </Box>
      <Box
        sx={{
          width: '100vw',
          p: 1,
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'background.paper'
        }}
      >
        <BoxWrapper>
          <Box sx={{ mb: 4 }}>
            <Typography variant='body2'>Add a Real State in database </Typography>
          </Box>
          <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
            {/* <form noValidate autoComplete='off'> */}
            <FormControl fullWidth sx={{ mb: 3 }}>
              <Controller
                name='address'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextField
                    label='Address'
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                    error={Boolean(errors.address)}
                    placeholder='Adderess'
                  />
                )}
              />
              {errors.address && <FormHelperText sx={{ color: 'error.main' }}>{errors.address.message}</FormHelperText>}
            </FormControl>

            <Grid item xs={12} sx={{ paddingBottom: '1rem' }}>
              <FormControl fullWidth>
                <Controller
                  name='intentionStatus'
                  control={control}
                  rules={{ required: 'Please select an intention status' }}
                  render={({ field }) => (
                    <>
                      <Box sx={{ display: 'flex' }}>
                        {/* Botões para cada intenção */}
                        {['FOR_RENT', 'FOR_SALE', 'COMMERCIAL_SALE', 'COMMERCIAL_LEASE'].map(status => (
                          <Button
                            key={status}
                            variant={field.value === status ? 'contained' : 'outlined'}
                            onClick={() => handleButtonClick(status)}
                            fullWidth
                            sx={{ margin: 1 }}
                          >
                            {status.replace('_', ' ').toUpperCase()}
                          </Button>
                        ))}
                      </Box>
                      {errors.intentionStatus && (
                        <FormHelperText error>{errors.intentionStatus.message}</FormHelperText>
                      )}
                    </>
                  )}
                />
              </FormControl>
            </Grid>
            <Grid container spacing={6}>
              <Grid item sm={3} xs={12}>
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <Controller
                    name='mensalRent'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <TextField
                        label='Monthly'
                        type='number'
                        value={value}
                        onBlur={onBlur}
                        onChange={onChange}
                        error={Boolean(errors.mensalRent)}
                      />
                    )}
                  />
                  {errors.mensalRent && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.mensalRent.message}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item sm={3} xs={12}>
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <Controller
                    name='area_region'
                    control={control}
                    rules={{ required: 'Type is required' }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <>
                        <InputLabel id='type-label'>Area</InputLabel>
                        <Select
                          labelId='type-label'
                          value={value || ''}
                          onBlur={onBlur}
                          onChange={onChange}
                          error={Boolean(errors.type)}
                        >
                          <MenuItem value=''>
                            <em>None</em>
                          </MenuItem>

                          <MenuItem value='NORTH'>NORTH</MenuItem>
                          <MenuItem value='CENTER'>CENTER</MenuItem>
                          <MenuItem value='SOUTH'>SOUTH</MenuItem>
                          <MenuItem value='GOZO'>GOZO</MenuItem>

                          {/* Add more MenuItems as needed */}
                        </Select>
                        {errors.type && (
                          <FormHelperText sx={{ color: 'error.main' }}>{errors.type.message}</FormHelperText>
                        )}
                      </>
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item sm={3} xs={12}>
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <Controller
                    name='region'
                    control={control}
                    rules={{ required: 'Region is required' }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <>
                        <InputLabel id='region-label'>Region</InputLabel>
                        <Select
                          labelId='region-label'
                          value={value || ''}
                          onBlur={onBlur}
                          onChange={onChange}
                          error={Boolean(errors.region)}
                        >
                          <MenuItem value='' onClick={() => setValue('description', '')}>
                            <em>None</em>
                          </MenuItem>
                          {optionsRegions.length ? (
                            optionsRegions.map((item, i) => (
                              <MenuItem
                                key={i}
                                value={item.region_name}
                                onClick={() => setValue('description', item.description)}
                              >
                                {item.region_name}
                              </MenuItem>
                            ))
                          ) : (
                            <></>
                          )}

                          {/* Add more MenuItems as needed */}
                        </Select>
                        {errors.region && (
                          <FormHelperText sx={{ color: 'error.main' }}>{errors.region.message}</FormHelperText>
                        )}
                      </>
                    )}
                  />
                </FormControl>
              </Grid>

              <Grid item sm={3} xs={12}>
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <Controller
                    name='type'
                    control={control}
                    rules={{ required: 'Type is required' }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <>
                        <InputLabel id='type-label'>Type</InputLabel>
                        <Select
                          labelId='type-label'
                          value={value || ''}
                          onBlur={onBlur}
                          onChange={onChange}
                          error={Boolean(errors.type)}
                        >
                          <MenuItem value=''>
                            <em>None</em>
                          </MenuItem>

                          <MenuItem value='HOUSE'>HOUSE</MenuItem>
                          <MenuItem value='APARTMENT'>APARTMENT</MenuItem>
                          <MenuItem value='COMMERCIAL'>COMMERCIAL</MenuItem>
                          {/* Add more MenuItems as needed */}
                        </Select>
                        {errors.type && (
                          <FormHelperText sx={{ color: 'error.main' }}>{errors.type.message}</FormHelperText>
                        )}
                      </>
                    )}
                  />
                </FormControl>
              </Grid>
            </Grid>

            <Grid container spacing={6}>
              <Grid item sm={3} xs={12}>
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <Controller
                    name='bathNumber'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <TextField
                        label='Number of Baths'
                        type='number'
                        value={value}
                        onBlur={onBlur}
                        onChange={onChange}
                        error={Boolean(errors.bathNumber)}
                      />
                    )}
                  />
                  {errors.bathNumber && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.bathNumber.message}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item sm={3} xs={12}>
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <Controller
                    name='roomsNumber'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <TextField
                        label='Number of Rooms'
                        value={value}
                        type='number'
                        onBlur={onBlur}
                        onChange={onChange}
                        error={Boolean(errors.roomsNumber)}
                      />
                    )}
                  />
                  {errors.roomsNumber && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.roomsNumber.message}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item sm={3} xs={12}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <Controller
                      name='availabilityDate'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <DatePicker
                          label='Availability Date'
                          value={value ? dayjs(value) : null} // Garantindo que o valor seja manipulado como dayjs
                          onChange={newValue => onChange(newValue ? newValue.toISOString() : '')} // Formatando a data antes de setar
                          renderInput={params => (
                            <TextField
                              {...params}
                              error={Boolean(errors.availabilityDate)}
                              helperText={errors.availabilityDate?.message}
                            />
                          )}
                        />
                      )}
                    />
                  </FormControl>
                </LocalizationProvider>
              </Grid>

              <Grid item sm={3} xs={12}>
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <Controller
                    name='status'
                    control={control}
                    rules={{ required: 'Region is required' }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <>
                        <InputLabel id='region-label'>Status</InputLabel>
                        <Select
                          labelId='region-label'
                          value={value || ''}
                          onBlur={onBlur}
                          onChange={onChange}
                          error={Boolean(errors.region)}
                        >
                          <MenuItem value=''>
                            <em>None</em>
                          </MenuItem>

                          <MenuItem value='AVAILABLE'>AVAILABLE</MenuItem>
                          <MenuItem value='SOLD'>SOLD</MenuItem>
                          <MenuItem value='RENTED'>RENTED</MenuItem>
                          {/* Add more MenuItems as needed */}
                        </Select>
                        {errors.status && (
                          <FormHelperText sx={{ color: 'error.main' }}>{errors.status.message}</FormHelperText>
                        )}
                      </>
                    )}
                  />
                </FormControl>
              </Grid>
            </Grid>

            <Grid container spacing={6}>
              <Grid item sm={3} xs={12}>
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <Controller
                    name='ownerName'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <TextField
                        label='Owner Name'
                        value={value}
                        onBlur={onBlur}
                        onChange={onChange}
                        error={Boolean(errors.ownerName)}
                      />
                    )}
                  />
                  {errors.ownerName && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.ownerName.message}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item sm={3} xs={12}>
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <Controller
                    name='ownerNumber'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <TextField
                        label='Owner Number'
                        value={value}
                        onBlur={onBlur}
                        onChange={onChange}
                        error={Boolean(errors.ownerNumber)}
                      />
                    )}
                  />
                  {errors.ownerNumber && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.ownerNumber.message}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item sm={3} xs={12}>
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <Controller
                    name='alternativeNumberOwner'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <TextField
                        label='Alternative number'
                        value={value}
                        onBlur={onBlur}
                        onChange={onChange}
                        error={Boolean(errors.alternativeNumberOwner)}
                      />
                    )}
                  />
                  {errors.alternativeNumberOwner && (
                    <FormHelperText sx={{ color: 'error.main' }}>
                      {errors.alternativeNumberOwner.message}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item sm={3} xs={12}>
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <Controller
                    name='ownerEmail'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <TextField
                        label='Owner email'
                        value={value}
                        onBlur={onBlur}
                        onChange={onChange}
                        error={Boolean(errors.alternativeNumberOwner)}
                      />
                    )}
                  />
                  {errors.ownerEmail && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.ownerEmail.message}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
            </Grid>

            <Grid container spacing={6}>
              <Grid item sm={3} xs={12}>
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <Controller
                    name='ownerId'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <TextField
                        label='Owner ID'
                        value={value}
                        onBlur={onBlur}
                        onChange={onChange}
                        error={Boolean(errors.country_code)}
                      />
                    )}
                  />
                  {errors.ownerId && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.ownerId.message}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item sm={3} xs={12}>
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <Controller
                    name='country_code'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <TextField
                        label='Country Code'
                        value={value}
                        onBlur={onBlur}
                        onChange={onChange}
                        error={Boolean(errors.country_code)}
                      />
                    )}
                  />
                  {errors.country_code && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.country_code.message}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item sm={3} xs={12}>
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <Controller
                    name='userUpdated'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <TextField
                        label='Listing by'
                        value={value}
                        onBlur={onBlur}
                        onChange={onChange}
                        error={Boolean(errors.country_code)}
                      />
                    )}
                  />
                  {errors.userUpdated && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.userUpdated.message}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
            </Grid>
            <Grid container spacing={6}>
              {watchIntentionStatus !== '' && watchIntentionStatus !== 'FOR_RENT' && (
                <Grid item sm={3} xs={12}>
                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <Controller
                      name='area'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange, onBlur } }) => (
                        <TextField
                          label='Dimensions'
                          type='number'
                          value={value}
                          onBlur={onBlur}
                          onChange={onChange}
                          error={Boolean(errors.mensalRent)}
                        />
                      )}
                    />
                    {errors.mensalRent && (
                      <FormHelperText sx={{ color: 'error.main' }}>{errors.mensalRent.message}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
              )}
            </Grid>
            <Grid container spacing={6} sx={{ marginTop: '0.5rem' }}>
              <Grid item sm={4} xs={12}>
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <Controller
                    name='hasBalcony'
                    control={control}
                    defaultValue={{ has: false, observation: '' }} // Define o estado inicial
                    render={({ field: { value, onChange } }) => (
                      <FormGroup row>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={value.has}
                              onChange={
                                e => onChange({ ...value, has: e.target.checked }) // Atualiza apenas a propriedade 'has'
                              }
                            />
                          }
                          label='Has Balcony'
                        />
                        {value.has && (
                          <TextField
                            label='Observation'
                            value={value.observation || ''}
                            onChange={
                              e => onChange({ ...value, observation: e.target.value }) // Atualiza apenas a propriedade 'observation'
                            }
                            sx={{ ml: 2 }}
                          />
                        )}
                      </FormGroup>
                    )}
                  />
                  {errors.hasBalcony?.observation && (
                    <FormHelperText sx={{ color: 'error.main' }}>
                      {errors.hasBalcony.observation.message}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item sm={4} xs={12}>
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <Controller
                    name='hasAirConditioner'
                    control={control}
                    defaultValue={{ has: false, observation: '' }} // Define o estado inicial
                    render={({ field: { value, onChange } }) => (
                      <FormGroup row>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={value.has}
                              onChange={
                                e => onChange({ ...value, has: e.target.checked }) // Atualiza apenas a propriedade 'has'
                              }
                            />
                          }
                          label='Air Conditioner'
                        />
                        {value.has && (
                          <TextField
                            label='Observation'
                            value={value.observation || ''}
                            onChange={
                              e => onChange({ ...value, observation: e.target.value }) // Atualiza apenas a propriedade 'observation'
                            }
                            sx={{ ml: 2 }}
                          />
                        )}
                      </FormGroup>
                    )}
                  />
                  {errors.hasAirConditioner?.observation && (
                    <FormHelperText sx={{ color: 'error.main' }}>
                      {errors.hasAirConditioner.observation.message}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item sm={4} xs={12}>
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <Controller
                    name='hasPool'
                    control={control}
                    defaultValue={{ has: false, observation: '' }} // Define o estado inicial
                    render={({ field: { value, onChange } }) => (
                      <FormGroup row>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={value.has}
                              onChange={
                                e => onChange({ ...value, has: e.target.checked }) // Atualiza apenas a propriedade 'has'
                              }
                            />
                          }
                          label='Pool '
                        />
                        {value.has && (
                          <TextField
                            label='Observation'
                            value={value.observation || ''}
                            onChange={
                              e => onChange({ ...value, observation: e.target.value }) // Atualiza apenas a propriedade 'observation'
                            }
                            sx={{ ml: 2 }}
                          />
                        )}
                      </FormGroup>
                    )}
                  />
                  {errors.hasPool?.observation && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.hasPool.observation.message}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item sm={4} xs={12}>
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <Controller
                    name='hasJacuzzi'
                    control={control}
                    defaultValue={{ has: false, observation: '' }} // Define o estado inicial
                    render={({ field: { value, onChange } }) => (
                      <FormGroup row>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={value.has}
                              onChange={
                                e => onChange({ ...value, has: e.target.checked }) // Atualiza apenas a propriedade 'has'
                              }
                            />
                          }
                          label='Jacuzzi'
                        />
                        {value.has && (
                          <TextField
                            label='Observation'
                            value={value.observation || ''}
                            onChange={
                              e => onChange({ ...value, observation: e.target.value }) // Atualiza apenas a propriedade 'observation'
                            }
                            sx={{ ml: 2 }}
                          />
                        )}
                      </FormGroup>
                    )}
                  />
                  {errors.hasJacuzzi?.observation && (
                    <FormHelperText sx={{ color: 'error.main' }}>
                      {errors.hasJacuzzi.observation.message}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item sm={4} xs={12}>
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <Controller
                    name='hasTerrace'
                    control={control}
                    defaultValue={{ has: false, observation: '' }} // Define o estado inicial
                    render={({ field: { value, onChange } }) => (
                      <FormGroup row>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={value.has}
                              onChange={
                                e => onChange({ ...value, has: e.target.checked }) // Atualiza apenas a propriedade 'has'
                              }
                            />
                          }
                          label='Terrace'
                        />
                        {value.has && (
                          <TextField
                            label='Observation'
                            value={value.observation || ''}
                            onChange={
                              e => onChange({ ...value, observation: e.target.value }) // Atualiza apenas a propriedade 'observation'
                            }
                            sx={{ ml: 2 }}
                          />
                        )}
                      </FormGroup>
                    )}
                  />
                  {errors.hasTerrace?.observation && (
                    <FormHelperText sx={{ color: 'error.main' }}>
                      {errors.hasTerrace.observation.message}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item sm={4} xs={12}>
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <Controller
                    name='hasGarage'
                    control={control}
                    defaultValue={{ has: false, observation: '' }} // Define o estado inicial
                    render={({ field: { value, onChange } }) => (
                      <FormGroup row>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={value.has}
                              onChange={
                                e => onChange({ ...value, has: e.target.checked }) // Atualiza apenas a propriedade 'has'
                              }
                            />
                          }
                          label='Garage'
                        />
                        {value.has && (
                          <TextField
                            label='Observation'
                            value={value.observation || ''}
                            onChange={
                              e => onChange({ ...value, observation: e.target.value }) // Atualiza apenas a propriedade 'observation'
                            }
                            sx={{ ml: 2 }}
                          />
                        )}
                      </FormGroup>
                    )}
                  />
                  {errors.hasGarage?.observation && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.hasGarage.observation.message}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item sm={4} xs={12}>
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <Controller
                    name='petAcepts'
                    control={control}
                    defaultValue={{ has: false, observation: '' }} // Define o estado inicial
                    render={({ field: { value, onChange } }) => (
                      <FormGroup row>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={value.has}
                              onChange={
                                e => onChange({ ...value, has: e.target.checked }) // Atualiza apenas a propriedade 'has'
                              }
                            />
                          }
                          label='Acept Pets'
                        />
                        {value.has && (
                          <TextField
                            label='Observation'
                            value={value.observation || ''}
                            onChange={
                              e => onChange({ ...value, observation: e.target.value }) // Atualiza apenas a propriedade 'observation'
                            }
                            sx={{ ml: 2 }}
                          />
                        )}
                      </FormGroup>
                    )}
                  />
                  {errors.petAccepts?.observation && (
                    <FormHelperText sx={{ color: 'error.main' }}>
                      {errors.petAccepts.observation.message}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item sm={4} xs={12}>
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <Controller
                    name='hasElevator'
                    control={control}
                    defaultValue={{ has: false, observation: '' }} // Define o estado inicial
                    render={({ field: { value, onChange } }) => (
                      <FormGroup row>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={value.has}
                              onChange={
                                e => onChange({ ...value, has: e.target.checked }) // Atualiza apenas a propriedade 'has'
                              }
                            />
                          }
                          label='Lift'
                        />
                        {value.has && (
                          <TextField
                            label='Observation'
                            value={value.observation || ''}
                            onChange={
                              e => onChange({ ...value, observation: e.target.value }) // Atualiza apenas a propriedade 'observation'
                            }
                            sx={{ ml: 2 }}
                          />
                        )}
                      </FormGroup>
                    )}
                  />
                  {errors.hasElevator?.observation && (
                    <FormHelperText sx={{ color: 'error.main' }}>
                      {errors.hasElevator.observation.message}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item sm={4} xs={12}>
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <Controller
                    name='hasGarden'
                    control={control}
                    defaultValue={{ has: false, observation: '' }} // Define o estado inicial
                    render={({ field: { value, onChange } }) => (
                      <FormGroup row>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={value.has}
                              onChange={
                                e => onChange({ ...value, has: e.target.checked }) // Atualiza apenas a propriedade 'has'
                              }
                            />
                          }
                          label='Garden'
                        />
                        {value.has && (
                          <TextField
                            label='Observation'
                            value={value.observation || ''}
                            onChange={
                              e => onChange({ ...value, observation: e.target.value }) // Atualiza apenas a propriedade 'observation'
                            }
                            sx={{ ml: 2 }}
                          />
                        )}
                      </FormGroup>
                    )}
                  />
                  {errors.hasGarden?.observation && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.hasGarden.observation.message}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item sm={4} xs={12}>
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <Controller
                    name='hasUnfurnished'
                    control={control}
                    defaultValue={{ has: false, observation: '' }} // Define o estado inicial
                    render={({ field: { value, onChange } }) => (
                      <FormGroup row>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={value.has}
                              onChange={
                                e => onChange({ ...value, has: e.target.checked }) // Atualiza apenas a propriedade 'has'
                              }
                            />
                          }
                          label='Unfurnished'
                        />
                        {value.has && (
                          <TextField
                            label='Observation'
                            value={value.observation || ''}
                            onChange={
                              e => onChange({ ...value, observation: e.target.value }) // Atualiza apenas a propriedade 'observation'
                            }
                            sx={{ ml: 2 }}
                          />
                        )}
                      </FormGroup>
                    )}
                  />
                  {errors.hasUnfurnished?.observation && (
                    <FormHelperText sx={{ color: 'error.main' }}>
                      {errors.hasUnfurnished.observation.message}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item sm={4} xs={12}>
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <Controller
                    name='hasYard'
                    control={control}
                    defaultValue={{ has: false, observation: '' }} // Define o estado inicial
                    render={({ field: { value, onChange } }) => (
                      <FormGroup row>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={value.has}
                              onChange={
                                e => onChange({ ...value, has: e.target.checked }) // Atualiza apenas a propriedade 'has'
                              }
                            />
                          }
                          label='Yard'
                        />
                        {value.has && (
                          <TextField
                            label='Observation'
                            value={value.observation || ''}
                            onChange={
                              e => onChange({ ...value, observation: e.target.value }) // Atualiza apenas a propriedade 'observation'
                            }
                            sx={{ ml: 2 }}
                          />
                        )}
                      </FormGroup>
                    )}
                  />
                  {errors.hasYard?.observation && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.hasYard.observation.message}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item sm={4} xs={12}>
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <Controller
                    name='hasUse_of_Roof'
                    control={control}
                    defaultValue={{ has: false, observation: '' }} // Define o estado inicial
                    render={({ field: { value, onChange } }) => (
                      <FormGroup row>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={value.has}
                              onChange={
                                e => onChange({ ...value, has: e.target.checked }) // Atualiza apenas a propriedade 'has'
                              }
                            />
                          }
                          label='Use of Roof'
                        />
                        {value.has && (
                          <TextField
                            label='Observation'
                            value={value.observation || ''}
                            onChange={
                              e => onChange({ ...value, observation: e.target.value }) // Atualiza apenas a propriedade 'observation'
                            }
                            sx={{ ml: 2 }}
                          />
                        )}
                      </FormGroup>
                    )}
                  />
                  {errors.hasUse_of_Roof?.observation && (
                    <FormHelperText sx={{ color: 'error.main' }}>
                      {errors.hasUse_of_Roof.observation.message}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
            </Grid>

            <Grid sx={{ display: 'flex', gap: 3, flexDirection: 'column' }}>
              <Button variant='contained' component='label' startIcon={<CloudUploadIcon />} sx={{ marginBottom: 2 }}>
                Upload Images
                <input type='file' multiple hidden accept='image/*' onChange={handleImageChange} />
              </Button>
              <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: 3, flexWrap: 'wrap' }}>
                {previews.length ? (
                  previews.map((item, i) => (
                    <AvatarInput key={i}>
                      <img src={item} alt='Avatar Placeholder' />
                      <CloseIcon
                        onClick={() => handleRemoveImage(i)}
                        sx={{
                          position: 'absolute',
                          top: 0,
                          right: 0,
                          padding: '5px',
                          backgroundColor: 'rgba(0, 0, 0, 0.5)',
                          borderRadius: '50%',
                          color: 'white',
                          cursor: 'pointer'
                        }}
                      />
                    </AvatarInput>
                  ))
                ) : (
                  <></>
                )}
              </Box>
            </Grid>
            <Grid sx={{ marginTop: 2 }}>
              <FormControl fullWidth sx={{ mb: 3 }}>
                <Controller
                  name='name'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextField
                      label='Title'
                      value={value}
                      onBlur={onBlur}
                      onChange={onChange}
                      error={Boolean(errors.name)}
                      placeholder='Name'
                    />
                  )}
                />
                {errors.name && <FormHelperText sx={{ color: 'error.main' }}>{errors.name.message}</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid sx={{ marginTop: 2 }}>
              <FormControl fullWidth sx={{ mb: 3 }}>
                <Controller
                  name='additionalExpenses'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextField
                      label='Additional Expenses'
                      value={value}
                      onBlur={onBlur}
                      onChange={onChange}
                      error={Boolean(errors.name)}
                      placeholder='Additional Expenses'
                    />
                  )}
                />
                {errors.additionalExpenses && (
                  <FormHelperText sx={{ color: 'error.main' }}>{errors.additionalExpenses.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid sx={{ marginTop: 2 }}>
              <FormControl fullWidth sx={{ mb: 3 }}>
                <Controller
                  name='description'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextField
                      label='Description'
                      multiline
                      rows={4}
                      value={value}
                      onBlur={onBlur}
                      onChange={onChange}
                      error={Boolean(errors.description)}
                      placeholder='Name'
                    />
                  )}
                />
                {errors.description && (
                  <FormHelperText sx={{ color: 'error.main' }}>{errors.description.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid>
              <Button variant='contained' type='submit'>
                {id?.length ? 'Update' : 'Save'}
              </Button>
            </Grid>
          </form>
        </BoxWrapper>
      </Box>
    </Grid>
  )
}

export default RegisterRealStateComponent
