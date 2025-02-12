import { Box, Button, Card, Grid, Typography } from '@mui/material'
import { useState, useEffect } from 'react'
import MapRegisterComponentElement from 'src/components/MapPointComponent'
import { iconsAdditional } from 'src/pages/real-state/real-state-by-id'

import { getRealStateById, RealStateType } from 'src/requests/realStateRequest'
import { FormatRealStateToForm } from 'src/utils/format-real-state-to-form'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'

import HomeIcon from '@mui/icons-material/Home'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import ShareIcon from '@mui/icons-material/Share'
import AcUnitIcon from '@mui/icons-material/AcUnit'
import PoolIcon from '@mui/icons-material/Pool'
import BathtubIcon from '@mui/icons-material/Bathtub'
import HotTubIcon from '@mui/icons-material/HotTub'
import BalconyIcon from '@mui/icons-material/Balcony'
import GarageIcon from '@mui/icons-material/Garage'
import PetsIcon from '@mui/icons-material/Pets'

import { format } from 'date-fns'
import CarouselComponent from './carroussel'

interface DetailsRealStateComponentProps {
  data: RealStateType | null
}

const DetailsRealStateComponent = ({ data }: DetailsRealStateComponentProps) => {
  // const router = useRouter()
  const [hasFetched, setHasFetched] = useState(false)

  const [previews, setPreviews] = useState<string[]>([])
  const [realStateById, setRealStateById] = useState<RealStateType | null>(null)

  const buildImageUrl = (imagePath: string) => {
    const { protocol, hostname } = window.location

    // development
    // const baseUrl = `${protocol}//${hostname}${`:${5000}`}`
    const baseUrl = `${protocol}//${hostname}`

    // const baseUrl = `https://atlammalta.com`

    return `${baseUrl}/uploads/${imagePath}`
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getRealStateByIdReq = async (idToData: string) => {
    try {
      const realStateById = await getRealStateById(idToData)
      const dataFormatted = FormatRealStateToForm(realStateById)

      setRealStateById(realStateById)
      if (dataFormatted.images.length) {
        setPreviews(dataFormatted.images.map(item => buildImageUrl(item.url)))
        console.log(
          'dataFormatted.images.map(item => buildImageUrl(item.url))',
          dataFormatted.images.map(item => buildImageUrl(item.url))
        )
      }
    } catch (error) {
      throw new Error('Error getRealStateById')
    }
  }

  useEffect(() => {
    if (data && !hasFetched) {
      setHasFetched(true)
      getRealStateByIdReq(data.id as string)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, hasFetched])

  const formatAdditionalItems = (data: RealStateType | null) => {
    const returnData: iconsAdditional[] = [
      {
        label: 'Balcony',
        has: JSON.parse(data?.hasBalcony ?? '').has,
        observation: JSON.parse(data?.hasBalcony ?? '').observation,
        icon: <HotTubIcon />
      },
      {
        label: 'Air Conditioner',
        has: JSON.parse(data?.hasAirConditioner ?? '').has,
        observation: JSON.parse(data?.hasAirConditioner ?? '').observation,
        icon: <AcUnitIcon />
      },
      {
        label: 'Pool',
        has: JSON.parse(data?.hasPool ?? '').has,
        observation: JSON.parse(data?.hasPool ?? '').observation,
        icon: <PoolIcon />
      },
      {
        label: 'Jacuzzi',
        has: JSON.parse(data?.hasJacuzzi ?? '').has,
        observation: JSON.parse(data?.hasJacuzzi ?? '').observation,
        icon: <BathtubIcon />
      },
      {
        label: 'Terrace',
        has: JSON.parse(data?.hasTerrace ?? '').has,
        observation: JSON.parse(data?.hasTerrace ?? '').observation,
        icon: <BalconyIcon />
      },
      {
        label: 'Garage',
        has: JSON.parse(data?.hasGarage ?? '').has,
        observation: JSON.parse(data?.hasGarage ?? '').observation,
        icon: <GarageIcon />
      },
      {
        label: 'Acept Pets',
        has: JSON.parse(data?.petAccepts ?? '').has,
        observation: JSON.parse(data?.hasGarage ?? '').observation,
        icon: <PetsIcon />
      }
    ]

    return returnData
  }

  return (
    <>
      <Grid
        container
        spacing={6}
        sx={{
          flexDirection: { xs: 'column', sm: 'row' },
          marginTop: '6rem' // Muda para coluna em telas pequenas
        }}
      >
        {/* Primeiro Card */}
        <Grid item xs={12} sm={8}>
          <Card>
            <Box
              sx={{
                display: 'flex',
                gap: '1rem',
                padding: '1rem',
                alignItems: 'center',
                flexDirection: { xs: 'column', sm: 'row' }, // Ajusta o layout interno
                textAlign: { xs: 'center', sm: 'left' } // Centraliza em telas menores
              }}
            >
              <HomeIcon />
              <Typography>{`${realStateById?.roomsNumber} - Bedroom ${realStateById?.type} for ${realStateById?.intentionStatus} in ${realStateById?.region} - € ${realStateById?.mensalRent}`}</Typography>
            </Box>

            <Grid
              container
              spacing={2}
              sx={{
                padding: '1rem',
                alignItems: 'center',
                justifyContent: { xs: 'center', sm: 'space-between' },
                textAlign: { xs: 'center', sm: 'left' }
              }}
            >
              <Grid item xs={12} sm='auto'>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CalendarMonthIcon fontSize='large' />
                  <Box>
                    <Typography>AVAILABLE FROM</Typography>
                    {realStateById && (
                      <Typography>
                        {format(new Date(realStateById?.availabilityDate ?? ''), 'dd/MM/yyyy HH:mm')}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} sm='auto'>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CalendarMonthIcon fontSize='large' />
                  <Box>
                    <Typography>UPDATED ON</Typography>
                    {realStateById && (
                      <Typography>{format(new Date(realStateById?.updated_at ?? ''), 'dd/MM/yyyy HH:mm')}</Typography>
                    )}
                  </Box>
                </Box>
              </Grid>
            </Grid>

            <Box sx={{ padding: '2.5rem' }}>{previews.length && <CarouselComponent images={previews} />}</Box>
            <Box sx={{ padding: '1rem' }}>
              <Typography sx={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Additional items:</Typography>
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  flexDirection: { xs: 'column', sm: 'row' }, // Coluna em telas pequenas e linha em telas maiores
                  alignItems: 'flex-start' // Alinhamento para manter consistência
                }}
              >
                {realStateById &&
                  formatAdditionalItems(realStateById)
                    .filter(item => item.has === true)
                    .map((item, i) => (
                      <Box
                        key={i}
                        sx={{
                          display: 'flex',
                          gap: '0.5rem',
                          alignItems: 'center' // Centraliza ícone e texto
                        }}
                      >
                        {item.icon}
                        <Typography>{item.label}</Typography>
                      </Box>
                    ))}
              </Box>
            </Box>
          </Card>
        </Grid>

        {/* Segundo Card */}
        <Grid item xs={12} sm={4}>
          <Box
            sx={{
              display: 'flex',
              gap: '1rem',
              padding: '1rem',
              alignItems: 'center',
              flexDirection: 'column',
              textAlign: { xs: 'center', sm: 'left' }
            }}
          >
            <Box
              sx={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', alignContent: 'center', width: '100%' }}
            >
              <Button variant='contained' startIcon={<WhatsAppIcon />}>
                Check details with Owner
              </Button>
              <Button variant='contained' startIcon={<ShareIcon />}>
                Share with Client
              </Button>
            </Box>
            {/* <Box>{realStateById ? <MapRegisterComponentElement dataRealStateByid={realStateById} /> : <></>}</Box> */}

            <Box sx={{ width: '100%', height: '60vh' }}>
              {realStateById ? <MapRegisterComponentElement dataRealStateByid={realStateById} /> : <></>}
            </Box>
            <Typography></Typography>
          </Box>
        </Grid>
      </Grid>
      <Grid>
        <Card sx={{ padding: '1rem' }}>
          <Box>
            <Typography sx={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Description</Typography>
            <Typography sx={{ marginTop: '0.6rem' }}>{realStateById?.description}</Typography>
          </Box>
        </Card>
      </Grid>
    </>
  )
}
export default DetailsRealStateComponent
