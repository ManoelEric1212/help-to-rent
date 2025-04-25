import { Box, Button, Card, Grid, Typography } from '@mui/material'
import { useState, useEffect } from 'react'
import MapRegisterComponentElement from 'src/components/MapPointComponent'
import { iconsAdditional } from 'src/pages/real-state/real-state-by-id'

import { getRealStateById, RealStateType } from 'src/requests/realStateRequest'
import { FormatRealStateToForm } from 'src/utils/format-real-state-to-form'

import HomeIcon from '@mui/icons-material/Home'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import AcUnitIcon from '@mui/icons-material/AcUnit'
import PoolIcon from '@mui/icons-material/Pool'
import BathtubIcon from '@mui/icons-material/Bathtub'
import HotTubIcon from '@mui/icons-material/HotTub'
import BalconyIcon from '@mui/icons-material/Balcony'
import GarageIcon from '@mui/icons-material/Garage'
import PetsIcon from '@mui/icons-material/Pets'
import ElevatorIcon from '@mui/icons-material/Elevator'
import YardIcon from '@mui/icons-material/Yard'
import SingleBedIcon from '@mui/icons-material/SingleBed'
import RoofingIcon from '@mui/icons-material/Roofing'
import LocalDrinkOutlinedIcon from '@mui/icons-material/LocalDrinkOutlined'
import LocalLaundryServiceOutlinedIcon from '@mui/icons-material/LocalLaundryServiceOutlined'
import HouseboatOutlinedIcon from '@mui/icons-material/HouseboatOutlined'
import SurfingOutlinedIcon from '@mui/icons-material/SurfingOutlined'

import CarouselComponent from './carroussel'
import { useRouter } from 'next/router'
import { shareToWhatsAppNumber } from 'src/@core/components/WhatssAppComponent'
import ButtonRequest from './modalWhats'

