// ** React Imports
import { ReactNode, useState } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Components
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'

import Box, { BoxProps } from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'
import InputAdornment from '@mui/material/InputAdornment'
import Typography, { TypographyProps } from '@mui/material/Typography'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Hooks
import { useSettings } from 'src/@core/hooks/useSettings'
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { FormHelperText, IconButton, OutlinedInput } from '@mui/material'
import { registerUser } from 'src/requests/usersRequest'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'

// ** Styled Components
const RegisterIllustrationWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  padding: theme.spacing(5),
  paddingRight: '0 !important',
  [theme.breakpoints.down('lg')]: {
    padding: theme.spacing(10)
  }
}))

const RegisterIllustration = styled('img')(({ theme }) => ({
  maxWidth: '46rem',
  [theme.breakpoints.down('xl')]: {
    maxWidth: '38rem'
  },
  [theme.breakpoints.down('lg')]: {
    maxWidth: '30rem'
  }
}))

const RightWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.up('md')]: {
    maxWidth: 400
  },
  [theme.breakpoints.up('lg')]: {
    maxWidth: 450
  }
}))

const BoxWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.down('md')]: {
    maxWidth: 400
  }
}))

const TypographyStyled = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontWeight: 600,
  letterSpacing: '0.18px',
  marginBottom: theme.spacing(1.5),
  [theme.breakpoints.down('md')]: { marginTop: theme.spacing(8) }
}))

const schema = yup.object().shape({
  name: yup.string().required(),
  email: yup.string().email().required(),
  password: yup.string().min(8).required(),
  confirm_password: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must be the same')
    .required(),
  role: yup.string(),
  activity: yup.boolean()
})

const defaultValues = {
  name: '',
  password: '',
  confirm_password: '',
  email: '',
  role: 'GUEST',
  activity: false
}

export interface FormData {
  name: string
  email: string
  password: string
  confirm_password: string
  role: string
  activity: boolean
}

const Register = () => {
  // ** States
  const [showPassword, setShowPassword] = useState<boolean>(false)

  // ** Hooks
  const theme = useTheme()
  const { settings } = useSettings()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))
  const router = useRouter()

  // ** Vars
  const { skin } = settings

  const imageSource = skin === 'bordered' ? 'house-search-image-light' : 'house-search-image-light'

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
    const { name, password, email } = data

    const body = {
      name,
      password_hash: password,
      email,
      role: 'GUEST',
      activity: false
    }
    try {
      const dataRequest = await registerUser(body)
      console.log('data', dataRequest)
      if (dataRequest) {
        toast.success('User successfully registered')
        setTimeout(() => {
          router.replace('/login')
        }, 400)
      }
    } catch (error) {
      toast.error('User not successfully registered')
      throw new Error('Error register user')
    }
  }

  return (
    <Box className='content-right'>
      {!hidden ? (
        <Box sx={{ flex: 1, display: 'flex', position: 'relative', alignItems: 'center', justifyContent: 'center' }}>
          <RegisterIllustrationWrapper>
            <RegisterIllustration alt='register-illustration' src={`/images/pages/${imageSource}.png`} />
          </RegisterIllustrationWrapper>
        </Box>
      ) : null}
      <RightWrapper sx={skin === 'bordered' && !hidden ? { borderLeft: `1px solid ${theme.palette.divider}` } : {}}>
        <Box
          sx={{
            p: 7,
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'background.paper'
          }}
        >
          <BoxWrapper>
            <Box
              sx={{
                top: 30,
                left: 40,
                display: 'flex',
                position: 'absolute',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {!hidden && (
                <svg
                  width='193'
                  height='91'
                  viewBox='0 0 193 91'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                  xmlnsXlink='http://www.w3.org/1999/xlink'
                >
                  <rect width='193' height='91' fill='url(#pattern0_8_88)' />
                  <defs>
                    <pattern id='pattern0_8_88' patternContentUnits='objectBoundingBox' width='1' height='1'>
                      <use xlinkHref='#image0_8_88' transform='matrix(0.00331126 0 0 0.00702278 0 -0.10747)' />
                    </pattern>
                    <image
                      id='image0_8_88'
                      width='302'
                      height='173'
                      xlinkHref='data:image/png;base64,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'
                    />
                  </defs>
                </svg>
              )}
            </Box>
            <Box sx={{ mb: 6 }}>
              <TypographyStyled variant='h5'>Be part of helptorent</TypographyStyled>
              <Typography variant='body2'>Register and start navigating the real estate world </Typography>
            </Box>
            <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
              <FormControl fullWidth sx={{ mb: 4 }}>
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

              <FormControl fullWidth sx={{ mb: 4 }}>
                <Controller
                  name='email'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextField
                      autoFocus
                      label='Email'
                      value={value}
                      onBlur={onBlur}
                      onChange={onChange}
                      error={Boolean(errors.email)}
                      placeholder='example@helprent.com'
                    />
                  )}
                />
                {errors.email && <FormHelperText sx={{ color: 'error.main' }}>{errors.email.message}</FormHelperText>}
              </FormControl>

              <FormControl fullWidth sx={{ mb: 4 }}>
                <Controller
                  name='password'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <OutlinedInput
                      value={value}
                      onBlur={onBlur}
                      onChange={onChange}
                      error={Boolean(errors.password)}
                      type={showPassword ? 'text' : 'password'}
                      endAdornment={
                        <InputAdornment position='end'>
                          <IconButton
                            edge='end'
                            onMouseDown={e => e.preventDefault()}
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            <Icon icon={showPassword ? 'mdi:eye-outline' : 'mdi:eye-off-outline'} />
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  )}
                />
                {errors.password && (
                  <FormHelperText sx={{ color: 'error.main' }}>{errors.password.message}</FormHelperText>
                )}
              </FormControl>

              <FormControl fullWidth sx={{ mb: 4 }}>
                <Controller
                  name='confirm_password'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <OutlinedInput
                      value={value}
                      onBlur={onBlur}
                      onChange={onChange}
                      error={Boolean(errors.password)}
                      type={showPassword ? 'text' : 'password'}
                      endAdornment={
                        <InputAdornment position='end'>
                          <IconButton
                            edge='end'
                            onMouseDown={e => e.preventDefault()}
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            <Icon icon={showPassword ? 'mdi:eye-outline' : 'mdi:eye-off-outline'} />
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  )}
                />
                {errors.confirm_password && (
                  <FormHelperText sx={{ color: 'error.main' }}>{errors.confirm_password.message}</FormHelperText>
                )}
              </FormControl>

              <Button fullWidth size='large' type='submit' variant='contained' sx={{ mb: 7 }}>
                Sign up
              </Button>
              <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                <Typography sx={{ mr: 2, color: 'text.secondary' }}>Already have an account?</Typography>
                <Typography href='/login' component={Link} sx={{ color: 'primary.main', textDecoration: 'none' }}>
                  Sign in instead
                </Typography>
              </Box>
            </form>
          </BoxWrapper>
        </Box>
      </RightWrapper>
    </Box>
  )
}

Register.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

Register.guestGuard = true

export default Register
