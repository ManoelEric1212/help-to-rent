import * as React from 'react'
import Grid from '@mui/material/Grid'

import { ThemeProvider, createTheme } from '@mui/material/styles'

import FooterComponent from '../components/footer'

import ContactUsComponent from '../components/contactUs'
import MostedItems2 from '../components/MostedProperties'
import Header2 from '../components/header2'

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

const Properties = () => {
  return (
    <ThemeProvider theme={theme}>
      <>
        <Header2 />
        <Grid sx={{ padding: '1rem 2rem 1rem 2rem' }}>
          <Grid
            sx={{
              flexDirection: { xs: 'column', sm: 'row' },
              marginTop: '6rem' // Muda para coluna em telas pequenas
            }}
          >
            <MostedItems2 />
          </Grid>
          <Grid sx={{ marginTop: '1rem' }}>
            <ContactUsComponent />
          </Grid>
        </Grid>
        <FooterComponent />
      </>
    </ThemeProvider>
  )
}

export default Properties
