import { useState, useEffect, useCallback } from 'react'
import { Box, IconButton, Modal } from '@mui/material'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import { useSwipeable } from 'react-swipeable'

interface CarouselProps {
  images: string[]
}

const CarouselComponent: React.FC<CarouselProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const handleNext = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % images.length)
  }, [images])

  const handlePrev = useCallback(() => {
    setCurrentIndex(prev => (prev - 1 + images.length) % images.length)
  }, [images])

  const handlers = useSwipeable({
    onSwipedLeft: handleNext,
    onSwipedRight: handlePrev
  })

  // Atalhos de teclado no modo fullscreen
  useEffect(() => {
    if (!isFullscreen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext()
      if (e.key === 'ArrowLeft') handlePrev()
      if (e.key === 'Escape') setIsFullscreen(false)
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isFullscreen, handleNext, handlePrev])

  return (
    <>
      <Box
        {...handlers}
        sx={{
          position: 'relative',
          width: '100%',
          maxWidth: 600,
          height: 'auto',
          display: 'flex',
          background: '#cecece',
          alignItems: 'center',
          justifyContent: 'center',
          margin: 'auto',
          overflow: 'hidden',
          borderRadius: 2,
          cursor: 'pointer'
        }}
        onClick={() => setIsFullscreen(true)}
      >
        {images && (
          <img
            src={images[currentIndex]}
            alt={`Slide ${currentIndex + 1}`}
            style={{
              width: '100%',
              height: '100%',
              maxHeight: 400,
              objectFit: 'contain'
            }}
          />
        )}

        <IconButton
          onClick={e => {
            e.stopPropagation()
            handlePrev()
          }}
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
          onClick={e => {
            e.stopPropagation()
            handleNext()
          }}
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

      {/* Modal Fullscreen */}
      <Modal open={isFullscreen} onClose={() => setIsFullscreen(false)}>
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'black',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            outline: 'none'
          }}
          onClick={() => setIsFullscreen(false)}
        >
          {images ? (
            <>
              <img
                src={images[currentIndex]}
                alt={`Fullscreen ${currentIndex + 1}`}
                style={{
                  maxWidth: '100%',
                  maxHeight: '80vh',
                  objectFit: 'contain'
                }}
                onClick={e => e.stopPropagation()}
              />

              <IconButton
                onClick={e => {
                  e.stopPropagation()
                  handlePrev()
                }}
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: 20,
                  transform: 'translateY(-50%)',
                  color: '#fff',
                  backgroundColor: 'rgba(0,0,0,0.4)',
                  '&:hover': { backgroundColor: 'rgba(0,0,0,0.6)' }
                }}
              >
                <ArrowBackIosNewIcon />
              </IconButton>

              <IconButton
                onClick={e => {
                  e.stopPropagation()
                  handleNext()
                }}
                sx={{
                  position: 'absolute',
                  top: '50%',
                  right: 20,
                  transform: 'translateY(-50%)',
                  color: '#fff',
                  backgroundColor: 'rgba(0,0,0,0.4)',
                  '&:hover': { backgroundColor: 'rgba(0,0,0,0.6)' }
                }}
              >
                <ArrowForwardIosIcon />
              </IconButton>
            </>
          ) : (
            <></>
          )}
        </Box>
      </Modal>
    </>
  )
}

export default CarouselComponent
