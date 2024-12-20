// ** React Imports
import { ChangeEvent, useState } from 'react'

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
import { Grid, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material'

import { registerRegion } from 'src/requests/regionRequest'

interface DialogEditProps {
  open: boolean
  onClose: () => void
}

const DialogCreate = ({ open, onClose }: DialogEditProps) => {
  const [nameFilter, setNameFilter] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [area_region, setAreaRegion] = useState<string>('')

  const handleName = (event: ChangeEvent<HTMLInputElement>) => setNameFilter(event.target.value)

  const handleDescription = (event: ChangeEvent<HTMLInputElement>) => setDescription(event.target.value)
  const handleAreaRegion = (event: SelectChangeEvent<string>) => {
    setAreaRegion(event.target.value)
  }

  const createRegionReq = async () => {
    try {
      if (nameFilter) {
        const body = {
          region_name: nameFilter,
          description: description,
          area_region: area_region
        }
        const dataReturn = await registerRegion(body)

        return dataReturn
      }
    } catch (error) {
      throw new Error('Error - updateRegion')
    }
  }

  // ** State
  return (
    <div>
      <Dialog onClose={onClose} aria-labelledby='customized-dialog-title' open={open} fullWidth maxWidth='md'>
        <DialogTitle id='customized-dialog-title' sx={{ p: 4 }}>
          <Typography variant='h6' component='span'>
            Create Region
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
              <TextField fullWidth label='City' placeholder='Terraced House' value={nameFilter} onChange={handleName} />
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
            <Grid item sm={12} xs={12}>
              <InputLabel id='type-label'>Area</InputLabel>
              <Select labelId='type-label' value={area_region} onChange={handleAreaRegion} fullWidth>
                <MenuItem value=''>
                  <em>None</em>
                </MenuItem>

                <MenuItem value='NORTH'>NORTH</MenuItem>
                <MenuItem value='CENTER'>CENTER</MenuItem>
                <MenuItem value='SOUTH'>SOUTH</MenuItem>
                <MenuItem value='TOURIST_REGION'>TOURIST_REGION</MenuItem>
              </Select>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: theme => `${theme.spacing(3)} !important` }}>
          <Button
            onClick={() => {
              createRegionReq()
              onClose()
              setNameFilter('')
              setDescription('')
              setAreaRegion('')
            }}
          >
            Save changes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default DialogCreate
