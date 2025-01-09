import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

import Icon from 'src/@core/components/icon'
import {
  associateSolicitation,
  SolicitationType,
  updateRequest,
  UpdateRequestDTO
} from 'src/requests/solicitationRequest'
import { Autocomplete, Grid, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material'

import { useState, useEffect } from 'react'
import { Agent, getAgents } from 'src/requests/agentRequest'
import toast from 'react-hot-toast'
import { useAuth } from 'src/hooks/useAuth'

interface DialogEditProps {
  open: boolean
  onClose: () => void
  data: SolicitationType | null
}

const DialogEdit = ({ open, onClose, data }: DialogEditProps) => {
  const [idRealState, setIdRealState] = useState<string>('')
  const [idSolicitation, setIdSolicitation] = useState<string>('')
  const [dataSolicitation, setDataSolicitation] = useState<string>('')
  const [statusSolicitation, setStatusSolicitation] = useState<string>('')
  const [agents, setAgents] = useState<Agent[]>([])
  const [] = useState<Agent[]>([])

  const [selectedAgents, setSelectedAgents] = useState<Agent[]>([])
  const { user } = useAuth()

  const handleStatus = (event: SelectChangeEvent<string>) => {
    setStatusSolicitation(event.target.value)
  }

  console.log('data', data)

  const getAgentsReq = async () => {
    try {
      const data = await getAgents()
      setAgents(data)
    } catch (error) {
      console.warn(error)
    }
  }

  function arraysAreEqual(array1: string[], array2: string[]): boolean {
    // Se os tamanhos forem diferentes, já retornamos falso
    if (array1.length !== array2.length) return false

    // Ordena os arrays
    const sortedArray1 = [...array1].sort()
    const sortedArray2 = [...array2].sort()

    // Verifica se todos os elementos são iguais
    return sortedArray1.every((value, index) => value === sortedArray2[index])
  }

  const updateAgentAssociate = async () => {
    try {
      const newAgents = selectedAgents.map(item => item.id)
      const agentsSelecteds = data?.assignedAgents.map(item => item.agentId) ?? []
      const containsNewValues = arraysAreEqual(newAgents, agentsSelecteds)
      console.log('newAgents', newAgents)
      console.log('agentsSelecteds', agentsSelecteds)
      console.log('containsNewValues', containsNewValues)
      if (containsNewValues && data) {
        const body: UpdateRequestDTO = {
          id: data.id,
          description: data.description,
          realStateId: data.realStateId,
          requesterEmail: data.requesterEmail,
          requesterPhone: data.requesterPhone,
          status: statusSolicitation,
          userId: data.userId
        }
        await updateRequest(body)
        toast.success('Solicitation updated')
      }
      if (!containsNewValues && data) {
        const body2 = {
          requestId: idSolicitation,
          agentIds: selectedAgents.map(item => item.id)
        }
        await associateSolicitation(body2)

        const body: UpdateRequestDTO = {
          id: data.id,
          description: data.description,
          realStateId: data.realStateId,
          requesterEmail: data.requesterEmail,
          requesterPhone: data.requesterPhone,
          status: statusSolicitation,
          userId: data.userId
        }
        await updateRequest(body)
        toast.success('Solicitation updated')

        return
      }
    } catch (error) {
      console.warn(error)
    }
  }
  const updateRequestAsync = async () => {
    try {
      if (data) {
        const body: UpdateRequestDTO = {
          id: data.id,
          description: data.description,
          realStateId: data.realStateId,
          requesterEmail: data.requesterEmail,
          requesterPhone: data.requesterPhone,
          status: statusSolicitation,
          userId: data.userId
        }
        await updateRequest(body)
        toast.success('Solicitation updated')
      }
    } catch (error) {
      console.warn(error)
    }
  }
  useEffect(() => {
    getAgentsReq()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (data) {
      setIdRealState(data.realState.id_number.toString())
      setDataSolicitation(data.created_at)
      setIdSolicitation(data.id)
      setStatusSolicitation(data.status)
      const agentsSelectedsForamtted = agents.filter(item =>
        data.assignedAgents.some(assigned => assigned.agentId === item.id)
      )
      if (agentsSelectedsForamtted.length) {
        setSelectedAgents(agentsSelectedsForamtted)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, agents])

  return (
    <div>
      <Dialog onClose={onClose} aria-labelledby='customized-dialog-title' open={open} fullWidth maxWidth='md'>
        <DialogTitle id='customized-dialog-title' sx={{ p: 4 }}>
          <Typography variant='h6' component='span'>
            {user?.role === 'admin' ? 'Send Solicitation For Agents' : 'Details of Solicitation'}
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
            {user?.role === 'admin' ? (
              <>
                <Grid container spacing={6}>
                  <Grid item sm={6} xs={12}>
                    <TextField
                      fullWidth
                      label='Id Real State'
                      placeholder='Terraced House'
                      value={idRealState}
                      disabled
                    />
                  </Grid>
                  <Grid item sm={6} xs={12}>
                    <TextField
                      fullWidth
                      label='Solicitation Date'
                      multiline
                      placeholder='Terraced House'
                      disabled
                      value={dataSolicitation}
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={6}>
                  <Grid item sm={6} xs={12}>
                    <TextField fullWidth label='Email Client' multiline disabled value={data?.requesterEmail} />
                  </Grid>
                  <Grid item sm={6} xs={12}>
                    <TextField fullWidth label='Phone Client' multiline disabled value={data?.requesterPhone} />
                  </Grid>
                </Grid>

                <Grid item sm={12} xs={12}>
                  <TextField fullWidth label='Client Message' multiline disabled value={data?.description} />
                </Grid>
                <Grid item sm={12} xs={12}>
                  <InputLabel id='type-label'>Status</InputLabel>
                  <Select labelId='type-label' value={statusSolicitation} onChange={handleStatus} fullWidth>
                    <MenuItem value=''>
                      <em>None</em>
                    </MenuItem>

                    <MenuItem value='PENDING'>PENDING</MenuItem>
                    <MenuItem value='APPROVED'>APPROVED</MenuItem>
                    <MenuItem value='FORWARDED'>FORWARDED</MenuItem>
                  </Select>
                </Grid>
                <Grid item sm={12} xs={12}>
                  <Autocomplete
                    multiple
                    value={selectedAgents}
                    onChange={(event, newValue) => setSelectedAgents(newValue)}
                    options={agents}
                    getOptionLabel={option => option.name}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    renderInput={params => (
                      <TextField {...params} variant='outlined' label='Select Agent(s)' placeholder='Search...' />
                    )}
                  />
                </Grid>
              </>
            ) : (
              <>
                <Grid item sm={12} xs={12}>
                  <TextField
                    fullWidth
                    label='Id Real State'
                    placeholder='Terraced House'
                    value={idRealState}
                    disabled
                  />
                </Grid>
                <Grid item sm={12} xs={12}>
                  <TextField
                    fullWidth
                    label='Solicitation Date'
                    multiline
                    placeholder='Terraced House'
                    disabled
                    value={dataSolicitation}
                  />
                </Grid>
                <Grid item sm={12} xs={12}>
                  <TextField fullWidth label='Email Client' multiline disabled value={data?.requesterEmail} />
                </Grid>
                <Grid item sm={12} xs={12}>
                  <TextField fullWidth label='Phone Client' multiline disabled value={data?.requesterPhone} />
                </Grid>
                <Grid item sm={12} xs={12}>
                  <TextField fullWidth label='Client Message' multiline disabled value={data?.description} />
                </Grid>
                <Grid item sm={12} xs={12}>
                  <InputLabel id='type-label'>Status</InputLabel>
                  <Select labelId='type-label' value={statusSolicitation} onChange={handleStatus} fullWidth>
                    <MenuItem value=''>
                      <em>None</em>
                    </MenuItem>

                    <MenuItem value='PENDING'>PENDING</MenuItem>
                    <MenuItem value='APPROVED'>APPROVED</MenuItem>
                    <MenuItem value='FORWARDED'>FORWARDED</MenuItem>
                  </Select>
                </Grid>
              </>
            )}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: theme => `${theme.spacing(3)} !important` }}>
          <Button
            onClick={() => {
              if (user && user.role === 'agent') {
                updateRequestAsync()
              }
              if (user && user.role === 'admin') {
                updateAgentAssociate()
              }
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
