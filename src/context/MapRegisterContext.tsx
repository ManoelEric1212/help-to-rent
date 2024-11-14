import React, { createContext, useContext, useState, ReactNode } from 'react'
import { getAllRealStates } from 'src/requests/realStateRequest'

type MapRegisterContextType = {
  setNewPoint: (value: pointRegisterType | null) => void
  newPoint: pointRegisterType | null
  fetchAllPointers: () => Promise<
    | {
        key: string
        location: {
          lat: number
          lng: number
        }
      }[]
    | undefined
  >
}

type pointRegisterType = {
  lat: number
  lng: number
}

const MapRegisterContext = createContext<MapRegisterContextType | undefined>(undefined)

type MapRegisterProps = {
  children: ReactNode
}

export const MapRegisterProvider: React.FC<MapRegisterProps> = ({ children }) => {
  const [newPoint, setNewPoint] = useState<pointRegisterType | null>(null)

  const fetchAllPointers = async () => {
    try {
      const data = await getAllRealStates()
      if (data) {
        const pointers = data.map(item => {
          return {
            key: item.region,
            location: {
              lat: item.lat,
              lng: item.lng
            }
          }
        })

        return pointers
      }
    } catch (error) {
      throw new Error('Error fetchAllPointers')
    }
  }

  return (
    <MapRegisterContext.Provider value={{ setNewPoint, newPoint, fetchAllPointers }}>
      {children}
    </MapRegisterContext.Provider>
  )
}

export const useMapRegister = (): MapRegisterContextType => {
  const context = useContext(MapRegisterContext)
  if (!context) {
    throw new Error('useMapRegister must be used within a MapRegisterProvider')
  }

  return context
}
