import axios from 'axios'

export const PRODUCTION_API_URL = `https://atlammalta.com/api`

// const DEVELOPMENT_API_URL = 'http://localhost:5000/api'
const DEVELOPMENT_API_URL = 'https://atlammalta.com/api'

const urls = {
  production: PRODUCTION_API_URL,
  development: DEVELOPMENT_API_URL,
  test: DEVELOPMENT_API_URL
}

export const urlBase = urls[(process.env.NODE_ENV ?? 'development') as keyof typeof urls]
console.log('urlBase', urlBase)
export const api = axios.create({
  baseURL: urlBase
})
