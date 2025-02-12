import { useState } from 'react'
import { Box, IconButton } from '@mui/material'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import { useSwipeable } from 'react-swipeable'

interface CarouselProps {
  images: string[]
}

const CarouselComponent: React.FC<CarouselProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % images.length)
  }

  const handlePrev = () => {
    setCurrentIndex(prev => (prev - 1 + images.length) % images.length)
  }

  const handlers = useSwipeable({
    onSwipedLeft: handleNext,
    onSwipedRight: handlePrev
  })

  return (
    <Box
      {...handlers}
      sx={{
        position: 'relative',
        width: '100%',
        maxWidth: 600,
        height: 'auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 'auto',
        overflow: 'hidden',
        borderRadius: 2
      }}
    >
      {images && (
        <img
          src={images[currentIndex]}
          alt={`Slide ${currentIndex + 1}`}
          style={{
            width: '100%',
            height: '100%',
            maxHeight: 400,
            objectFit: 'contain' // Mantém a proporção e evita cortes
          }}
        />
      )}

      <IconButton
        onClick={handlePrev}
        sx={{
          position: 'absolute',
          top: '50%',
          left: 10,
          transform: 'translateY(-50%)',
          color: '#fff',
          backgroundColor: 'rgba(0,0,0,0.5)',
          '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' }
        }}
      >
        <ArrowBackIosNewIcon />
      </IconButton>

      <IconButton
        onClick={handleNext}
        sx={{
          position: 'absolute',
          top: '50%',
          right: 10,
          transform: 'translateY(-50%)',
          color: '#fff',
          backgroundColor: 'rgba(0,0,0,0.5)',
          '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' }
        }}
      >
        <ArrowForwardIosIcon />
      </IconButton>
    </Box>
  )
}

export default CarouselComponent
