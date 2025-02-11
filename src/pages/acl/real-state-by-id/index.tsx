import * as React from 'react'
import Grid from '@mui/material/Grid'

import { ThemeProvider, createTheme } from '@mui/material/styles'

import Header from '../components/header'
import ContactUsComponent from '../components/contactUs'
import FooterComponent from '../components/footer'
import { useItems } from 'src/context/ItemsContext'
import DetailsRealStateComponent from '../components/detailsRealState'

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

const RealStateById = () => {
  const { itemById } = useItems()
  console.log('oi', itemById)

  return (
    <ThemeProvider theme={theme}>
      <>
        <Header />
        <Grid sx={{ padding: '1rem 2rem 1rem 2rem' }}>
          <DetailsRealStateComponent data={itemById} />
          <Grid sx={{ marginTop: '1rem' }}>
            <ContactUsComponent />
          </Grid>
        </Grid>
        <FooterComponent />
      </>
    </ThemeProvider>
  )
}

export default RealStateById
