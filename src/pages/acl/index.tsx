import * as React from 'react'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { ThemeProvider, createTheme } from '@mui/material/styles'

import SearchFiltersItem from './components/searchItemsFilter'
import Header from './components/header'
import MostedItems from './components/MostedItems'
import { useMediaQuery } from '@mui/material'
import FooterComponent from './components/footer'
import ContactUsComponent from './components/contactUs'

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

const images = [
  '/images/malta1.JPG',
  '/images/malta2.JPG',
  '/images/malta3.JPG',
  '/images/malta4.JPG'

  // '/images/malta5.JPG',
  // '/images/malta6.JPG',
  // '/images/malta7.JPG'

  // '/images/malta8.JPG'
]

const ACLPage = () => {
  // const router = useRouter()
  const matches = useMediaQuery('(min-width:600px)')
  const [currentImage, setCurrentImage] = React.useState(0)

  // const matches2 = useMediaQuery('(min-width:800px)')
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage(prev => (prev + 1) % images.length)
    }, 5000) // Muda a cada 5 segundos

    return () => clearInterval(interval)
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <>
        <Header />
        <Grid>
          <Box
            sx={{
              backgroundImage: `url(${images[currentImage]})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              height: { xs: '100vh', md: '90vh', lg: '90vh' },
              display: { xs: 'flex', sm: 'flex' },
              justifyContent: 'center',
              alignItems: 'start',
              opacity: 0.9
            }}
          >
            <Grid sx={{ width: '100%', marginTop: '10rem' }}>
              {matches && (
                <Typography
                  sx={{
                    fontSize: { xs: '1.5rem', md: '2rem', lg: '3rem' },
                    fontStyle: 'italic',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    color: '#25235D'
                  }}
                >
                  Find your ideal place in Malta
                </Typography>
              )}

              <Grid sx={{ display: 'flex', justifyContent: 'center' }}>
                <Grid sx={{ width: '65vw' }}>
                  <SearchFiltersItem />
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Grid>
        <Grid sx={{ padding: '1rem 2rem 1rem 2rem' }}>
          <Box sx={{ marginTop: { xs: '3.0rem', md: '.5rem', lg: '.5rem' } }}>
            <MostedItems />
          </Box>
          <Grid sx={{ marginTop: '1rem' }}>
            <ContactUsComponent />
          </Grid>
        </Grid>
        <FooterComponent />
      </>
    </ThemeProvider>
  )
}
export default ACLPage
