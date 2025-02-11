import { useState } from 'react'
import { Box, Button, Modal, Typography, TextField, Grid, Card } from '@mui/material'

const ContactUsComponent = () => {
  const [open, setOpen] = useState(false)

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
              background: '#25235D',
              color: '#fff',
              height: '7vh',
              '&:hover': {
                backgroundColor: '#4c4a6f'
              }
            }}
            onClick={() => setOpen(true)}
          >
            Contact Us
          </Button>
        </Box>
      </Card>

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
            Fale Conosco
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField fullWidth label='Name' variant='outlined' />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label='Email' variant='outlined' />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label='Message' multiline rows={4} variant='outlined' />
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

export default ContactUsComponent
