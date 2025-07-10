/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { Grid, Card, CardMedia, CardContent, Typography, Box, Pagination } from '@mui/material'
import { getFilteredRealStates, images, RealStateType } from 'src/requests/realStateRequest'
import BathtubOutlinedIcon from '@mui/icons-material/BathtubOutlined'
import HotelOutlinedIcon from '@mui/icons-material/HotelOutlined'
import { filtersT, useItems } from 'src/context/ItemsContext'

// import { useRouter } from 'next/router'
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

export function formatLabel(label: string) {
  const formatted = label
    .toLowerCase()
    .replace(/(?:^|_)([a-z])/g, (match, p1, offset) => (offset === 0 ? p1.toUpperCase() : ' ' + p1.toUpperCase()))

  const words = formatted.split(' ')
  const uniqueWords = words.filter((word, index) => words.indexOf(word) === index)

  return uniqueWords.join(' ')
}

const MostedItems2 = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [currentItems, setCurrentItems] = useState<imageToPageType[]>([])

  const itemsPerPage = 12 // Define o número de itens por página, ajuste conforme necessário.
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const { itemsMosted2, loading, setLoading, filters, setFilters } = useItems()

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

  const { setItemsMosted2 } = useItems()

  async function fetchRealStates(data: filtersT) {
    setLoading(true)
    try {
      const realStates = await getFilteredRealStates({
        region: data.region,
        area_region: data.area_region,
        intentionStatus: data.intentionStatus,
        subIntentionStatus: data.subIntentionStatus,
        minPrice: data.minPrice,
        maxPrice: data.maxPrice,
        type: data.type,
        roomsNumber: data.roomsNumber
      })
      setLoading(false)

      return realStates
    } catch (error) {
      setLoading(false)

      console.error(error)
    }
  }

  async function getRealStates(filters: filtersT) {
    setLoading(true)
    try {
      const data = await fetchRealStates(filters)
      if (data) {
        const imoveisOrdenados = data.sort(
          (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        )
        console.log('data222', data)
        setItemsMosted2(imoveisOrdenados ?? [])
        setLoading(false)
        setFilters({})
      }
      setLoading(false)
      setFilters({})
    } catch (error) {
      setLoading(false)
      setFilters({})

      console.warn(error)
    }
  }
  useEffect(() => {
    setTimeout(() => {
      if (filters) {
        getRealStates(filters)
      }
      if (filters === null) {
        getRealStates({})
      }
    }, 300)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
    const currentIt = formatImagesToPage(itemsMosted2).slice(indexOfFirstItem, indexOfLastItem)

    setCurrentItems(currentIt)
  }, [currentPage, itemsMosted2])

  // const { setItemById } = useItems()
  const openNewTab = (id: string) => {
    window.open(`/acl/real-state-by-id/?id=${id}`, '_blank')
  }

  // const router = useRouter()

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

                  {property.subCategogory && property.intention === 'FOR_RENT' && (
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
                  <Typography variant='body2' color='text.secondary' sx={{ fontSize: '0.85rem' }}>
                    {formatLabel(property.type)}
                  </Typography>
                  <Grid sx={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    {property.bathNumber !== 0 ? (
                      <Box sx={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                        <BathtubOutlinedIcon />
                        <Typography>{`${property.bathNumber} - Baths`}</Typography>
                      </Box>
                    ) : (
                      <></>
                    )}
                    {property.roomsNumber !== 0 ? (
                      <Box sx={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                        <HotelOutlinedIcon />
                        <Typography>{`${property.roomsNumber}${
                          property.roomsNumber > 1 ? ' - Beds' : ' - Bed'
                        }`}</Typography>
                      </Box>
                    ) : (
                      <></>
                    )}
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
          onChange={(event, value) => {
            setCurrentPage(value)
            window.scrollTo({
              top: 0,
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
      ) : (
        <></>
      )}
      <LoadingOverlay loading={loading} message='Loading informations' />
    </>
  )
}

export default MostedItems2
