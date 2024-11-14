import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'

import Box, { BoxProps } from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import Typography from '@mui/material/Typography'
import ReactFileReader from 'react-file-reader'

// ** Layout Import

// ** Hooks
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { FormControlLabel, FormGroup, FormHelperText, Grid, InputLabel, MenuItem, Select, Switch } from '@mui/material'
import MapRegisterComponent from '../mapComponent'
import { useState } from 'react'
import { styled } from '@mui/material/styles'

import CloudUploadIcon from '@mui/icons-material/CloudUpload'

import CloseIcon from '@mui/icons-material/Close'
import { CreateRealStateDTO, registerRealState } from 'src/requests/realStateRequest'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'
import { useMapRegister } from 'src/context/MapRegisterContext'

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
  petAccepts: hasOrAceptType
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
  petAccepts: yup.object()
})

const BoxWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.down('md')]: {
    maxWidth: 900
  }
}))

const RegisterRealStateComponent = () => {
  const [urls, setUrls] = useState<string[]>([])

  const handleFiles = (files: any) => {
    setUrls(prev => [...prev, files.base64])
  }
  const onDelete = (index: number) => {
    setUrls(prev => prev.filter((_, i) => i !== index))
  }
  const router = useRouter()

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
    petAccepts: { has: false, observation: '' }
  }

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const onSubmit = async (data: FormData) => {
    const body: CreateRealStateDTO = {
      ...data,
      hasAirConditioner: JSON.stringify(data.hasAirConditioner),
      hasBalcony: JSON.stringify(data.hasBalcony),
      hasGarage: JSON.stringify(data.hasGarage),
      hasHotWater: JSON.stringify(data.hasHotWater),
      hasJacuzzi: JSON.stringify(data.hasJacuzzi),
      hasPool: JSON.stringify(data.hasPool),
      hasTerrace: JSON.stringify(data.hasTerrace),
      petAccepts: JSON.stringify(data.petAccepts),
      hasWifi: data.hasWifi === 'true' ? true : false,
      lat: newPoint?.lat ?? 0,
      lng: newPoint?.lng ?? 0
    }
    try {
      const data = await registerRealState(body)
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
        <MapRegisterComponent />
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
                    autoFocus
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
                        autoFocus
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
                        autoFocus
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
                        autoFocus
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
                        autoFocus
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
                        autoFocus
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
                        autoFocus
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
                        autoFocus
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
                          <MenuItem value=''>
                            <em>None</em>
                          </MenuItem>
                          <MenuItem value='region1'>Region 1</MenuItem>
                          <MenuItem value='region2'>Region 2</MenuItem>
                          <MenuItem value='region3'>Region 3</MenuItem>
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
                    name='petAccepts'
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
              <ReactFileReader fileTypes={['.png', '.jpg']} base64={true} handleFiles={handleFiles}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: 5,
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    border: 'solid 1px rgba(0, 0, 0, 0.2)',
                    borderRadius: '10px'
                  }}
                >
                  <CloudUploadIcon sx={{ fontSize: 40 }} />
                  <Typography>Upload Image(s)</Typography>
                </Box>
              </ReactFileReader>
              <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: 3, flexWrap: 'wrap' }}>
                {urls.length ? (
                  urls.map((item, i) => (
                    <AvatarInput key={i}>
                      <img src={item} alt='Avatar Placeholder' />
                      <CloseIcon
                        onClick={() => onDelete(i)}
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
                      autoFocus
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
                      autoFocus
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
                      autoFocus
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
                Save
              </Button>
            </Grid>
          </form>
        </BoxWrapper>
      </Box>
    </Grid>
  )
}

export default RegisterRealStateComponent
