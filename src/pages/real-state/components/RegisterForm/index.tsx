import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'

import Box, { BoxProps } from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import Typography from '@mui/material/Typography'

// ** Layout Import

// ** Hooks
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { FormControlLabel, FormGroup, FormHelperText, Grid, InputLabel, MenuItem, Select, Switch } from '@mui/material'
import MapRegisterComponent from '../mapComponent'
import { useEffect, useState } from 'react'
import { styled } from '@mui/material/styles'

import CloudUploadIcon from '@mui/icons-material/CloudUpload'

import CloseIcon from '@mui/icons-material/Close'
import { getRealStateById, RealStateType, registerRealState, updateRealState } from 'src/requests/realStateRequest'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'
import { useMapRegister } from 'src/context/MapRegisterContext'

import { getRegionRequest, Region } from 'src/requests/regionRequest'
import { FormatRealStateToForm } from 'src/utils/format-real-state-to-form'

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
  numberElevator: number
  hasBalcony: hasOrAceptType
  hasAirConditioner: hasOrAceptType
  hasPool: hasOrAceptType
  hasJacuzzi: hasOrAceptType
  hasGarage: hasOrAceptType
  orientation: string
  petAcepts: hasOrAceptType
  hasHotWater: hasOrAceptType
  energyEfficiency: number
  hasWifi: string
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
  numberElevator: yup.number(),
  hasBalcony: yup.object(),
  hasAirConditioner: yup.object(),
  hasPool: yup.object(),
  hasJacuzzi: yup.object(),
  hasGarage: yup.object(),
  orientation: yup.string(),
  petAcepts: yup.object(),
  hasHotWater: yup.object(),
  energyEfficiency: yup.number(),
  hasWifi: yup.string(),
  hasTerrace: yup.object(),
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
  const router = useRouter()
  const { id } = router.query

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

  useEffect(() => {
    getRegionOptions()
  }, [])

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

  const { newPoint } = useMapRegister()

  const defaultValues = {
    name: '',
    mensalRent: 0,
    area: 0,
    address: '',
    type: '',
    bathNumber: 0,
    roomsNumber: 0,
    numberElevator: 0,
    hasBalcony: { has: false, observation: '' },
    hasAirConditioner: { has: false, observation: '' },
    hasPool: { has: false, observation: '' },
    hasJacuzzi: { has: false, observation: '' },
    hasGarage: { has: false, observation: '' },
    orientation: '',
    petAcepts: { has: false, observation: '' },
    hasHotWater: { has: false, observation: '' },
    energyEfficiency: 0,
    hasWifi: 'false',
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
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const onSubmit = async (data: FormData) => {
    const formData = new FormData()

    formData.append('name', data.name)
    formData.append('mensalRent', data.mensalRent.toString())
    formData.append('area', data.area.toString())
    formData.append('address', data.address)
    formData.append('type', data.type)
    formData.append('bathNumber', data.bathNumber.toString())
    formData.append('roomsNumber', data.roomsNumber.toString())
    formData.append('numberElevator', data.numberElevator.toString())
    formData.append('orientation', data.orientation.toString())
    formData.append('energyEfficiency', data.energyEfficiency.toString())
    formData.append('additionalExpenses', data.additionalExpenses.toString())
    formData.append('description', data.description.toString())
    formData.append('hasAirConditioner', JSON.stringify(data.hasAirConditioner))
    formData.append('hasBalcony', JSON.stringify(data.hasBalcony))
    formData.append('hasGarage', JSON.stringify(data.hasGarage))
    formData.append('hasHotWater', JSON.stringify(data.hasHotWater))
    formData.append('hasJacuzzi', JSON.stringify(data.hasJacuzzi))
    formData.append('hasPool', JSON.stringify(data.hasPool))
    formData.append('hasTerrace', JSON.stringify(data.hasTerrace))
    formData.append('petAccepts', JSON.stringify(data.petAcepts))
    formData.append('hasWifi', data.hasWifi === 'true' ? 'true' : 'false')
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

  return (
    <Grid container spacing={1}>
      <Box sx={{ width: '100vw', height: '70vh' }}>
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
                    label='Adderess'
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
            <Grid container spacing={6}>
              <Grid item sm={4} xs={12}>
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <Controller
                    name='mensalRent'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <TextField
                        label='Mensal Rent'
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

              <Grid item sm={4} xs={12}>
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <Controller
                    name='area'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <TextField
                        label='Area'
                        type='number'
                        value={value}
                        onBlur={onBlur}
                        onChange={onChange}
                        error={Boolean(errors.area)}
                      />
                    )}
                  />
                  {errors.area && <FormHelperText sx={{ color: 'error.main' }}>{errors.area.message}</FormHelperText>}
                </FormControl>
              </Grid>

              <Grid item sm={4} xs={12}>
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
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <Controller
                    name='numberElevator'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <TextField
                        label='Number of Elevators'
                        value={value}
                        onBlur={onBlur}
                        type='number'
                        onChange={onChange}
                        error={Boolean(errors.numberElevator)}
                      />
                    )}
                  />
                  {errors.numberElevator && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.numberElevator.message}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item sm={3} xs={12}>
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <Controller
                    name='orientation'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <TextField
                        label='Orientation'
                        value={value}
                        onBlur={onBlur}
                        onChange={onChange}
                        error={Boolean(errors.orientation)}
                      />
                    )}
                  />
                  {errors.orientation && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.orientation.message}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
            </Grid>

            <Grid container spacing={6}>
              <Grid item sm={3} xs={12}>
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <Controller
                    name='energyEfficiency'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <TextField
                        label='Energy Efficiency'
                        value={value}
                        onBlur={onBlur}
                        onChange={onChange}
                        error={Boolean(errors.energyEfficiency)}
                      />
                    )}
                  />
                  {errors.energyEfficiency && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.energyEfficiency.message}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item sm={3} xs={12}>
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <Controller
                    name='hasWifi'
                    control={control}
                    rules={{ required: 'Region is required' }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <>
                        <InputLabel id='region-label'>Wifi</InputLabel>
                        <Select
                          labelId='region-label'
                          value={value || ''}
                          onBlur={onBlur}
                          onChange={onChange}
                          error={Boolean(errors.hasWifi)}
                        >
                          <MenuItem value=''>
                            <em>None</em>
                          </MenuItem>

                          <MenuItem value='true'>Yes</MenuItem>
                          <MenuItem value='false'>Not</MenuItem>
                          {/* Add more MenuItems as needed */}
                        </Select>
                        {errors.hasWifi && (
                          <FormHelperText sx={{ color: 'error.main' }}>{errors.hasWifi.message}</FormHelperText>
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
                          {regionOptions.length ? (
                            regionOptions.map((item, i) => (
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
                    name='hasHotWater'
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
                          label='Hot water'
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
                  {errors.hasHotWater?.observation && (
                    <FormHelperText sx={{ color: 'error.main' }}>
                      {errors.hasHotWater.observation.message}
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
                      label='Name'
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
