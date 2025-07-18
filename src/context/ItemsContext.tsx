import React, { createContext, useContext, useState, ReactNode } from 'react'
import { RealStateType } from 'src/requests/realStateRequest'

export interface filtersT {
  intentionStatus?: string
  subIntentionStatus?: string
  region?: string
  area_region?: string
  maxPrice?: number
  minPrice?: number
  roomsNumber?: number
  type?: string
}

type ItemsContextType = {
  itemsMosted: RealStateType[]
  setItemsMosted: React.Dispatch<React.SetStateAction<RealStateType[]>>
  itemsMosted2: RealStateType[]
  setItemsMosted2: React.Dispatch<React.SetStateAction<RealStateType[]>>
  itemById: RealStateType | null
  setItemById: React.Dispatch<React.SetStateAction<RealStateType | null>>
  loading: boolean
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
  filters: filtersT | null
  setFilters: React.Dispatch<React.SetStateAction<filtersT | null>>
}

const ItemsContext = createContext<ItemsContextType | undefined>(undefined)

type MapRegisterProps = {
  children: ReactNode
}

export const ItemsProvider: React.FC<MapRegisterProps> = ({ children }) => {
  const [itemsMosted, setItemsMosted] = useState<RealStateType[]>([])
  const [itemsMosted2, setItemsMosted2] = useState<RealStateType[]>([])
  const [itemById, setItemById] = useState<RealStateType | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [filters, setFilters] = useState<filtersT | null>(null)

  return (
    <ItemsContext.Provider
      value={{
        itemsMosted,
        setItemsMosted,
        itemById,
        setItemById,
        itemsMosted2,
        setItemsMosted2,
        loading,
        setLoading,
        filters,
        setFilters
      }}
    >
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
