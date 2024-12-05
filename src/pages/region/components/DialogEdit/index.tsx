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
import { RegionType } from '../TableBasic'
import { Grid, TextField } from '@mui/material'

import { updateRegion } from 'src/requests/regionRequest'

interface DialogEditProps {
  open: boolean
  onClose: () => void
  data: RegionType | null
}

const DialogEdit = ({ open, onClose, data }: DialogEditProps) => {
  const [nameFilter, setNameFilter] = useState<string>('')
  const [description, setDescription] = useState<string>('')

  const handleName = (event: ChangeEvent<HTMLInputElement>) => setNameFilter(event.target.value)

  const handleDescription = (event: ChangeEvent<HTMLInputElement>) => setDescription(event.target.value)

  const updateRegionReq = async () => {
    try {
      if (data?.id) {
        const body = {
          id: data.id,
          region_name: nameFilter,
          description: description
        }
        const dataReturn = await updateRegion(body)

        return dataReturn
      }
    } catch (error) {
      throw new Error('Error - updateRegion')
    }
  }

  // ** State
  useEffect(() => {
    if (data) {
      setNameFilter(data.region_name)
      setDescription(data.description)
    }
  }, [data])

  return (
    <div>
      <Dialog onClose={onClose} aria-labelledby='customized-dialog-title' open={open} fullWidth maxWidth='md'>
        <DialogTitle id='customized-dialog-title' sx={{ p: 4 }}>
          <Typography variant='h6' component='span'>
            Edit Region
          </Typography>
          <IconButton
            aria-label='close'
            onClick={onClose}
            sx={{ top: 10, right: 10, position: 'absolute', color: 'grey.500' }}
          >
            <Icon icon='mdi:close' />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 2 }}>
          <Grid sx={{ mb: 2, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Grid item sm={12} xs={12}>
              <TextField fullWidth label='Name' placeholder='Terraced House' value={nameFilter} onChange={handleName} />
            </Grid>
            <Grid item sm={12} xs={12}>
              <TextField
                fullWidth
                label='Description'
                multiline
                placeholder='Terraced House'
                value={description}
                onChange={handleDescription}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: theme => `${theme.spacing(3)} !important` }}>
          <Button
            onClick={() => {
              updateRegionReq()
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