const DetailsRealStateComponent = () => {
  // const router = useRouter()
  const [hasFetched, setHasFetched] = useState(false)

  const [previews, setPreviews] = useState<string[]>([])
  const [realStateById, setRealStateById] = useState<RealStateType | null>(null)
  const router = useRouter()

  const { id } = router.query

  const buildImageUrl = (imagePath: string) => {
    const { protocol, hostname } = window.location

    // development
    // const baseUrl = `${protocol}//${hostname}${`:${5000}`}`
    const baseUrl = `${protocol}//${hostname}`

    // const baseUrl = `https://atlamproperties.com`

    return `${baseUrl}/uploads/${imagePath}`
  }

  function formatLabel(label: string) {
    return label
      .toLowerCase() // transforma tudo em minúsculas
      .replace(/(?:^|_)([a-z])/g, (match, p1, offset) => (offset === 0 ? p1.toUpperCase() : ' ' + p1.toUpperCase()))
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
    if (id && !hasFetched) {
      setHasFetched(true)
      getRealStateByIdReq(id as string)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, hasFetched, getRealStateByIdReq])

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
      },
      {
        label: 'Lift',
        has: data?.hasLift ? JSON.parse(data?.hasLift ?? '').has : '',
        observation: data?.hasLift ? JSON.parse(data?.hasLift ?? '').observation : '',
        icon: <ElevatorIcon />
      },
      {
        label: 'Garden',
        has: JSON.parse(data?.hasGarden ?? '').has,
        observation: JSON.parse(data?.hasGarden ?? '').observation,
        icon: <YardIcon />
      },
      {
        label: 'Unfurnished',
        has: JSON.parse(data?.hasUnfurnished ?? '').has,
        observation: JSON.parse(data?.hasUnfurnished ?? '').observation,
        icon: <SingleBedIcon />
      },
      {
        label: 'Yard',
        has: JSON.parse(data?.hasYard ?? '').has,
        observation: JSON.parse(data?.hasYard ?? '').observation,
        icon: <YardIcon />
      },
      {
        label: 'Use of Roof',
        has: JSON.parse(data?.hasUse_of_Roof ?? '').has,
        observation: JSON.parse(data?.hasUse_of_Roof ?? '').observation,
        icon: <RoofingIcon />
      },
      {
        label: 'DishWasher',
        has: JSON.parse(data?.hasDishWasher ?? '').has,
        observation: JSON.parse(data?.hasDishWasher ?? '').observation,
        icon: <LocalDrinkOutlinedIcon />
      },
      {
        label: 'Washing Machine',
        has: JSON.parse(data?.hasWashingMachine ?? '').has,
        observation: JSON.parse(data?.hasWashingMachine ?? '').observation,
        icon: <LocalLaundryServiceOutlinedIcon />
      },
      {
        label: 'Tumble Dryer',
        has: JSON.parse(data?.hasTumbleDryer ?? '').has,
        observation: JSON.parse(data?.hasTumbleDryer ?? '').observation,
        icon: <LocalLaundryServiceOutlinedIcon />
      },
      {
        label: 'Seafront',
        has: JSON.parse(data?.hasSeafront ?? '').has,
        observation: JSON.parse(data?.hasSeafront ?? '').observation,
        icon: <HouseboatOutlinedIcon />
      },
      {
        label: 'Seaview',
        has: JSON.parse(data?.hasSeaview ?? '').has,
        observation: JSON.parse(data?.hasSeaview ?? '').observation,
        icon: <SurfingOutlinedIcon />
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

              {realStateById?.intentionStatus === 'FOR_RENT' ? (
                <Typography>
                  {`${realStateById?.roomsNumber} - Bedroom ${formatLabel(realStateById?.type ?? '')} ${formatLabel(
                    realStateById?.intentionStatus ?? ''
                  )} in ${realStateById?.region} - € ${realStateById?.mensalRent}`}
                </Typography>
              ) : (
                <Typography>
                  {`${realStateById?.roomsNumber} - Bedroom ${formatLabel(realStateById?.type ?? '')} ${formatLabel(
                    realStateById?.intentionStatus ?? ''
                  )} in ${realStateById?.region} - € ${realStateById?.mensalRent}`}
                </Typography>
              )}
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
              {/* <Grid item xs={12} sm='auto'>
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
              </Grid> */}

              {/* <Grid item xs={12} sm='auto'>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CalendarMonthIcon fontSize='large' />
                  <Box>
                    <Typography>UPDATED ON</Typography>
                    {realStateById && (
                      <Typography>{format(new Date(realStateById?.updated_at ?? ''), 'dd/MM/yyyy HH:mm')}</Typography>
                    )}
                  </Box>
                </Box>
              </Grid> */}
            </Grid>

            <Box sx={{ padding: '2.5rem' }}>{previews.length && <CarouselComponent images={previews} />}</Box>
            <Box sx={{ padding: '1rem' }}>
              <Box sx={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Typography sx={{ fontSize: '1.5rem', fontWeight: 'bold' }}>ID:</Typography>
                <Box>
                  <Typography>{String(realStateById?.id_number).padStart(3, '0')}</Typography>
                </Box>
              </Box>
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
                {realStateById && (
                  <Box
                    sx={{
                      display: 'flex',
                      gap: '0.5rem',
                      alignItems: 'center' // Centraliza ícone e texto
                    }}
                  ></Box>
                )}
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
              <Button
                variant='contained'
                startIcon={<WhatsAppIcon />}
                onClick={() => {
                  const phoneNumber = '35699321008'
                  const message = encodeURIComponent('Hello ! I need more informations about Atlam Properties...')
                  shareToWhatsAppNumber(phoneNumber, message)
                }}
              >
                Check details with Atlam Malta
              </Button>
              {realStateById ? (
                <ButtonRequest
                  id={String(realStateById?.id_number)}
                  link={`https://atlamproperties.com/acl/real-state-by-id/?id=${realStateById.id}`}
                />
              ) : (
                <></>
              )}
            </Box>
            {/* <Box>{realStateById ? <MapRegisterComponentElement dataRealStateByid={realStateById} /> : <></>}</Box> */}

            <Box sx={{ width: '100%', height: '60vh' }}>
              {realStateById ? (
                <MapRegisterComponentElement dataRealStateByid={realStateById} mostAddres={false} />
              ) : (
                <></>
              )}
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
