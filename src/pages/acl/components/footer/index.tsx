import { Box, Divider, Grid, Typography } from '@mui/material'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'
import { shareToWhatsAppNumber } from 'src/@core/components/WhatssAppComponent'
import FacebookIcon from '@mui/icons-material/Facebook'
import InstagramIcon from '@mui/icons-material/Instagram'

const FooterComponent = () => {
  return (
    <>
      <Box
        sx={{
          width: '100%',
          background: '#25235D',

          padding: { xs: '1.5rem 1.5rem 0.2rem 1.5rem', sm: '2rem 2rem 0.2rem 2rem', md: '3rem 3rem 0.2rem 3rem' }

          // padding: { xs: '1.5rem', sm: '2rem', md: '3rem' }
        }}
      >
        <Grid
          container
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.6rem',
              alignItems: { xs: 'center', sm: 'flex-start' },
              textAlign: { xs: 'center', sm: 'left' }
            }}
          >
            <img src='/images/logo3.png' alt='Real State Icon' style={{ width: '180px' }} />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Box
                sx={{
                  display: 'flex',
                  gap: '0.4rem',
                  alignItems: 'center',
                  color: '#fff',
                  justifyContent: { xs: 'center', sm: 'flex-start' },
                  '&:hover': {
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }
                }}
                onClick={() => {
                  const phoneNumber = '35699321008'
                  const message = encodeURIComponent('Hello ! I need more informations about Atlam Properties...')
                  shareToWhatsAppNumber(phoneNumber, message)
                }}
              >
                <WhatsAppIcon />
                <Typography>+356 9932 1008</Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  gap: '0.4rem',
                  alignItems: 'center',
                  color: '#fff',
                  justifyContent: { xs: 'center', sm: 'flex-start' },
                  '&:hover': {
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }
                }}
                onClick={() => {
                  window.open('https://www.facebook.com/share/1AVUy6Ma2a/?mibextid=wwXIfr', '_blank')
                }}
              >
                <FacebookIcon />
                <Typography>Facebook</Typography>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  gap: '0.4rem',
                  alignItems: 'center',
                  color: '#fff',
                  justifyContent: { xs: 'center', sm: 'flex-start' },
                  '&:hover': {
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }
                }}
                onClick={() => {
                  window.open('https://www.instagram.com/atlamproperties?igsh=cmp5YTlkMXQ1NWNo&utm_source=qr', '_blank')
                }}
              >
                <InstagramIcon />
                <Typography>Instagram</Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  gap: '0.4rem',
                  alignItems: 'center',
                  color: '#fff',
                  justifyContent: { xs: 'center', sm: 'flex-start' }
                }}
              >
                <LocationOnOutlinedIcon />
                <Typography>22 Triq San Pawl, Sliema, SLM 1510, Malta</Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  gap: '0.4rem',
                  alignItems: 'center',
                  color: '#fff',
                  justifyContent: { xs: 'center', sm: 'flex-start' }
                }}
              >
                <EmailOutlinedIcon />
                <Typography>info@atlamproperties.com</Typography>
              </Box>
            </Box>
          </Grid>

          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            sx={{
              display: 'flex',
              justifyContent: { xs: 'center', sm: 'flex-end' },
              alignItems: 'center',
              textAlign: { xs: 'center', sm: 'left' }
            }}
          >
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                color: '#fff'
              }}
            >
              <Typography variant='h6' color='white'>
                Our services
              </Typography>
              <Typography sx={{ '&:hover': { textDecoration: 'underline', cursor: 'pointer' } }}>
                Property Types in Malta
              </Typography>
              <Typography sx={{ '&:hover': { textDecoration: 'underline', cursor: 'pointer' } }}>
                Property Types in Gozo Our Agents
              </Typography>

              <Typography sx={{ '&:hover': { textDecoration: 'underline', cursor: 'pointer' } }}>
                Testimonials Our Company
              </Typography>
              <Typography sx={{ '&:hover': { textDecoration: 'underline', cursor: 'pointer' } }}>Our Offers</Typography>
            </Grid>
          </Grid>

          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            sx={{
              display: 'flex',
              justifyContent: { xs: 'center', sm: 'flex-end' },
              alignItems: 'center',
              textAlign: { xs: 'center', sm: 'left' }
            }}
          >
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                color: '#fff'
              }}
            >
              <Typography variant='h6' color='white'>
                Popular Search
              </Typography>
              <Typography sx={{ '&:hover': { textDecoration: 'underline', cursor: 'pointer' } }}>
                Property For Sale in Malta
              </Typography>
              <Typography sx={{ '&:hover': { textDecoration: 'underline', cursor: 'pointer' } }}>
                Property For Rent in Malta
              </Typography>

              <Typography sx={{ '&:hover': { textDecoration: 'underline', cursor: 'pointer' } }}>
                Best Apartments for sale in this year
              </Typography>
              <Typography sx={{ '&:hover': { textDecoration: 'underline', cursor: 'pointer' } }}>
                Search properties for rent{' '}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Divider sx={{ backgroundColor: '#fff', margin: '1rem 0' }} />
      </Box>
      <Box sx={{ width: '100%', background: '#8B181B', padding: '1rem' }}>
        <Typography variant='body2' color='white' sx={{ textAlign: 'center', paddingBottom: '1rem' }}>
          © {new Date().getFullYear()} Atlam Properties. All rights reserved.
        </Typography>
      </Box>
    </>
  )
}

export default FooterComponent
