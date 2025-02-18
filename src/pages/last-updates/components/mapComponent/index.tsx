import { APIProvider, Map, AdvancedMarker, MapCameraChangedEvent, useMap, Pin } from '@vis.gl/react-google-maps'
import { MarkerClusterer } from '@googlemaps/markerclusterer'
import type { Marker } from '@googlemaps/markerclusterer'
import { useState, useRef, useEffect, useCallback, Dispatch, SetStateAction } from 'react'
import { useMapRegister } from 'src/context/MapRegisterContext'
import { RealStateType } from 'src/requests/realStateRequest'

type Poi = { key: string; location: google.maps.LatLngLiteral }

// const locations: Poi[] = [
//   { key: 'valletta', location: { lat: 35.8997, lng: 14.5147 } }, // Valletta, capital de Malta
//   { key: 'mdina', location: { lat: 35.8867, lng: 14.4033 } } // Mdina, cidade histórica
// ]
interface MapRegisterComponentProps {
  id: string
  dataRealStateByid: RealStateType | null
}

const MapRegisterComponent = ({ dataRealStateByid, id }: MapRegisterComponentProps) => {
  const [locations, setLocations] = useState<Poi[]>([])

  // const [center, setCenter] = useState<google.maps.LatLngLiteral>({ lat: 35.8997, lng: 14.5147 }) // Valor inicial
  // const [zoom, setZoom] = useState(13)
  const [circlePosition, setCirclePosition] = useState<google.maps.LatLngLiteral | null>(null)
  const [userControlledCenter, setUserControlledCenter] = useState<google.maps.LatLngLiteral>({
    lat: 35.8997,
    lng: 14.5147
  }) // Para controle do centro pelo usuário
  const [userControlledZoom, setUserControlledZoom] = useState<number>(13) // Para controle do zoom pelo usuário

  const { fetchAllPointers, newPointAddress } = useMapRegister()

  useEffect(() => {
    const fetchLocationsData = async () => {
      try {
        if (!id) {
          const response = await fetchAllPointers()
          if (response && response.length) {
            setLocations(response)
          }
        }
        if (id && dataRealStateByid && dataRealStateByid.id) {
          setLocations([])
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchLocationsData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  // Atualize o centro e o zoom com base em newPointAddress
  useEffect(() => {
    if (newPointAddress) {
      setCirclePosition(newPointAddress)
      setUserControlledCenter(newPointAddress)
      setUserControlledZoom(18)
    } else {
      setCirclePosition(null)
      setUserControlledCenter({
        lat: 35.8997,
        lng: 14.5147
      })
      setUserControlledZoom(13)
    }
  }, [newPointAddress])

  // Lógica para quando o usuário muda o centro e zoom do mapa manualmente
  const handleCameraChanged = (ev: MapCameraChangedEvent) => {
    // Só permite o controle manual se não houver newPointAddress
    setUserControlledCenter(ev.detail.center)
    setUserControlledZoom(ev.detail.zoom)
  }

  return (
    <APIProvider apiKey={'AIzaSyD25YE38B53ABbhr1f12MzGqk0CchtN4Fg'} onLoad={() => console.log('Maps API has loaded.')}>
      <Map
        center={userControlledCenter}
        zoom={userControlledZoom} // Use a propriedade controlada
        mapId='528e9d7e1a87a78f'
        onCameraChanged={handleCameraChanged}
      >
        {circlePosition && <BlinkingCircle position={circlePosition} />}
        <PoiMarkers pois={locations} />
        <UserMarkers data={dataRealStateByid} setCircle={setCirclePosition} />
      </Map>
    </APIProvider>
  )
}

const PoiMarkers = (props: { pois: Poi[] }) => {
  const map = useMap()
  const [markers, setMarkers] = useState<{ [key: string]: Marker }>({})
  const clusterer = useRef<MarkerClusterer | null>(null)

  // Initialize MarkerClusterer, if the map has changed
  useEffect(() => {
    if (!map) return
    if (!clusterer.current) {
      clusterer.current = new MarkerClusterer({ map })
    }
  }, [map])

  // Update markers, if the markers array has changed
  useEffect(() => {
    clusterer.current?.clearMarkers()
    clusterer.current?.addMarkers(Object.values(markers))
  }, [markers])

  const setMarkerRef = (marker: Marker | null, key: string) => {
    if (marker && markers[key]) return
    if (!marker && !markers[key]) return

    setMarkers(prev => {
      if (marker) {
        return { ...prev, [key]: marker }
      } else {
        const newMarkers = { ...prev }
        delete newMarkers[key]

        return newMarkers
      }
    })
  }

  const handleClick = useCallback((ev: google.maps.MapMouseEvent) => {
    if (!map) return
    if (!ev.latLng) return
    console.log('marker clicked:', ev.latLng.toString())
    map.panTo(ev.latLng)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      {props.pois.map((poi: Poi, index) => (
        <AdvancedMarker
          key={`${poi.key}-${index}`}
          position={poi.location}
          clickable={true}
          onClick={handleClick}
          ref={marker => setMarkerRef(marker, poi.key)}
        >
          <Pin background={'#FBBC04'} glyphColor={'#000'} borderColor={'#000'} />
        </AdvancedMarker>
      ))}
    </>
  )
}
interface UserMarkersProps {
  data: RealStateType | null
  setCircle: Dispatch<SetStateAction<google.maps.LatLngLiteral | null>>
}

const UserMarkers = ({ data, setCircle }: UserMarkersProps) => {
  const map = useMap()
  const { setNewPoint } = useMapRegister()
  const [userMarker, setUserMarker] = useState<google.maps.LatLngLiteral | null>(null)

  const handleMapClick = (ev: google.maps.MapMouseEvent) => {
    if (!ev.latLng) return
    if (userMarker) return // Se já houver um marcador, não permite adicionar outro

    const newMarkerPosition = {
      lat: ev.latLng.lat(),
      lng: ev.latLng.lng()
    }

    setUserMarker(newMarkerPosition)
    setNewPoint(newMarkerPosition)
    setCircle(null)
  }
  useEffect(() => {
    if (data) {
      setUserMarker({ lat: data.lat, lng: data.lng })
      setNewPoint({ lat: data.lat, lng: data.lng })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  useEffect(() => {
    if (map) {
      map.addListener('click', handleMapClick)
    }

    return () => {
      if (map) {
        google.maps.event.clearListeners(map, 'click')
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map])

  return (
    <>
      {userMarker && (
        <AdvancedMarker
          position={userMarker}
          draggable={true}
          onDragEnd={ev => {
            if (!ev.latLng) return
            const updatedPosition = {
              lat: ev.latLng.lat(),
              lng: ev.latLng.lng()
            }
            setUserMarker(updatedPosition)
            setNewPoint(updatedPosition)
          }}
        >
          <Pin background={'#4285F4'} glyphColor={'#FFF'} borderColor={'#FFF'} />
        </AdvancedMarker>
      )}
    </>
  )
}

const BlinkingCircle = ({ position }: { position: google.maps.LatLngLiteral }) => {
  const map = useMap()
  const circleRef = useRef<google.maps.Circle | null>(null)
  const [opacity, setOpacity] = useState(0.5) // Inicialize com uma opacidade padrão

  // Atualize o círculo
  useEffect(() => {
    if (!map || !position) return

    // Crie o círculo, se ainda não existir
    if (!circleRef.current) {
      circleRef.current = new google.maps.Circle({
        map,
        center: position,
        radius: 90, // Tamanho do círculo em metros
        fillColor: '#FF0000',
        strokeColor: '#FF0000',
        strokeOpacity: 0.6,
        strokeWeight: 2
      })
    }

    // Atualize a posição e a opacidade
    circleRef.current.setCenter(position)
    circleRef.current.setOptions({ fillOpacity: opacity })

    // Função para alternar a opacidade (criação do efeito piscante)
    const interval = setInterval(() => {
      setOpacity(prev => (prev === 0.4 ? 0.2 : 0.4)) // Altere entre dois valores de opacidade
    }, 500)

    return () => {
      clearInterval(interval)
      circleRef.current?.setMap(null) // Remova o círculo ao desmontar
      circleRef.current = null
    }
  }, [map, position, opacity])

  return null
}

export default MapRegisterComponent
