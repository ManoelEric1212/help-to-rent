// ** Type Imports
import { NavLink, NavGroup, LayoutProps, NavSectionTitle } from 'src/@core/layouts/types'

// ** Custom Menu Components
import VerticalNavLink from './VerticalNavLink'
import VerticalNavGroup from './VerticalNavGroup'
import VerticalNavSectionTitle from './VerticalNavSectionTitle'
import { useAuth } from 'src/hooks/useAuth'

interface Props {
  parent?: NavGroup
  navHover?: boolean
  navVisible?: boolean
  groupActive: string[]
  isSubToSub?: NavGroup
  currentActiveGroup: string[]
  navigationBorderWidth: number
  settings: LayoutProps['settings']
  saveSettings: LayoutProps['saveSettings']
  setGroupActive: (value: string[]) => void
  setCurrentActiveGroup: (item: string[]) => void
  verticalNavItems?: LayoutProps['verticalLayoutProps']['navMenu']['navItems']
}

const resolveNavItemComponent = (item: NavGroup | NavLink | NavSectionTitle) => {
  if ((item as NavSectionTitle).sectionTitle) return VerticalNavSectionTitle
  if ((item as NavGroup).children) return VerticalNavGroup

  return VerticalNavLink
}

const VerticalNavItems = (props: Props) => {
  const { user } = useAuth()

  // ** Props
  const { verticalNavItems } = props

  if (user?.role === 'agent') {
    const RenderMenuItems = verticalNavItems
      ?.filter(item => 'path' in item && item.path !== '/users' && item.path !== '/region' && item.path !== '/settings')
      ?.map((item: NavGroup | NavLink | NavSectionTitle, index: number) => {
        const TagName: any = resolveNavItemComponent(item)

        return <TagName {...props} key={index} item={item} />
      })

    return <>{RenderMenuItems}</>
  }

  if (user?.role === 'admin') {
    const RenderMenuItems = verticalNavItems?.map((item: NavGroup | NavLink | NavSectionTitle, index: number) => {
      const TagName: any = resolveNavItemComponent(item)

      return <TagName {...props} key={index} item={item} />
    })

    return <>{RenderMenuItems}</>
  }

  return <></>
}

export default VerticalNavItems
