import { AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemText, Box } from '@mui/material'
import { Menu as MenuIcon } from '@mui/icons-material'
import { useState } from 'react'
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

const Header2 = () => {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const router = useRouter()
  const { setOpenCon } = useModal()

  return (
    <>
      <AppBar
        position='fixed'
        elevation={4}
        sx={{
          backgroundColor: '#25235D',
          transition: 'background-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
          boxShadow: 3,
          padding: '0 20px 20px 0'
        }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', padding: '5px' }}>
          <div style={{ cursor: 'pointer' }} onClick={() => router.push('/acl')}>
            <img src={'/images/logo1.png'} alt='Real State Icon' style={{ width: '270px' }} />
          </div>

          <IconButton sx={{ display: { xs: 'block', md: 'none' }, color: 'white' }} onClick={() => setDrawerOpen(true)}>
            <MenuIcon />
          </IconButton>

          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              gap: { xs: '0.2rem', md: '3.5rem', sm: '2rem' },
              color: '#fff'
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
                if (item.path === '/acl/contact') {
                  setOpenCon(true)
                  setDrawerOpen(false)

                  return
                }
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

export default Header2
