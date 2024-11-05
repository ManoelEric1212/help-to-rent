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

// ** Defaults

const AuthContext = createContext({} as AuthValuesType)

type Props = {
  children: ReactNode
}

const AuthProvider = ({ children }: Props) => {
  // ** States
  const [user, setUser] = useState<UserDataType | null>(null)
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

  const handleLogin = async (params: LoginParams) => {
    try {
      const dataUser = await loginUser(params)
      if (dataUser) {
        console.log('dataLogin', dataUser)
        if (dataUser.role !== 'ADMIN') {
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
        setUser(userAdmin)
        const returnUrl = router.query.returnUrl
        window.localStorage.setItem('userData', JSON.stringify(userAdmin))
        const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'
        router.replace(redirectURL as string)
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
    setLoading,
    login: handleLogin,
    logout: handleLogout
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
