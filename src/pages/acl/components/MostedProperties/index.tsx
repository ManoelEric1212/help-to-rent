/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { Grid, Card, CardMedia, CardContent, Typography, Pagination, Box } from '@mui/material'
import { RealStateType } from 'src/requests/realStateRequest'
import BathtubOutlinedIcon from '@mui/icons-material/BathtubOutlined'
import HotelOutlinedIcon from '@mui/icons-material/HotelOutlined'
import { useItems } from 'src/context/ItemsContext'
import { useRouter } from 'next/router'
import DoNotDisturbIcon from '@mui/icons-material/DoNotDisturb'
import SearchProperties from '../searchProperties/searchProps'
import LoadingOverlay from 'src/components/GlobalLoading'

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
}

const MostedItems2 = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [currentItems, setCurrentItems] = useState<imageToPageType[]>([])

  const itemsPerPage = 15 // Define o número de itens por página, ajuste conforme necessário.
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const { itemsMosted2, loading } = useItems()

  const buildImageUrl = (imagePath: string) => {
    const { protocol, hostname } = window.location
    const baseUrl = `${protocol}//${hostname}`

    return `${baseUrl}/uploads/${imagePath}`
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
          urlFirstImage: item.images?.length ? buildImageUrl(item.images[0].url) : '/images/malta2.JPG',
          status: item.status
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
    if (itemsMosted2.length > 0) {
      const currentIt = formatImagesToPage(itemsMosted2).slice(indexOfFirstItem, indexOfLastItem)
      setCurrentItems(currentIt)
    }
  }, [itemsMosted2]) // Este useEffect agora depende apenas de itemsMosted

  useEffect(() => {
    // Quando o currentPage mudar, também precisa atualizar os itens da página atual
    const currentIt = formatImagesToPage(itemsMosted2).slice(indexOfFirstItem, indexOfLastItem)
    setCurrentItems(currentIt)
  }, [currentPage, itemsMosted2])

  // const { setItemById } = useItems()

  const router = useRouter()

  return (
    <>
      <Box sx={{ padding: '0.9rem 2rem 0.4rem 2rem' }}>
        <SearchProperties />
      </Box>
      {itemsMosted2.length ? (
        <Grid container spacing={3} sx={{ padding: '2rem' }}>
          {currentItems.map(property => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={property.id}>
              <Card
                sx={{ maxWidth: 445, boxShadow: 3, borderRadius: 2, height: '100%', cursor: 'pointer' }}
                onClick={() => {
                  // setItemById(itemsMosted2.find(item => item.id === property.id) ?? null)
                  setTimeout(() => router.replace(`/acl/real-state-by-id/?id=${property.id}`), 500)
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

                  {property.subCategogory && property.intention === 'FOR_RENT' && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        backgroundColor: '#636052',
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
                    {`€ ${property.value}`}
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
                    {property.type}
                  </Typography>
                  <Grid sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', gap: '0.4rem' }}>
                      <BathtubOutlinedIcon />
                      <Typography>{`${property.bathNumber} - Baths`}</Typography>
                    </Box>

                    <Box sx={{ display: 'flex', gap: '0.4rem' }}>
                      <HotelOutlinedIcon />
                      <Typography>{`${property.roomsNumber} - Beds`}</Typography>
                    </Box>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box sx={{ display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'center' }}>
          <DoNotDisturbIcon fontSize='large' />
          <h3>Not found items !!</h3>
        </Box>
      )}

      {itemsMosted2.length ? (
        <Pagination
          count={Math.ceil(formatImagesToPage(itemsMosted2).length / itemsPerPage)}
          page={currentPage}
          onChange={(event, value) => setCurrentPage(value)}
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
      ) : (
        <></>
      )}
      <LoadingOverlay loading={loading} message='Loading informations' />
    </>
  )
}

export default MostedItems2
