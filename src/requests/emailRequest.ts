import { SEND_EMAIL, SEND_EMAIL_CAREERS, SEND_EMAIL_RENT } from 'src/constants/urls'
import { api } from 'src/service/api'

export interface EmailDTO {
  name: string
  email: string
  phone: string
  message: string
}
interface RequestEmail {
  success: boolean
  message: string
}

export async function sendEmail(body: EmailDTO) {
  try {
    const { data } = await api.post<RequestEmail>(SEND_EMAIL, body)

    return data
  } catch (error) {
    throw new Error('Error - sendEmail')
  }
}

export interface EmailRentDTO {
  name: string
  email: string
  phone: string
  message: string
  idNumber: string
  linkToRent: string
}

export async function sendEmailRent(body: EmailRentDTO) {
  try {
    const { data } = await api.post<RequestEmail>(SEND_EMAIL_RENT, body)

    return data
  } catch (error) {
    throw new Error('Error - sendEmail')
  }
}

export interface EmailCareersDTO {
  name: string
  email: string
  phone: string
  linkedin: string
  resume: File // Alterado para File (não mais string)
}

export async function sendEmailCareers(body: FormData) {
  try {
    const { data } = await api.post<RequestEmail>(SEND_EMAIL_CAREERS, body, {
      headers: {
        'Content-Type': 'multipart/form-data' // Garantir que o tipo seja multipart/form-data
      }
    })

    return data
  } catch (error) {
    throw new Error('Error - sendEmailCareers')
  }
}
