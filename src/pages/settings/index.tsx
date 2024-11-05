// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import CardHeader from '@mui/material/CardHeader'

const Home = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Página de configurações'></CardHeader>
        </Card>
      </Grid>
    </Grid>
  )
}

export default Home
