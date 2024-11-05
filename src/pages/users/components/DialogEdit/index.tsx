// ** React Imports
import { ChangeEvent, useEffect, useState } from 'react'

// ** MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { UserType } from '../TableBasic'
import { Grid, TextField, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material'
import { updateUserByAgent } from 'src/requests/usersRequest'

interface DialogEditProps {
  open: boolean
  onClose: () => void
  data: UserType | null
}

const DialogEdit = ({ open, onClose, data }: DialogEditProps) => {
  const [nameFilter, setNameFilter] = useState<string>('')
  const [roleFilter, setRoleFilter] = useState<string>('')

  const handleName = (event: ChangeEvent<HTMLInputElement>) => setNameFilter(event.target.value)

  const handleRole = (e: SelectChangeEvent) => setRoleFilter(e.target.value)

  const updateUserByAgentFunction = async () => {
    try {
      if (data?.id) {
        const body = {
          id: data.id,
          new_role: roleFilter
        }
        const dataReturn = await updateUserByAgent(body)

        return dataReturn
      }
    } catch (error) {
      throw new Error('Error - updateUserByAgent')
    }
  }

  // ** State
  useEffect(() => {
    if (data) {
      setNameFilter(data.name)
      setRoleFilter(data.role)
    }
  }, [data])

  return (
    <div>
      <Dialog onClose={onClose} aria-labelledby='customized-dialog-title' open={open}>
        <DialogTitle id='customized-dialog-title' sx={{ p: 4 }}>
          <Typography variant='h6' component='span'>
            Edit User
          </Typography>
          <IconButton
            aria-label='close'
            onClick={onClose}
            sx={{ top: 10, right: 10, position: 'absolute', color: 'grey.500' }}
          >
            <Icon icon='mdi:close' />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 4 }}>
          <Grid sx={{ mb: 4, display: 'flex', gap: '1rem' }}>
            <Grid item sm={6} xs={12}>
              <TextField
                fullWidth
                label='Name'
                placeholder='Terraced House'
                value={nameFilter}
                onChange={handleName}
                disabled
              />
            </Grid>
            <Grid item sm={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel id='type'>Role</InputLabel>
                <Select
                  value={roleFilter}
                  id='role'
                  label='Select role'
                  labelId='role'
                  onChange={handleRole}
                  inputProps={{ placeholder: 'Select a Role' }}
                >
                  <MenuItem value='ADMIN'>Admin</MenuItem>
                  <MenuItem value='AGENT'>Agent</MenuItem>
                  <MenuItem value='GUEST'>Guest</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: theme => `${theme.spacing(3)} !important` }}>
          <Button
            onClick={() => {
              updateUserByAgentFunction()
              onClose()
            }}
          >
            Save changes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default DialogEdit
