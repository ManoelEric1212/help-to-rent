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
      title: 'Real state',
      path: '/real-state',
      icon: 'mdi:home-city-outline'
    },
    {
      path: '/users',
      title: 'Users',
      icon: 'mdi:account-tie'
    },
    {
      path: '/settings',
      title: 'Settings',
      icon: 'mdi:cog-outline'
    }
  ]
}

export default navigation
