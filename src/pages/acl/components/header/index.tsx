import { AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemText, Box } from '@mui/material'
import { Menu as MenuIcon } from '@mui/icons-material'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

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

const Header = () => {
  const [scrolling, setScrolling] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const router = useRouter()
  console.log('router', router.pathname)

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
          backgroundColor: scrolling ? '#fff' : 'transparent',
          transition: 'background-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
          boxShadow: scrolling ? 3 : 'none',
          padding: scrolling ? '0 20px 20px 0' : '0 20px'
        }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', padding: scrolling ? '0px' : '16px' }}>
          {router.pathname === '/acl' ? (
            scrolling ? (
              <img src='/images/logo2.png' alt='Real State Icon' style={{ width: '270px' }} />
            ) : (
              <img src='/images/logo1.png' alt='Real State Icon' style={{ width: '250px' }} />
            )
          ) : (
            <img src='/images/logo2.png' alt='Real State Icon' style={{ width: '270px' }} />
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
              color: router.pathname === '/acl' ? (scrolling ? '#25235D' : '#fff') : '#25235D'
            }}
          >
            <HoverButton
              text='Home'
              selected={router.pathname === '/acl'}
              handleOnClick={() => router.replace('/acl')}
            />
            <HoverButton
              text='Properties'
              selected={router.pathname === '/acl/properties'}
              handleOnClick={() => router.replace('/acl/properties')}
            />
            <HoverButton
              text='Contact'
              selected={router.pathname === '/acl/contact'}
              handleOnClick={() => router.replace('/acl/contact')}
            />
            <HoverButton
              text='Login'
              selected={router.pathname === '/login'}
              handleOnClick={() => router.replace('/login')}
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
                router.replace(item.path)
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

export default Header
