import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'

import Box, { BoxProps } from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

// ** Layout Import

// ** Hooks
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { FormHelperText } from '@mui/material'

import { Agent, updateAgent, UpdateAgentDTO } from 'src/requests/agentRequest'
import toast from 'react-hot-toast'

const schema = yup.object().shape({
  name: yup.string(),
  number: yup.string(),
  email: yup.string().email(),
  type: yup.string(),
  action: yup.string()
})

export interface FormData {
  name: string
  number: string
  email: string
  type: string
  action: string
}

const BoxWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.down('md')]: {
    maxWidth: 400
  }
}))

interface UpdateAgentFormProps {
  dataAgent: Agent
}
const UpdateAgentForm = ({ dataAgent }: UpdateAgentFormProps) => {
  const defaultValues = {
    name: dataAgent.name,
    number: dataAgent.number,
    email: dataAgent.email,
    type: dataAgent.type,
    action: dataAgent.action
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
    console.log('data', data)
    console.log('dataAgent', dataAgent)
    if (dataAgent) {
      const BodyUpdateForm: UpdateAgentDTO = {
        ...dataAgent,
        name: data.name,
        action: data.action,
        email: data.email,
        number: data.number,
        type: data.type,
        updatedProfile: true
      }
      try {
        await updateAgent(BodyUpdateForm)
        toast.success('Agent been altered!')
      } catch (error) {
        toast.error('Error in alter agent')
      }
    }

    // const body = {
    //   name,
    //   password_hash: password,
    //   email,
    //   role: 'GUEST',
    //   activity: false
    // }
    // try {
    //   const dataRequest = await registerUser(body)
    //   console.log('data', dataRequest)
    //   if (dataRequest) {
    //     toast.success('User successfully registered')
    //     setTimeout(() => {
    //       router.replace('/login')
    //     }, 400)
    //   }
    // } catch (error) {
    //   toast.error('User not successfully registered')
    //   throw new Error('Error register user')
    // }
  }

  return (
    <Box
      sx={{
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
          <Typography variant='body2'>Complete your register for Agent </Typography>
        </Box>
        <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
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

          <FormControl fullWidth sx={{ mb: 3 }}>
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
          <FormControl fullWidth sx={{ mb: 3 }}>
            <Controller
              name='number'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange, onBlur } }) => (
                <TextField
                  autoFocus
                  label='Number'
                  value={value}
                  onBlur={onBlur}
                  onChange={onChange}
                  error={Boolean(errors.number)}
                  placeholder='+333 847674090'
                />
              )}
            />
            {errors.number && <FormHelperText sx={{ color: 'error.main' }}>{errors.number.message}</FormHelperText>}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 3 }}>
            <Controller
              name='type'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange, onBlur } }) => (
                <TextField
                  autoFocus
                  label='Type'
                  value={value}
                  onBlur={onBlur}
                  onChange={onChange}
                  error={Boolean(errors.type)}
                />
              )}
            />
            {errors.type && <FormHelperText sx={{ color: 'error.main' }}>{errors.type.message}</FormHelperText>}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 3 }}>
            <Controller
              name='action'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange, onBlur } }) => (
                <TextField
                  autoFocus
                  label='Action'
                  value={value}
                  onBlur={onBlur}
                  onChange={onChange}
                  error={Boolean(errors.action)}
                />
              )}
            />
            {errors.action && <FormHelperText sx={{ color: 'error.main' }}>{errors.action.message}</FormHelperText>}
          </FormControl>

          <Button fullWidth size='large' type='submit' variant='contained' color='primary' sx={{ mb: 7 }}>
            Edit
          </Button>
        </form>
      </BoxWrapper>
    </Box>
  )
}

export default UpdateAgentForm
