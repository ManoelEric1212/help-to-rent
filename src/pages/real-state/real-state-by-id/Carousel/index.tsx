import React, { useState, useEffect, useRef } from 'react'
import { Box, Modal, IconButton } from '@mui/material'
import Slider from 'react-slick'
import CloseIcon from '@mui/icons-material/Close'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'

type CarouselProps = {
  images: string[]
}

const ImageCarousel: React.FC<CarouselProps> = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState<number>(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const sliderRef = useRef<Slider>(null)

  const thumbnailSettings = {
    infinite: true,
    slidesToShow: Math.min(images?.length, 5),
    slidesToScroll: 1,
    focusOnSelect: true
  }

  const fullscreenSettings = {
    infinite: true,
    initialSlide: selectedImage,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false, // desativa setas padrão
    afterChange: (index: number) => setSelectedImage(index)
  }

  // Controle de teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isFullscreen) return
      if (e.key === 'Escape') {
        setIsFullscreen(false)
      } else if (e.key === 'ArrowRight' || e.key === 'Enter') {
        sliderRef.current?.slickNext()
      } else if (e.key === 'ArrowLeft') {
        sliderRef.current?.slickPrev()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isFullscreen])

  return (
    <>
      {Array.isArray(images) && images.length > 0 && (
        <Box>
          {/* Imagem principal */}
          <Box
            onClick={() => setIsFullscreen(true)}
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

              // display: 'flex',
              // justifyContent: 'center',
              // alignItems: 'center',
              // background: '#cecece',
              // mb: 2,
              // width: '100%',
              // height: 300,
              // overflow: 'hidden',
              // borderRadius: 2,
              // boxShadow: 3,
              // cursor: 'zoom-in'
            }}
          >
            <img
              src={images[selectedImage]}
              alt={`Selected ${selectedImage}`}
              style={{
                maxWidth: '90%',
                height: '100%',
                maxHeight: 400,
                objectFit: 'contain'
              }}
            />
          </Box>

          {/* Miniaturas */}
          <Slider {...thumbnailSettings} beforeChange={(_, next) => setSelectedImage(next)}>
            {images?.map((image, index) => (
              <Box
                key={index}
                onClick={() => setSelectedImage(index)}
                sx={{
                  p: 1,
                  cursor: 'pointer',
                  border: selectedImage === index ? '2px solid #1976d2' : 'none',
                  borderRadius: 2,
                  width: `${Math.min(100 / images?.length, 20)}%`,
                  maxWidth: '120px',
                  minWidth: '60px'
                }}
              >
                <img
                  src={image}
                  alt={`Thumbnail ${index}`}
                  style={{
                    width: '100%',
                    height: '100px',
                    objectFit: 'cover',
                    borderRadius: '4px'
                  }}
                />
              </Box>
            ))}
          </Slider>

          {/* Modal com carrossel fullscreen */}
          <Modal open={isFullscreen} onClose={() => setIsFullscreen(false)}>
            <Box
              tabIndex={0}
              sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                backgroundColor: 'rgba(0,0,0,0.95)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                p: 4
              }}
            >
              {/* Botão fechar */}
              <IconButton
                onClick={() => setIsFullscreen(false)}
                sx={{ color: 'white', position: 'absolute', top: 20, right: 20 }}
              >
                <CloseIcon fontSize='large' />
              </IconButton>

              {/* Botões navegação */}
              <IconButton
                onClick={() => sliderRef.current?.slickPrev()}
                sx={{ color: 'white', position: 'absolute', left: 30 }}
              >
                <ArrowBackIosNewIcon fontSize='large' />
              </IconButton>

              <IconButton
                onClick={() => sliderRef.current?.slickNext()}
                sx={{ color: 'white', position: 'absolute', right: 30 }}
              >
                <ArrowForwardIosIcon fontSize='large' />
              </IconButton>

              {/* Slider principal */}
              <Box sx={{ width: '80%', maxWidth: '800px' }}>
                <Slider {...fullscreenSettings} ref={sliderRef}>
                  {images?.map((image, index) => (
                    <Box key={index} sx={{ display: 'flex', justifyContent: 'center' }}>
                      <img
                        src={image}
                        alt={`Fullscreen ${index}`}
                        style={{
                          maxWidth: '100%',
                          maxHeight: '80vh',
                          objectFit: 'contain'
                        }}
                      />
                    </Box>
                  ))}
                </Slider>
              </Box>
            </Box>
          </Modal>
        </Box>
      )}
    </>
  )
}

export default ImageCarousel
