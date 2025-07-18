import { useState } from 'react'
import { Box, Button, Modal, Typography, TextField, Grid, Card } from '@mui/material'
import { EmailDTO, sendEmail } from 'src/requests/emailRequest'
import toast from 'react-hot-toast'
import { useModal } from 'src/context/SettingsAgentContext'

const ContactUsComponent = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '', phone: '' })
  const [country, setCountry] = useState('')

  const { openCon, setOpenCon } = useModal()

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const handleSubmit = async () => {
    // Envia a requisição para o backend
    try {
      const body: EmailDTO = {
        email: form.email,
        message: form.message,
        name: form.name,
        phone: `+${country} ${form.phone}`
      }
      const data = await sendEmail(body)
      console.log('data', data)
      setOpenCon(false)
      toast.success('Your message has been sent !')
    } catch (error) {
      setOpenCon(false)
      toast.error('Error a sent message, contact to admin !')
    }
  }

  return (
    <>
      <Card
        sx={{
          position: 'relative',
          backgroundImage: "url('/images/malta3.JPG')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '300px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          color: 'white',
          padding: '2rem',
          borderRadius: 3,
          boxShadow: 3,
          margin: '0 auto',
          width: { xs: '100%', md: '100%' }
        }}
      >
        <Box
          sx={{
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '1rem',
            borderRadius: 3
          }}
        >
          <Typography variant='h4' fontWeight='bold'>
            Contact US
          </Typography>
          <Typography variant='body1' sx={{ maxWidth: '600px', marginTop: 2 }}>
            Need help or have any questions? We are ready to serve you. Click the button below and contact us right now!
          </Typography>
          <Button
            sx={{
              marginTop: 3,
              background: '#8B181B',
              color: '#fff',
              height: '7vh',
              '&:hover': {
                backgroundColor: '#4c4a6f'
              }
            }}
            onClick={() => setOpenCon(true)}
          >
            Contact Us
          </Button>
        </Box>
      </Card>

      <Modal open={openCon} onClose={() => setOpenCon(false)}>
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
            Contact us
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
            <Button variant='outlined' color='error' onClick={() => setOpenCon(false)}>
              Close
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  )
}

export default ContactUsComponent
