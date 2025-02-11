// ** MUI Imports
import { Theme } from '@mui/material/styles'

// ** Hook Import
import { useSettings } from 'src/@core/hooks/useSettings'

const GlobalStyles = (theme: Theme) => {
  // ** Hook & Var
  const { settings } = useSettings()
  const { mode } = settings

  const perfectScrollbarThumbBgColor = () => {
    if (mode === 'light') {
      return '#BFBFD5 !important'
    } else {
      return '#57596C !important'
    }
  }

  return {
    '.MuiButton-containedPrimary': {
      backgroundColor: '#25235D',
      color: '#fff',
      '&:hover': {
        backgroundColor: '#1F1B4A'
      }
    },
    '.MuiButton-containedSecondary': {
      backgroundColor: '#CFB53C',
      color: '#fff',
      '&:hover': {
        backgroundColor: '#B59E32'
      }
    },
    '.MuiButton-outlinedPrimary': {
      borderColor: '#25235D',
      color: '#25235D',
      '&:hover': {
        borderColor: '#1F1B4A',
        backgroundColor: 'rgba(37, 35, 93, 0.1)'
      }
    },
    '.MuiButton-outlinedSecondary': {
      borderColor: '#CFB53C',
      color: '#CFB53C',
      '&:hover': {
        borderColor: '#B59E32',
        backgroundColor: 'rgba(207, 181, 60, 0.1)'
      }
    },
    '.demo-space-x > *': {
      marginTop: '1rem !important',
      marginRight: '1rem !important',
      'body[dir="rtl"] &': {
        marginRight: '0 !important',
        marginLeft: '1rem !important'
      }
    },
    '.demo-space-y > *:not(:last-of-type)': {
      marginBottom: '1rem'
    },
    '.MuiGrid-container.match-height .MuiCard-root': {
      height: '100%'
    },
    '.ps__rail-y': {
      zIndex: 1,
      right: '0 !important',
      left: 'auto !important',
      '&:hover, &:focus, &.ps--clicking': {
        backgroundColor: theme.palette.mode === 'light' ? '#F3F3F8 !important' : '#393B51 !important'
      },
      '& .ps__thumb-y': {
        right: '3px !important',
        left: 'auto !important',
        backgroundColor: theme.palette.mode === 'light' ? '#BFBFD5 !important' : '#57596C !important'
      },
      '.layout-vertical-nav &': {
        '& .ps__thumb-y': {
          width: 4,
          backgroundColor: perfectScrollbarThumbBgColor()
        },
        '&:hover, &:focus, &.ps--clicking': {
          backgroundColor: 'transparent !important',
          '& .ps__thumb-y': {
            width: 6
          }
        }
      }
    },

    '#nprogress': {
      pointerEvents: 'none',
      '& .bar': {
        left: 0,
        top: 0,
        height: 3,
        width: '100%',
        zIndex: 2000,
        position: 'fixed',
        backgroundColor: theme.palette.primary.main
      }
    }
  }
}

export default GlobalStyles
