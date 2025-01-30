import { Button, Box } from '@mui/material'
import React, { useState } from 'react'

interface HoverButtonProps {
  text: string
  selected: boolean
  handleOnClick: () => void
}

const HoverButton = ({ text, selected, handleOnClick }: HoverButtonProps) => {
  // const [isSelected, setIsSelected] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseEnter = () => setIsHovered(true)
  const handleMouseLeave = () => setIsHovered(false)
  const handleClick = () => {
    handleOnClick()
  }

  return (
    <Box
      sx={{
        display: 'inline-block',
        position: 'relative'
      }}
    >
      <Button
        sx={{
          textTransform: 'none',
          color: 'inherit',
          position: 'relative',
          padding: '8px 16px',
          '&:hover': {
            cursor: 'pointer'
          }
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        {text}
      </Button>
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          height: '2px',
          backgroundColor: 'currentColor',
          width: isHovered || selected ? '100%' : '0',
          transition: 'width 0.3s ease-in-out'
        }}
      />
    </Box>
  )
}

export default HoverButton
