import * as React from 'react'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { useRouter } from 'next/router'
import HoverButton from './components/hoverButton/HoverButton'
import InstagramIcon from '@mui/icons-material/Instagram'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import XIcon from '@mui/icons-material/X'
import SearchFiltersItem from './components/searchItemsFilter'

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536
    }
  }
})

const ACLPage = () => {
  const router = useRouter()
  const matches = useMediaQuery('(min-width:500px)')
  const matches2 = useMediaQuery('(min-width:800px)')

  return (
    <ThemeProvider theme={theme}>
      <>
        <Box
          sx={{
            position: 'relative',
            height: '15vh'
          }}
        >
          {matches2 && (
            <Box sx={{ background: '#000', justifyContent: 'end', display: 'flex' }}>
              <Box sx={{ width: '50%', display: 'flex', gap: '2rem' }}>
                <Typography sx={{ color: 'white' }}>+54 351 7608588</Typography>
                <Typography sx={{ color: 'white' }}>info@email.com</Typography>
                <Box sx={{ display: 'flex', gap: '10px' }}>
                  <InstagramIcon sx={{ fill: '#fff' }} />
                  <LinkedInIcon sx={{ fill: '#fff' }} />
                  <XIcon sx={{ fill: '#fff' }} />
                </Box>
              </Box>
            </Box>
          )}

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: { xs: 'center', md: 'space-between' },
              padding: '0 1rem 1rem 1rem',
              gap: { xs: '1rem', md: '3.5rem' }
            }}
          >
            {matches2 && (
              <img
                src='/images/real-state-icon.png'
                alt='Real State Icon'
                style={{
                  width: '80px',
                  height: '80px',
                  objectFit: 'contain'
                }}
              />
            )}
            <Box sx={{ display: 'flex', gap: { xs: '0.2rem', md: '3.5rem', sm: '2rem' } }}>
              <HoverButton
                text='Home'
                selected={router.pathname === '/acl' ? true : false}
                handleOnClick={() => router.replace('/acl')}
              />
              <HoverButton
                text='Properties'
                selected={router.pathname === '/acl/properties' ? true : false}
                handleOnClick={() => router.replace('/acl/properties')}
              />
              <HoverButton
                text='Contact'
                selected={router.pathname === '/acl/contact' ? true : false}
                handleOnClick={() => router.replace('/acl/contact')}
              />
              <HoverButton
                text='Login'
                selected={router.pathname === '/login' ? true : false}
                handleOnClick={() => router.replace('/login')}
              />
            </Box>
          </Box>
        </Box>
        <Grid sx={{ marginTop: '1rem' }}>
          <Box
            sx={{
              backgroundImage: `url('/images/background.svg')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              height: '100vh',
              display: { xs: 'flex', sm: 'flex' },
              justifyContent: 'center',
              alignItems: 'start',
              opacity: 0.8
            }}
          >
            <Grid sx={{ width: '100%' }}>
              <Typography
                color='white'
                sx={{
                  fontSize: { xs: '1.5rem', md: '2rem', lg: '3rem' },
                  fontStyle: 'italic',
                  fontWeight: 'bold',
                  textAlign: 'center'
                }}
              >
                Find your ideal place in Malta
              </Typography>
              <Grid sx={{ display: 'flex', justifyContent: 'center' }}>
                <Grid sx={{ background: 'white', width: '70vw', borderRadius: '0.7rem', padding: '0.7rem' }}>
                  <SearchFiltersItem />
                </Grid>
              </Grid>
            </Grid>
          </Box>
          {!matches && <h1>opi</h1>}
        </Grid>
      </>
    </ThemeProvider>
  )
}

export default ACLPage
