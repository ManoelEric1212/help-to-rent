// ** React Imports

// ** Next Imports
import Head from 'next/head'
import { Router } from 'next/router'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'

// ** Loader Import
import NProgress from 'nprogress'

// ** Emotion Imports
import { CacheProvider } from '@emotion/react'
import type { EmotionCache } from '@emotion/cache'

// ** Config Imports

// import { defaultACLObj } from 'src/configs/acl'
import themeConfig from 'src/configs/themeConfig'

// ** Third Party Import
import { Toaster } from 'react-hot-toast'

// ** Component Imports
import UserLayout from 'src/layouts/UserLayout'

// import AclGuard from 'src/@core/components/auth/AclGuard'
import ThemeComponent from 'src/@core/theme/ThemeComponent'

// import AuthGuard from 'src/@core/components/auth/AuthGuard'
// import GuestGuard from 'src/@core/components/auth/GuestGuard'

// // ** Spinner Import
// import Spinner from 'src/@core/components/spinner'

// ** Contexts
import { AuthProvider } from 'src/context/AuthContext'
import { SettingsConsumer, SettingsProvider } from 'src/@core/context/settingsContext'

// ** Styled Components
import ReactHotToast from 'src/@core/styles/libs/react-hot-toast'

// ** Utils Imports
import { createEmotionCache } from 'src/@core/utils/create-emotion-cache'

// ** Prismjs Styles
import 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'

// ** React Perfect Scrollbar Style
import 'react-perfect-scrollbar/dist/css/styles.css'

import 'src/iconify-bundle/icons-bundle-react'

// ** Global css styles
import '../../styles/globals.css'
import { ModalProvider } from 'src/context/SettingsAgentContext'
import { MapRegisterProvider } from 'src/context/MapRegisterContext'
import { ItemsProvider } from 'src/context/ItemsContext'

// ** Extend App Props with Emotion
type ExtendedAppProps = AppProps & {
  Component: NextPage
  emotionCache: EmotionCache
}

// type GuardProps = {
//   authGuard: boolean
//   guestGuard: boolean
//   children: ReactNode
// }

const clientSideEmotionCache = createEmotionCache()

// ** Pace Loader
if (themeConfig.routingLoader) {
  Router.events.on('routeChangeStart', () => {
    NProgress.start()
  })
  Router.events.on('routeChangeError', () => {
    NProgress.done()
  })
  Router.events.on('routeChangeComplete', () => {
    NProgress.done()
  })
}

// ** Configure JSS & ClassName
const App = (props: ExtendedAppProps) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props

  // Variables
  const contentHeightFixed = Component.contentHeightFixed ?? false
  const getLayout =
    Component.getLayout ?? (page => <UserLayout contentHeightFixed={contentHeightFixed}>{page}</UserLayout>)

  const setConfig = Component.setConfig ?? undefined
  const siteUrl = 'https://atlamproperties.com'

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>{`${themeConfig.templateName} `}</title>
        <meta name='description' content={`${themeConfig.templateName} – Find your ideal place in  Malta`} />
        <meta name='keywords' content='Atlammalta, MaltaRent, MaltaSale, atlammalta' />
        <meta name='viewport' content='initial-scale=1, width=device-width' />

        {/* Open Graph / Facebook / Instagram / LinkedIn */}
        <meta property='og:type' content='website' />
        <meta property='og:url' content={siteUrl} />
        <meta property='og:title' content={themeConfig.templateName} />
        <meta property='og:description' content='Find your ideal place in Malta!' />
        <meta property='og:image' content='https://atlamproperties.com/images/logo10.png' />
        <meta property='og:image:width' content='1200' />
        <meta property='og:image:height' content='630' />

        {/* Twitter */}
        <meta name='twitter:card' content='summary_large_image' />
        <meta name='twitter:url' content={siteUrl} />
        <meta name='twitter:title' content={themeConfig.templateName} />
        <meta name='twitter:description' content='Find your ideal place in Malta!' />
        <meta name='twitter:image' content='https://atlamproperties.com/images/logo10.png' />

        {/* Google (Schema.org) */}
        <meta itemProp='name' content={themeConfig.templateName} />
        <meta itemProp='description' content='Find your ideal place in Malta!' />
        <meta itemProp='image' content='https://atlamproperties.com/images/logo10.png' />
      </Head>

      <AuthProvider>
        <ItemsProvider>
          <MapRegisterProvider>
            <ModalProvider>
              <SettingsProvider {...(setConfig ? { pageSettings: setConfig() } : {})}>
                <SettingsConsumer>
                  {({ settings }) => {
                    return (
                      <ThemeComponent settings={settings}>
                        {/* <Guard authGuard={authGuard} guestGuard={guestGuard}> */}
                        {/* <AclGuard aclAbilities={aclAbilities} guestGuard={guestGuard} authGuard={authGuard}> */}
                        {getLayout(<Component {...pageProps} />)}
                        {/* </AclGuard> */}
                        {/* </Guard> */}
                        <ReactHotToast>
                          <Toaster position={settings.toastPosition} toastOptions={{ className: 'react-hot-toast' }} />
                        </ReactHotToast>
                      </ThemeComponent>
                    )
                  }}
                </SettingsConsumer>
              </SettingsProvider>
            </ModalProvider>
          </MapRegisterProvider>
        </ItemsProvider>
      </AuthProvider>
    </CacheProvider>
  )
}

export default App
