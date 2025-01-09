// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import CardHeader from '@mui/material/CardHeader'
import { useAuth } from 'src/hooks/useAuth'
import { Box } from '@mui/system'
import { Button } from '@mui/material'
import { useRouter } from 'next/router'

const Home = () => {
  const { user } = useAuth()
  const router = useRouter()

  return (
    <Grid container spacing={6} sx={{ display: 'flex', justifyContent: 'center' }}>
      <Grid item xs={8}>
        <Card>
          <CardHeader title={`Welcome ${user?.fullName}, how do you want to start today ?`}></CardHeader>
          <Box sx={{ display: 'flex', flexDirection: 'column', padding: '2rem', gap: '1rem' }}>
            <Button variant='contained' onClick={() => router.replace('/real-state')}>
              Search Properties
            </Button>
            <Button variant='contained'>Latest Properties</Button>
            <Button variant='contained' onClick={() => router.replace('/real-state/register')}>
              Add property
            </Button>
            <Button variant='contained' onClick={() => router.replace('/solicitations')}>
              Solicitations
            </Button>
          </Box>
        </Card>
      </Grid>
    </Grid>
  )
}

export default Home
