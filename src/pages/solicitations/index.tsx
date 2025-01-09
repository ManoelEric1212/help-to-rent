// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import CardHeader from '@mui/material/CardHeader'
import {
  Box,
  Button,
  CardContent,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography
} from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import { format } from 'date-fns'

import TableBasic, { DataGridDataSolicitation, SolicitationTypeTable } from './components/TableBasic'
import {
  getSolicitaionRequest,
  getSolicitaionRequestByAgentId,
  SolicitationType
} from 'src/requests/solicitationRequest'
import { useEffect, useState } from 'react'
import { FormatSolicitationToTable } from 'src/utils/format-solicitations-to-table'
import DialogEdit from './components/modalEdit'
import { useAuth } from 'src/hooks/useAuth'
import { getAgentByEmailRequest } from 'src/requests/agentRequest'

import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

export interface CellType {
  row: SolicitationTypeTable
}

const Solicitation = () => {
  const [data, setData] = useState<DataGridDataSolicitation>({ columns: [], rows: [] })

  const [solicitations, setSolicitations] = useState<SolicitationType[]>([])
  const [solicitationSelected, setSocilitationSelected] = useState<SolicitationType | null>(null)
  const [auxSelected, setAuxSelected] = useState<SolicitationTypeTable | null>(null)
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [statusFilter, setStatusFilter] = useState<string>('')

  const [initialDate, setInitialDate] = useState<Date | null>(null)

  const [endDate, setEndDate] = useState<Date | null>(null)

  const { user, agent } = useAuth()

  const columns: GridColDef[] = [
    {
      flex: 0.1,
      field: 'id',
      minWidth: 130,
      headerName: 'RealState',
      renderCell: ({ row }: CellType) => {
        return (
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              height: '80px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer'
            }}
            onClick={() => {
              console.log('EDIT PAGE', row)
            }}
          >
            <img
              src='/images/real-state-icon.png'
              alt='Real State Icon'
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain'
              }}
            />

            <Typography
              sx={{
                position: 'absolute',
                bottom: '8px',
                right: '8px',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                color: 'red',
                padding: '2px 4px',
                fontWeight: 'bold',
                borderRadius: '4px',
                fontSize: '18px'
              }}
            >
              #{row.realStateId}
            </Typography>
          </Box>
        )
      }
    },
    {
      flex: 0.15,
      type: 'string',
      minWidth: 130,
      headerName: 'Solicitation Date',
      field: 'solicitation_date',
      valueGetter: params => format(new Date(params.value), 'dd/MM/yyyy HH:mm')
    },
    {
      flex: 0.15,
      minWidth: 80,
      field: 'email_solicitation',
      headerName: 'Email Solicitation'
    },
    {
      flex: 0.15,
      minWidth: 80,
      field: 'phone_solicitation',
      headerName: 'Phone Solicitation'
    },
    {
      flex: 0.15,
      minWidth: 80,
      field: 'status',
      headerName: 'Status'
    },
    {
      flex: 0.15,
      minWidth: 80,
      field: 'realStateId',
      headerName: 'RealState'
    },
    {
      flex: 0.1,
      field: 'action',
      minWidth: 80,
      headerName: 'Action',
      renderCell: ({ row }: CellType) => {
        return (
          <Button
            variant='outlined'
            color='primary'
            onClick={() => {
              setAuxSelected(row)
            }}
          >
            {' '}
            Edit{' '}
          </Button>
        )
      }
    }
  ]

  async function getSolicitations() {
    try {
      if (user && user.role === 'admin') {
        const data = await getSolicitaionRequest()
        setSolicitations(data)

        const dataTable: DataGridDataSolicitation = {
          columns: columns,
          rows: FormatSolicitationToTable(data)
        }
        setData(dataTable)
      }
      if (user && user.role === 'agent') {
        const dataAgent = await getAgentByEmailRequest(user.email)

        const data = await getSolicitaionRequestByAgentId(dataAgent.id)
        setSolicitations(data)

        const dataTable: DataGridDataSolicitation = {
          columns: columns,
          rows: FormatSolicitationToTable(data)
        }
        setData(dataTable)
      }
    } catch (error) {
      console.warn(error)
    }
  }

  useEffect(() => {
    getSolicitations()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, agent])

  useEffect(() => {
    if (solicitations.length > 0 && auxSelected) {
      const solicitationItem = solicitations.find(item => item.id === auxSelected.id)
      setSocilitationSelected(solicitationItem ?? null)
      if (solicitationItem) {
        setTimeout(() => {
          setModalOpen(true)
        }, 500)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auxSelected])

  const handleCloseModal = () => {
    setTimeout(() => {
      getSolicitations()
    }, 700)

    setModalOpen(false)
  }

  const handleFiltersValues = (): void => {
    const filtered = solicitations.filter(solicitation => {
      const matchesStatus = statusFilter ? solicitation.status === statusFilter : true
      const solicitationDate = new Date(solicitation.created_at)
      const matchesDate =
        initialDate && endDate
          ? solicitationDate >= new Date(new Date(initialDate).setHours(0, 0, 0, 0)) &&
            solicitationDate <= new Date(new Date(endDate).setHours(23, 59, 59, 999))
          : true

      return matchesStatus && matchesDate
    })

    const dataTableFiltered: DataGridDataSolicitation = {
      columns: columns,
      rows: FormatSolicitationToTable(filtered)
    }
    setData(dataTableFiltered)
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Search Filters' sx={{ pb: 4, '& .MuiCardHeader-title': { letterSpacing: '.15px' } }} />
          <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Grid container spacing={6}>
              <Grid item sm={6} xs={12}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label='Initial Date'
                    value={initialDate}
                    onChange={(newValue: Date | null) => setInitialDate(newValue)}
                    renderInput={params => <TextField {...params} fullWidth />}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item sm={6} xs={12}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label='End Date'
                    value={endDate}
                    onChange={(newValue: Date | null) => setEndDate(newValue)}
                    renderInput={params => <TextField {...params} fullWidth />}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>
            <Grid container spacing={6}>
              <Grid item sm={6} xs={12}>
                <InputLabel id='type-label'>Status</InputLabel>
                <Select
                  labelId='type-label'
                  value={statusFilter}
                  onChange={(e: SelectChangeEvent<string>) => setStatusFilter(e.target.value)}
                  fullWidth
                >
                  <MenuItem value=''>
                    <em>None</em>
                  </MenuItem>

                  <MenuItem value='PENDING'>PENDING</MenuItem>
                  <MenuItem value='APPROVED'>APPROVED</MenuItem>
                  <MenuItem value='FORWARDED'>FORWARDED</MenuItem>
                </Select>
              </Grid>
            </Grid>

            <Grid sx={{ display: 'flex', justifyContent: 'end' }}>
              {/* <Button variant='contained' color='primary' onClick={handleFiltersValues}> */}
              <Button variant='contained' color='primary' onClick={handleFiltersValues}>
                Search
              </Button>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <TableBasic columns={data.columns} rows={data.rows} />
      </Grid>
      {solicitationSelected !== null && (
        <DialogEdit data={solicitationSelected} open={modalOpen} onClose={handleCloseModal} />
      )}
    </Grid>
  )
}

export default Solicitation
