import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { Dialog, DialogTitle, DialogContent } from '@mui/material'
import { useAuth } from 'src/hooks/useAuth'

import UpdateAgentForm from 'src/components/FormUpdateRegister'

type ModalContextType = {
  openDialog: (title: string, content: ReactNode) => void
  closeDialog: () => void
  openCon: boolean
  setOpenCon: React.Dispatch<React.SetStateAction<boolean>>
}

const ModalContext = createContext<ModalContextType | undefined>(undefined)

type ModalProviderProps = {
  children: ReactNode
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [dialogTitle, setDialogTitle] = useState<string>('')
  const [dialogContent, setDialogContent] = useState<ReactNode>(null)
  const [openCon, setOpenCon] = useState(false)

  const { user, agent } = useAuth()

  useEffect(() => {
    if (user && user.role === 'agent' && user.updatedProfile === false && agent) {
      openDialog('Complete Agent Register', <UpdateAgentForm dataAgent={agent} />)
    }
  }, [agent, user])

  const openDialog = (title: string, content: ReactNode) => {
    setDialogTitle(title)
    setDialogContent(content)
    setIsOpen(true)
  }

  const closeDialog = () => {
    setIsOpen(false)
    setDialogContent(null)
  }

  return (
    <ModalContext.Provider value={{ openDialog, closeDialog, openCon, setOpenCon }}>
      {children}
      <Dialog open={isOpen} onClose={closeDialog}>
        <DialogTitle>{dialogTitle}</DialogTitle>
        <DialogContent dividers>{dialogContent}</DialogContent>
      </Dialog>
    </ModalContext.Provider>
  )
}

export const useModal = (): ModalContextType => {
  const context = useContext(ModalContext)
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider')
  }

  return context
}
