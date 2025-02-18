import React from 'react'
import { Modal, Box, Typography, Button, useMediaQuery } from '@mui/material'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'

interface Owner {
  mainPhone: string
  altPhone?: string
  name?: string
  codeNumber: string
  email?: string
}

interface OwnerDetailsModalProps {
  open: boolean
  handleClose: () => void
  owner: Owner
}

const OwnerDetailsModal: React.FC<OwnerDetailsModalProps> = ({ open, handleClose, owner }) => {
  const { mainPhone, altPhone, codeNumber, email, name } = owner
  const isSmallScreen = useMediaQuery('(max-width:600px)')

  const handleWhatsApp = () => {
    const complete = `${codeNumber}${mainPhone}`
    const phoneNumber = complete.replace(/\D/g, '')
    window.open(`https://wa.me/${phoneNumber}`, '_blank')
  }

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: isSmallScreen ? '90%' : 600,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2
        }}
      >
        <Typography variant='h6' gutterBottom>
          Owner Details
        </Typography>
        <Typography variant='body1'>Name: {name}</Typography>
        <Typography variant='body1'>Phone: {`+${codeNumber} ${mainPhone}`}</Typography>
        <Typography variant='body1'>Alternative number: {`+${codeNumber} ${altPhone}`}</Typography>
        <Typography variant='body1'>Email: {email || 'Not informated'}</Typography>
        <Button
          variant='contained'
          color='success'
          startIcon={<WhatsAppIcon />}
          sx={{ mt: 2, width: '100%' }}
          onClick={handleWhatsApp}
        >
          Check in the Whatsapp
        </Button>
      </Box>
    </Modal>
  )
}

export default OwnerDetailsModal
