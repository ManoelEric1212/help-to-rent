/* eslint-disable lines-around-comment */
// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import CardHeader from '@mui/material/CardHeader'
import TableBasic, { DataGridDataUser, UserType } from './components/TableBasic'
import {
  Box,
  Button,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField
} from '@mui/material'
import { ChangeEvent, useEffect, useState } from 'react'
import { GridColDef } from '@mui/x-data-grid'

import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'

import Chip from 'src/components/chip'
import { deleteUser, getUserRequest, User } from 'src/requests/usersRequest'

import { format } from 'date-fns'
import DialogEdit from './components/DialogEdit'
import { FormatUserToTable } from 'src/utils/format-users-to-table'
import toast from 'react-hot-toast'

export type DateType = Date | null | undefined

export interface CellType {
  row: UserType
}

const Users = () => {
  const [data, setData] = useState<DataGridDataUser>({ columns: [], rows: [] })
  const [users, setUsers] = useState<User[]>([])
  const [nameFilter, setNameFilter] = useState<string>('')
  const [roleFilter, setRoleFilter] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<string>('')

  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [modalData, setModalData] = useState<UserType | null>(null)
  const [modalData2, setModalData2] = useState<UserType | null>(null)

  const [open, setOpen] = useState(false)

  const handleOpenA = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const columns: GridColDef[] = [
    {
      flex: 0.1,
      field: 'name',
      minWidth: 230,
      headerName: 'Name'
    },
    {
      flex: 0.15,
      minWidth: 80,
      field: 'number',
      headerName: 'Number'
    },
    {
      flex: 0.1,
      minWidth: 80,
      field: 'role',
      headerName: 'Role'
    },
    {
      flex: 0.1,
      type: 'string',
      minWidth: 100,
      headerName: 'Solicitation Date',
      field: 'solicitation_date',
      valueGetter: params => format(new Date(params.value), 'dd/MM/yyyy HH:mm')
    },
    {
      flex: 0.1,
      field: 'status',
      minWidth: 80,
      headerName: 'Status',
      renderCell: ({ row }: CellType) => {
        return (
          <Chip
            skin='light'
            size='small'
            label={row.status === true ? 'Active' : 'Inactive'}
            color={row.status === true ? 'success' : 'warning'}
            sx={{ textTransform: 'capitalize', '& .MuiChip-label': { lineHeight: '18px' } }}
          />
        )
      }
    },
    {
      flex: 0.15,
      field: 'action',
      minWidth: 160,
      headerName: 'Action',
      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ display: 'flex', gap: '0.4rem' }}>
            <Button
              variant='outlined'
              color='primary'
              onClick={() => {
                setModalData(row)
                console.log('s')
                setTimeout(() => {
                  setModalOpen(true)
                }, 100)
              }}
            >
              <EditIcon />
            </Button>
            <Button
              variant='outlined'
              color='error'
              onClick={() => {
                setModalData2(row)
                setTimeout(() => handleOpenA(), 500)
              }}
            >
              <DeleteIcon />
            </Button>
          </Box>
        )
      }
    }
  ]

  async function getUsers() {
    try {
      const data = await getUserRequest()
      setUsers(data)
      const dataTable: DataGridDataUser = {
        columns: columns,
        rows: FormatUserToTable(data)
      }
      setData(dataTable)
    } catch (error) {
      console.warn(error)
    }
  }

  const deleteUserRegister = async () => {
    console.log('modalData2', modalData2)
    if (modalData2?.id.length === 0) return
    try {
      await deleteUser(modalData2?.id as string)
      getUsers()
      toast.success('user has been deleted!')
    } catch (error) {
      throw new Error('Erro delete user options')
    }
  }

  const handleCloseModal = () => {
    setTimeout(() => {
      getUsers()
    }, 700)

    setModalOpen(false)
  }

  const handleName = (event: ChangeEvent<HTMLInputElement>) => setNameFilter(event.target.value)

  const handleRole = (e: SelectChangeEvent) => setRoleFilter(e.target.value)

  const handleStatus = (e: SelectChangeEvent) => setStatusFilter(e.target.value)

  const handleFiltersValues = () => {
    const filtered = users.filter(user => {
      const matchesName = user.name.toLowerCase().includes(nameFilter.toLowerCase())
      const matchesRole = roleFilter ? user.role === roleFilter : true
      const matchesStatus = statusFilter ? (statusFilter === 'active' ? user.activity : !user.activity) : true

      return matchesName && matchesRole && matchesStatus
    })
    const dataTableFiltered: DataGridDataUser = {
      columns: columns,
      rows: FormatUserToTable(filtered)
    }
    setData(dataTableFiltered)
  }
  useEffect(() => {
    getUsers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  // ** States

  return (
    <Grid container spacing={6} sx={{ padding: '1rem' }}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Search Filters' sx={{ pb: 4, '& .MuiCardHeader-title': { letterSpacing: '.15px' } }} />
          <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Grid container spacing={6}>
              <Grid item sm={4} xs={12}>
                <TextField
                  fullWidth
                  label='Name'
                  placeholder='Terraced House'
                  value={nameFilter}
                  onChange={handleName}
                />
              </Grid>
              <Grid item sm={4} xs={12}>
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
              <Grid item sm={4} xs={12}>
                <FormControl fullWidth>
                  <InputLabel id='status'>Status</InputLabel>
                  <Select
                    value={statusFilter}
                    id='status'
                    label='Select Status'
                    labelId='status'
                    onChange={handleStatus}
                    inputProps={{ placeholder: 'Select Agent' }}
                  >
                    <MenuItem value=''>None</MenuItem>
                    <MenuItem value='active'>Active</MenuItem>
                    <MenuItem value='inactive'>Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Grid sx={{ display: 'flex', justifyContent: 'end' }}>
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
      <DialogEdit open={modalOpen} onClose={handleCloseModal} data={modalData} />

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Attention</DialogTitle>
        <DialogContent>
          <DialogContentText>You are about to delete the user registration. Are you sure about this?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color='primary'>
            Cancel
          </Button>
          <Button
            onClick={() => {
              deleteUserRegister()
              handleClose()
            }}
            autoFocus
            color='error'
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  )
}

export default Users
