// ** React Imports
import { createContext, useEffect, useState, ReactNode } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Config
import authConfig from 'src/configs/auth'

// ** Types
import { AuthValuesType, LoginParams, UserDataType } from './types'
import { loginUser } from 'src/requests/usersRequest'
import toast from 'react-hot-toast'
import { Agent, getAgentByEmailRequest } from 'src/requests/agentRequest'

// ** Defaults

const AuthContext = createContext({} as AuthValuesType)

type Props = {
  children: ReactNode
}

const AuthProvider = ({ children }: Props) => {
  // ** States
  const [user, setUser] = useState<UserDataType | null>(null)
  const [agent, setAgent] = useState<Agent | null>(null)

  const [loading, setLoading] = useState<boolean>(false)

  // ** Hooks
  const router = useRouter()

  useEffect(() => {
    const initAuth = async (): Promise<void> => {
      const userFake = {
        id: 'dsnfdsjdfnhj237437bds',
        role: 'client',
        email: 'client@materialize.com',
        fullName: 'Jane Doe',
        username: 'janedoe',
        password: 'client'
      }

      // const userAdmin = {
      //   id: 1,
      //   role: 'admin',
      //   password: 'admin',
      //   fullName: 'John Doe',
      //   username: 'johndoe',
      //   email: 'admin@materialize.com'
      // }

      if (router.pathname.includes('/acl') || router.pathname === '/') {
        setUser(userFake)
        window.localStorage.setItem('userData', JSON.stringify(userFake))
        setLoading(false)

        return
      }
      if (window.localStorage.getItem('userData')) {
        setUser(JSON.parse(window.localStorage.getItem('userData') ?? ''))
      }

      setLoading(false)
    }

    initAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (user) {
      console.log('router.asPath', router.asPath)
      if (
        user.role === 'client' &&
        !router.asPath.startsWith('/acl') &&
        !router.asPath.startsWith('/login') &&
        !router.asPath.startsWith('/register')
      ) {
        router.push('/acl')
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, router.route])

  const handleLogin = async (params: LoginParams) => {
    try {
      const dataUser = await loginUser(params)
      if (dataUser) {
        if (dataUser.role === 'GUEST') {
          toast.error('User does not have permission, contact the administrator for permission')

          return
        }
        const userAdmin = {
          id: dataUser.id,
          role: dataUser.role.toLowerCase(),
          password: dataUser.password_hash,
          fullName: dataUser.name,
          username: dataUser.name,
          email: dataUser.email
        }
        if (dataUser.role === 'AGENT') {
          const dataAgent = await getAgentByEmailRequest(dataUser.email)
          setAgent(dataAgent)
          if (dataAgent && !dataAgent.updatedProfile) {
            setUser({ ...userAdmin, updatedProfile: dataAgent.updatedProfile })
            window.localStorage.setItem(
              'userData',
              JSON.stringify({ ...userAdmin, updatedProfile: dataAgent.updatedProfile })
            )
            router.push('/home')
            console.log('entrou')

            return
          }
          setUser(userAdmin)
          window.localStorage.setItem('userData', JSON.stringify(userAdmin))
          router.push('/home')

          return
        }

        setUser(userAdmin)
        window.localStorage.setItem('userData', JSON.stringify(userAdmin))
        router.push('/home')
      }
      if (!dataUser) {
        toast.error('Credentials error')

        return
      }
    } catch (error) {
      toast.error('Login error, verify credentials')
      throw new Error('Error login User')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('userData')
    window.localStorage.removeItem(authConfig.storageTokenKeyName)
    router.push('/login')
  }

  const values = {
    user,
    loading,
    setUser,
    agent,
    setLoading,
    login: handleLogin,
    logout: handleLogout
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
