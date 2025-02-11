import React, { createContext, useContext, useState, ReactNode } from 'react'
import { RealStateType } from 'src/requests/realStateRequest'

type ItemsContextType = {
  itemsMosted: RealStateType[]
  setItemsMosted: React.Dispatch<React.SetStateAction<RealStateType[]>>
  itemById: RealStateType | null
  setItemById: React.Dispatch<React.SetStateAction<RealStateType | null>>
}

const ItemsContext = createContext<ItemsContextType | undefined>(undefined)

type MapRegisterProps = {
  children: ReactNode
}

export const ItemsProvider: React.FC<MapRegisterProps> = ({ children }) => {
  const [itemsMosted, setItemsMosted] = useState<RealStateType[]>([])
  const [itemById, setItemById] = useState<RealStateType | null>(null)

  return (
    <ItemsContext.Provider value={{ itemsMosted, setItemsMosted, itemById, setItemById }}>
      {children}
    </ItemsContext.Provider>
  )
}

export const useItems = (): ItemsContextType => {
  const context = useContext(ItemsContext)
  if (!context) {
    throw new Error('useItemsContext not available !')
  }

  return context
}
