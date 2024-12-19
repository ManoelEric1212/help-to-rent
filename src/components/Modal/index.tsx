import React from 'react'
import { Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

type ModalProps = {
  open: boolean
  title: string
  content: React.ReactNode
  onClose: () => void
}

const Modal: React.FC<ModalProps> = ({ open, title, content, onClose }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose} // Fecha o modal ao clicar fora
      aria-labelledby='modal-title'
      fullWidth
      maxWidth='md'
      sx={{
        '& .MuiDialog-paper': {
          width: '70%',
          maxHeight: '80vh'
        }
      }}
      disableEscapeKeyDown={false} // Permite fechar ao pressionar Esc
    >
      <DialogTitle id='modal-title'>
        {title}
        <IconButton
          edge='end'
          color='inherit'
          onClick={onClose} // Fecha o modal ao clicar no ícone
          aria-label='close'
          sx={{
            position: 'absolute',
            right: 8,
            top: 8
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ overflowY: 'auto' }}>
        {content}
      </DialogContent>
    </Dialog>
  )
}

export default Modal
