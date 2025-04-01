import { AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemText, Box } from '@mui/material'
import { Menu as MenuIcon } from '@mui/icons-material'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useModal } from 'src/context/SettingsAgentContext'

const HoverButton = ({
  text,
  selected,
  handleOnClick
}: {
  text: string
  selected: boolean
  handleOnClick: () => void
}) => {
  return (
    <Typography
      onClick={handleOnClick}
      sx={{
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '1rem',
        textDecoration: selected ? 'underline' : 'none',
        '&:hover': { opacity: 0.7 }
      }}
    >
      {text}
    </Typography>
  )
}

const Header3 = () => {
  const [scrolling, setScrolling] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const router = useRouter()
  const { setOpenCon } = useModal()

  useEffect(() => {
    const handleScroll = () => {
      setScrolling(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <AppBar
        position='fixed'
        elevation={scrolling ? 4 : 0}
        sx={{
          backgroundColor: scrolling ? '#25235D' : 'rgba(0, 0, 0, 0.1)',
          transition: 'background-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
          boxShadow: scrolling ? 3 : 3,
          padding: scrolling ? '0 20px  0' : '0 20px  0'
        }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', padding: scrolling ? '16px' : '16px' }}>
          {router.pathname === '/acl' ? (
            <div style={{ cursor: 'pointer' }}>
              <img
                src={scrolling ? '/images/logo1.png' : '/images/logo5.png'}
                alt='Real State Icon'
                style={{ width: '270px' }}
                onClick={() => router.push('/acl')}
              />
            </div>
          ) : (
            <div style={{ cursor: 'pointer' }}>
              <img
                src={scrolling ? '/images/logo1.png' : '/images/logo10.png'}
                alt='Real State Icon'
                style={{ width: scrolling ? '270px' : '70px' }}
                onClick={() => router.push('/acl')}
              />
            </div>
          )}

          <IconButton
            sx={{ display: { xs: 'block', md: 'none' }, color: scrolling ? 'black' : 'white' }}
            onClick={() => setDrawerOpen(true)}
          >
            <MenuIcon />
          </IconButton>

          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              gap: { xs: '0.2rem', md: '3.5rem', sm: '2rem' },
              color: router.pathname === '/acl' ? (scrolling ? '#fff' : '#fff') : '#25235D'
            }}
          >
            <HoverButton text='Home' selected={router.pathname === '/acl'} handleOnClick={() => router.push('/acl')} />
            <HoverButton
              text='Properties'
              selected={router.pathname === '/acl/properties'}
              handleOnClick={() => router.push('/acl/properties')}
            />
            <HoverButton
              text='Contact'
              selected={router.pathname === '/acl/contact'}
              handleOnClick={() => setOpenCon(true)}
            />
            <HoverButton
              text='Careers'
              selected={router.pathname === '/acl/careers'}
              handleOnClick={() => router.push('/acl/careers')}
            />
            <HoverButton
              text='Login'
              selected={router.pathname === '/login'}
              handleOnClick={() => router.push('/login')}
            />
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer anchor='right' open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <List sx={{ width: 250, fontWeight: 'bold' }}>
          {[
            { text: 'Home', path: '/acl' },
            { text: 'Properties', path: '/acl/properties' },
            { text: 'Contact', path: '/acl/contact' },
            { text: 'Login', path: '/login' }
          ].map(item => (
            <ListItem
              button
              key={item.text}
              onClick={() => {
                router.push(item.path)
                setDrawerOpen(false)
              }}
            >
              <ListItemText sx={{ fontWeight: 'bold' }} primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  )
}

export default Header3
