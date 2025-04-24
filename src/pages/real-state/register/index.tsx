// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import CardHeader from '@mui/material/CardHeader'
import RegisterRealStateComponent from '../components/RegisterForm'
import { CardContent } from '@mui/material'

const RegisterRealState = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Register a Real Estate'></CardHeader>
          <CardContent>
            <RegisterRealStateComponent />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default RegisterRealState
