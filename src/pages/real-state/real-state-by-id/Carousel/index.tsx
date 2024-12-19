import React, { useState } from 'react'
import { Box } from '@mui/material'
import Slider from 'react-slick'

type CarouselProps = {
  images: string[]
}

const ImageCarousel: React.FC<CarouselProps> = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState<number>(0)

  // Configuração para o Slider de Miniaturas
  const thumbnailSettings = {
    infinite: true,
    slidesToShow: Math.min(images?.length, 5), // Mostra até 5 miniaturas
    slidesToScroll: 1,
    focusOnSelect: true
  }

  return (
    <Box>
      {/* Imagem Selecionada (Grande) */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          mb: 2,
          width: '100%',
          height: 300,
          overflow: 'hidden',
          borderRadius: 2,
          boxShadow: 3
        }}
      >
        <img
          src={images[selectedImage]}
          alt={`Selected ${selectedImage}`}
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'cover'
          }}
        />
      </Box>

      {/* Miniaturas no Rodapé */}
      <Slider {...thumbnailSettings} beforeChange={(_, next) => setSelectedImage(next)}>
        {images.map((image, index) => (
          <Box
            key={index}
            onClick={() => setSelectedImage(index)}
            sx={{
              p: 1,
              cursor: 'pointer',
              border: selectedImage === index ? '2px solid #1976d2' : 'none',
              borderRadius: 2,
              width: `${Math.min(100 / images.length, 20)}%`, // Ajusta largura proporcional
              maxWidth: '120px', // Limita a largura máxima
              minWidth: '60px' // Define a largura mínima
            }}
          >
            <img
              src={image}
              alt={`Thumbnail ${index}`}
              style={{
                width: '100%',
                height: 'auto',
                objectFit: 'cover',
                borderRadius: '4px'
              }}
            />
          </Box>
        ))}
      </Slider>
    </Box>
  )
}

export default ImageCarousel
