import React, { useEffect, useState } from 'react'
import { Grid, Card, CardMedia, CardContent, Typography, Pagination, Box } from '@mui/material'
import { RealStateType } from 'src/requests/realStateRequest'
import BathtubOutlinedIcon from '@mui/icons-material/BathtubOutlined'
import HotelOutlinedIcon from '@mui/icons-material/HotelOutlined'
import { useItems } from 'src/context/ItemsContext'
import { useRouter } from 'next/router'

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
  urlFirstImage?: string
}

const itemsPerPage = 8 // Número de imóveis por página

const MostedItems = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [currentItems, setCurrentItems] = useState<imageToPageType[]>([])

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const { itemsMosted } = useItems()

  const buildImageUrl = (imagePath: string) => {
    const { protocol, hostname } = window.location

    // development
    // const baseUrl = `${protocol}//${hostname}${`:${5000}`}`
    const baseUrl = `${protocol}//${hostname}`

    // const baseUrl = `https://atlammalta.com`

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
          urlFirstImage: item.images?.length ? buildImageUrl(item.images[0].url) : '/images/malta2.JPG',
          status: item.status
        }
      })

      return dataReturn
    }

    return []
  }

  useEffect(() => {
    if (itemsMosted.length > 8) {
      const currentIt = formatImagesToPage(itemsMosted ?? []).slice(indexOfFirstItem, indexOfLastItem)
      setCurrentItems(currentIt)
    } else {
      formatImagesToPage(itemsMosted ?? [])
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemsMosted, currentPage])
  const { setItemById } = useItems()

  const router = useRouter()

  return (
    <>
      <Grid container spacing={3} sx={{ padding: '2rem' }}>
        {currentItems.map(property => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={property.id}>
            <Card
              sx={{ maxWidth: 445, boxShadow: 3, borderRadius: 2, height: '100%', cursor: 'pointer' }}
              onClick={() => {
                setItemById(itemsMosted.find(item => item.id === property.id) ?? null)
                setTimeout(() => router.replace('/acl/real-state-by-id'), 500)
              }}
            >
              <Box sx={{ position: 'relative' }}>
                <Box
                  sx={{
                    position: 'absolute',
                    top: 8,
                    left: 8,
                    backgroundColor: '#25235D',
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

                {property.status !== 'AVAILABLE' && (
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
                    {`Property has been ${property.status.toLowerCase()}`}
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

      <Pagination
        count={Math.ceil(formatImagesToPage(itemsMosted).length / itemsPerPage)}
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
    </>
  )
}

export default MostedItems
