import React from 'react'
import { Modal, Box, Typography, Button, useMediaQuery } from '@mui/material'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import { RealStateType } from 'src/requests/realStateRequest'
import FacebookIcon from '@mui/icons-material/Facebook'
import InstagramIcon from '@mui/icons-material/Instagram'
import {
  shareOnFacebookMessenger,
  shareOnInstagramDirect,
  shareOnWhatsApp
} from 'src/@core/components/WhatssAppComponent'

interface ShareDetailsModalProps {
  open: boolean
  handleClose: () => void
  data: RealStateType | null
}

const ShareDetailsModal: React.FC<ShareDetailsModalProps> = ({ open, handleClose, data }) => {
  const isSmallScreen = useMediaQuery('(max-width:600px)')

  const handleWhatsApp = () => {
    shareOnWhatsApp(
      ` Check out the following property available on the AtlamProperties website, for more details access the following link: \n https://atlamproperties.com/acl/real-state-by-id/?id=${data?.id}`
    )
  }

  const handleFb = () => {
    shareOnFacebookMessenger(
      ` Check out the following property available on the AtlamProperties website, for more details access the following link: \n https://atlamproperties.com/acl/real-state-by-id/?id=${data?.id}`
    )
  }

  const handleIns = () => {
    shareOnInstagramDirect(
      ` Check out the following property available on the AtlamProperties website, for more details access the following link: \n https://atlamproperties.com/acl/real-state-by-id/?id=${data?.id}`
    )
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
        {data && (
          <>
            <Typography variant='h6' gutterBottom>
              Share with client
            </Typography>

            <Button
              variant='contained'
              color='success'
              startIcon={<WhatsAppIcon />}
              sx={{ mt: 2, width: '100%' }}
              onClick={handleWhatsApp}
            >
              Whatsapp
            </Button>
            <Button
              variant='contained'
              color='error'
              startIcon={<InstagramIcon />}
              sx={{ mt: 2, width: '100%' }}
              onClick={handleIns}
            >
              Instagram
            </Button>
            <Button
              variant='contained'
              color='primary'
              startIcon={<FacebookIcon />}
              sx={{ mt: 2, width: '100%' }}
              onClick={handleFb}
            >
              Facebook
            </Button>
          </>
        )}
      </Box>
    </Modal>
  )
}

export default ShareDetailsModal
