/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { Grid, Card, CardMedia, CardContent, Typography, Pagination, Box } from '@mui/material'
import { images, RealStateType } from 'src/requests/realStateRequest'
import BathtubOutlinedIcon from '@mui/icons-material/BathtubOutlined'
import HotelOutlinedIcon from '@mui/icons-material/HotelOutlined'
import { useItems } from 'src/context/ItemsContext'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'

// import { useRouter } from 'next/router'
import LoadingOverlay from 'src/components/GlobalLoading'
import { formatLabel } from '../MostedProperties'
import { format } from 'date-fns'

interface imageToPageType {
  id: string
  id_number: number
  title: string
  intention: string
  regionName: string
  value: number
  roomsNumber: number
  bathNumber: number
  status: string
  type: string
  subCategogory: string
  urlFirstImage?: string
  updateAt: string
  available: string
}

const MostedItems = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [currentItems, setCurrentItems] = useState<imageToPageType[]>([])

  const itemsPerPage = 8 // Define o número de itens por página, ajuste conforme necessário.
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const { itemsMosted, loading } = useItems()

  const buildImageUrl = (imagePath: string) => {
    const { protocol, hostname } = window.location

    const baseUrl = `${protocol}//${hostname}`

    // const baseUrl = `https://atlamproperties.com`

    return `${baseUrl}/uploads/${imagePath}`
  }

  function verifyFavoriteImage(data: images[]) {
    const index = data.findIndex(imagem => imagem.url.startsWith('1-'))

    return index !== -1 ? index : 0
  }

  const formatImagesToPage = (data: RealStateType[]) => {
    if (data) {
      const dataReturn: imageToPageType[] = data.map(item => {
        return {
          id: item.id,
          roomsNumber: item.roomsNumber,
          id_number: item.id_number,
          intention: item.intentionStatus,
          bathNumber: item.bathNumber,
          regionName: item.region,
          title: item.name,
          value: item.mensalRent,
          type: item.type,
          subCategogory: item.subIntentionStatus,
          urlFirstImage: item.images?.length
            ? buildImageUrl(item.images[verifyFavoriteImage(item.images)].url)
            : '/images/malta2.JPG',
          status: item.status,
          available: item.availabilityDate,
          updateAt: item.updated_at
        }
      })

      return dataReturn
    }

    return []
  }

  const handleColorOptions = (intention: string) => {
    switch (intention) {
      case 'FOR_RENT':
        return '#25235D'
      case 'FOR_SALE':
        return '#8B181B'
      case 'COMMERCIAL':
        return '#CFB53C'
      default:
        return '#25235D'
    }
  }

  useEffect(() => {
    // Sempre que itemsMosted mudar, resetar a página para 1
    setCurrentPage(1)

    // Agora podemos aplicar o formato dos itens na página
    if (itemsMosted.length > 0) {
      const currentIt = formatImagesToPage(itemsMosted).slice(indexOfFirstItem, indexOfLastItem)
      setCurrentItems(currentIt)
    }
  }, [itemsMosted]) // Este useEffect agora depende apenas de itemsMosted
  const openNewTab = (id: string) => {
    window.open(`/acl/real-state-by-id/?id=${id}`, '_blank')
  }

  useEffect(() => {
    // Quando o currentPage mudar, também precisa atualizar os itens da página atual
    const currentIt = formatImagesToPage(itemsMosted).slice(indexOfFirstItem, indexOfLastItem)
    setCurrentItems(currentIt)
  }, [currentPage, itemsMosted]) // Agora estamos observando tanto o currentPage quanto itemsMosted

  // const router = useRouter()

  return (
    <>
      <Grid container spacing={3} sx={{ padding: '2rem' }}>
        {currentItems.map(property => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={property.id}>
            <Card
              sx={{ maxWidth: 445, boxShadow: 3, borderRadius: 2, height: '100%', cursor: 'pointer' }}
              onClick={() => {
                // setItemById(itemsMosted.find(item => item.id === property.id) ?? null)

                setTimeout(() => openNewTab(property.id), 500)
              }}
            >
              <Box sx={{ position: 'relative' }}>
                <Box
                  sx={{
                    position: 'absolute',
                    top: 8,
                    left: 8,
                    backgroundColor: handleColorOptions(property.intention),
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    zIndex: 1
                  }}
                >
                  {property.intention.replace('_', ' ').toUpperCase()}
                </Box>

                {property.subCategogory && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      backgroundColor: '#CFB53C',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      zIndex: 1
                    }}
                  >
                    {`${property.subCategogory.replace('_', ' ').toUpperCase()}`}
                  </Box>
                )}

                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    backgroundColor: '#25235D',
                    opacity: '0.8',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '19px',
                    fontWeight: 'bold',
                    zIndex: 1
                  }}
                >
                  {`€ ${property.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`}
                </Box>

                <CardMedia
                  component='img'
                  height='200'
                  image={property.urlFirstImage}
                  alt={property.title}
                  sx={{ objectFit: 'cover' }}
                />
              </Box>

              {/* Conteúdo do Card */}
              <CardContent>
                <Typography variant='h6' fontWeight='bold'>
                  {property.title}
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  {formatLabel(property.type)}
                </Typography>
                <Grid sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  {property.bathNumber !== 0 ? (
                    <Box sx={{ display: 'flex', gap: '0.4rem' }}>
                      <BathtubOutlinedIcon />
                      <Typography>{`${property.bathNumber} - Baths`}</Typography>
                    </Box>
                  ) : (
                    <></>
                  )}
                  {property.roomsNumber !== 0 ? (
                    <Box sx={{ display: 'flex', gap: '0.4rem' }}>
                      <HotelOutlinedIcon />
                      <Typography>{`${property.roomsNumber}${
                        property.roomsNumber > 1 ? ' - Beds' : ' - Bed'
                      }`}</Typography>
                    </Box>
                  ) : (
                    <></>
                  )}
                  {/* <Box sx={{ display: 'flex', gap: '0.4rem' }}>
                    <BathtubOutlinedIcon />
                    <Typography>{`${property.bathNumber} - Baths`}</Typography>
                  </Box>

                  <Box sx={{ display: 'flex', gap: '0.4rem' }}>
                    <HotelOutlinedIcon />
                    <Typography>{`${property.roomsNumber} - Beds`}</Typography>
                  </Box> */}
                </Grid>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CalendarMonthIcon />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <Typography>LAST UPDATE:</Typography>
                    {property && (
                      <Typography sx={{ fontWeight: 'bold' }}>
                        {format(new Date(property.updateAt ?? ''), 'dd/MM/yyyy')}
                      </Typography>
                    )}
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CalendarMonthIcon />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <Typography>AVAILABLE FROM:</Typography>
                    {property && (
                      <Typography sx={{ fontWeight: 'bold' }}>
                        {format(new Date(property.available ?? ''), 'dd/MM/yyyy')}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Pagination
        count={Math.ceil(formatImagesToPage(itemsMosted).length / itemsPerPage)}
        page={currentPage}
        onChange={(event, value) => {
          setCurrentPage(value)

          window.scrollTo({
            top: 350,
            behavior: 'smooth' // rolagem suave
          })
        }}
        color='primary'
        sx={{
          display: 'flex',
          justifyContent: 'center',
          mt: 2,
          '& .MuiPaginationItem-root': {
            color: 'white',
            backgroundColor: '#3a3954',
            '&.Mui-selected': {
              backgroundColor: '#110f49',
              color: 'white'
            },
            '&:hover': {
              backgroundColor: '#3c3b61'
            }
          }
        }}
      />
      <LoadingOverlay loading={loading} message='Loading informations' />
    </>
  )
}

export default MostedItems
