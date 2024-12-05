import { APIProvider, Map, AdvancedMarker, MapCameraChangedEvent, useMap, Pin } from '@vis.gl/react-google-maps'
import { MarkerClusterer } from '@googlemaps/markerclusterer'
import type { Marker } from '@googlemaps/markerclusterer'
import { useState, useRef, useEffect, useCallback } from 'react'
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

  const { fetchAllPointers } = useMapRegister()

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
  }, [id])

  return (
    <APIProvider apiKey={'AIzaSyCmfoau07h6vt9oISxmC9TEnzb0rbyzFzE'} onLoad={() => console.log('Maps API has loaded.')}>
      <Map
        defaultZoom={13}
        defaultCenter={{ lat: 35.8997, lng: 14.5147 }}
        mapId='528e9d7e1a87a78f'
        onCameraChanged={(ev: MapCameraChangedEvent) =>
          console.log('camera changed:', ev.detail.center, 'zoom:', ev.detail.zoom)
        }
      >
        <PoiMarkers pois={locations} />
        <UserMarkers data={dataRealStateByid} />
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
  }, [])

  return (
    <>
      {props.pois.map((poi: Poi) => (
        <AdvancedMarker
          key={poi.key}
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
}

const UserMarkers = ({ data }: UserMarkersProps) => {
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
  }
  useEffect(() => {
    if (data) {
      setUserMarker({ lat: data.lat, lng: data.lng })
      setNewPoint({ lat: data.lat, lng: data.lng })
    }
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

export default MapRegisterComponent
