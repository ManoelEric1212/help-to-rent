import { useState } from 'react'
import { Box, Button, Modal, Typography, TextField, Grid } from '@mui/material'
import { EmailRentDTO, sendEmailRent } from 'src/requests/emailRequest'
import EmailIcon from '@mui/icons-material/Email'
import toast from 'react-hot-toast'

interface realProps {
  id: string
  link: string
}
const ButtonRequest = ({ id, link }: realProps) => {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', message: '', phone: '' })
  const [country, setCountry] = useState('')

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const handleSubmit = async () => {
    // Envia a requisição para o backend
    try {
      const body: EmailRentDTO = {
        email: form.email,
        message: form.message,
        name: form.name,
        phone: `+${country} ${form.phone}`,
        idNumber: id,
        linkToRent: link
      }
      const data = await sendEmailRent(body)
      console.log('data', data)
      setOpen(false)
      toast.success('Your message has been sent !')
    } catch (error) {
      setOpen(false)
      toast.error('Error a sent message, contact to admin !')
    }
  }

  return (
    <>
      <Button variant='contained' startIcon={<EmailIcon />} onClick={() => setOpen(true)}>
        Send us a request
      </Button>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '90%', md: '50%' },
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: 2,
            boxShadow: 24
          }}
        >
          <Typography variant='h5' fontWeight='bold' gutterBottom>
            Contact us for more informations for Real Estate: {id}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Name'
                variant='outlined'
                name='name'
                value={form.name}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Email'
                variant='outlined'
                name='email'
                value={form.email}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sx={{ display: 'flex', gap: '0.4rem' }}>
              <TextField
                label='Country code'
                placeholder='+355'
                variant='outlined'
                name='phone'
                value={country}
                onChange={e => {
                  const value = e.target.value
                  setCountry(value)
                }}
              />
              <TextField
                fullWidth
                label='Phone'
                placeholder='8383898383'
                variant='outlined'
                name='phone'
                value={form.phone}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Message'
                multiline
                rows={4}
                variant='outlined'
                name='message'
                value={form.message}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '1.5rem'
            }}
          >
            <Button
              sx={{
                background: '#25235D',
                color: '#fff',
                '&:hover': {
                  backgroundColor: '#4c4a6f'
                }
              }}
              onClick={handleSubmit}
            >
              Send
            </Button>
            <Button variant='outlined' color='error' onClick={() => setOpen(false)}>
              Close
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  )
}

export default ButtonRequest
