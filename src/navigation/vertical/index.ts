// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): VerticalNavItemsType => {
  return [
    {
      title: 'Home',
      path: '/home',
      icon: 'mdi:home-outline'
    },
    {
      title: 'Search properties',
      path: '/real-state',
      icon: 'mdi:home-city-outline'
    },
    {
      title: 'Add properties',
      path: '/real-state/register',
      icon: 'mdi:plus'
    },
    {
      path: '/users',
      title: 'Users',
      icon: 'mdi:account-tie'
    },
    {
      path: '/region',
      title: 'Regions',
      icon: 'mdi:map-marker'
    },
    {
      path: '/settings',
      title: 'Settings',
      icon: 'mdi:cog-outline'
    }
  ]
}

export default navigation
