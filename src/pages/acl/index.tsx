// ** React Imports
// import { useContext } from 'react'

// // ** Context Imports
// import { AbilityContext } from 'src/layouts/components/acl/Can'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

const ACLPage = () => {
  // ** Hooks
  // const ability = useContext(AbilityContext)

  return (
    <Grid container spacing={6}>
      <Grid item md={6} xs={12}>
        <Card>
          <CardHeader title='Página da imobiliária' />
          <CardContent>
            <Typography sx={{ mb: 4 }}>Página destinada para colocar o template da imobiliária</Typography>
            <Typography sx={{ color: 'primary.main' }}>Esse card é ilustrativo para a página da imobiliária</Typography>
          </CardContent>
        </Card>
      </Grid>
      {/* {ability?.can('read', 'analytics') ? (
        <Grid item md={6} xs={12}>
          <Card>
            <CardHeader title='Analytics' />
            <CardContent>
              <Typography sx={{ mb: 4 }}>User with 'Analytics' subject's 'Read' ability can view this card</Typography>
              <Typography sx={{ color: 'error.main' }}>This card is visible to 'admin' only</Typography>
            </CardContent>
          </Card>
        </Grid>
      ) : null} */}
    </Grid>
  )
}

ACLPage.acl = {
  action: 'read',
  subject: 'acl-page'
}

export default ACLPage
