import { Backdrop, CircularProgress, Typography, Box } from '@mui/material'

interface LoadingOverlayProps {
  loading: boolean
  message?: string
}

export default function LoadingOverlay({ loading, message = 'Carregando...' }: LoadingOverlayProps) {
  return (
    <Backdrop sx={{ color: '#fff', zIndex: 9999, flexDirection: 'column' }} open={loading}>
      <CircularProgress color='inherit' />
      <Box mt={2}>
        <Typography variant='h6'>{message}</Typography>
      </Box>
    </Backdrop>
  )
}
