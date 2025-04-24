import React, { useState, ChangeEvent, FormEvent } from 'react'
import { Box, TextField, Button, Typography } from '@mui/material'
import { Person, Email, Phone, LinkedIn, Send } from '@mui/icons-material'
import toast from 'react-hot-toast'
import { sendEmailCareers } from 'src/requests/emailRequest'
import { CloudUpload } from '@mui/icons-material'

interface FormData {
  name: string
  email: string
  phone: string
  linkedin: string
  resume: File | null // Alterado para File
}

const JobApplicationForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    linkedin: '',
    resume: null // Inicialmente como null
  })

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target
    if (name === 'resume' && files) {
      setFormData(prev => ({ ...prev, resume: files[0] })) // Armazena o arquivo
    } else {
      setFormData(prev => ({ ...prev, [name]: value })) // Atualiza os campos de texto
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!formData.resume) {
      toast.error('Please upload your resume')

      return
    }

    try {
      const formDataToSend = new FormData()

      // Adicionando os dados ao FormData
      formDataToSend.append('name', formData.name)
      formDataToSend.append('email', formData.email)
      formDataToSend.append('phone', formData.phone)
      formDataToSend.append('linkedin', formData.linkedin)
      formDataToSend.append('resume', formData.resume) // O arquivo de currículo

      // Enviando os dados para a API
      const data = await sendEmailCareers(formDataToSend)
      console.log('data', data)
      toast.success('Your message has been sent!')
    } catch (error) {
      toast.error('Error sending the message, please contact the admin!')
    }
  }

  return (
    <Box
      component='form'
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        maxWidth: 400,
        margin: 'auto',
        padding: 3,
        boxShadow: 3,
        borderRadius: 2
      }}
    >
      <Typography variant='h5' gutterBottom>
        Job Application
      </Typography>

      <TextField
        label='Name'
        name='name'
        variant='outlined'
        fullWidth
        value={formData.name}
        onChange={handleChange}
        InputProps={{ startAdornment: <Person sx={{ mr: 1 }} /> }}
      />

      <TextField
        label='Email'
        name='email'
        variant='outlined'
        fullWidth
        value={formData.email}
        onChange={handleChange}
        InputProps={{ startAdornment: <Email sx={{ mr: 1 }} /> }}
      />

      <TextField
        label='Phone'
        name='phone'
        variant='outlined'
        fullWidth
        value={formData.phone}
        onChange={handleChange}
        InputProps={{ startAdornment: <Phone sx={{ mr: 1 }} /> }}
      />

      <TextField
        label='LinkedIn'
        name='linkedin'
        variant='outlined'
        fullWidth
        value={formData.linkedin}
        onChange={handleChange}
        InputProps={{ startAdornment: <LinkedIn sx={{ mr: 1 }} /> }}
      />

      {/* Campo de upload do currículo */}
      <Typography>Send a resume file:</Typography>
      <input
        accept='.pdf,.doc,.docx,.txt'
        id='resume-upload'
        name='resume'
        type='file'
        style={{ display: 'none' }}
        onChange={handleChange}
      />

      <label htmlFor='resume-upload'>
        <Button
          variant='outlined'
          component='span'
          fullWidth
          startIcon={<CloudUpload />}
          sx={{ justifyContent: 'flex-start' }}
        >
          {formData.resume ? `📎 ${formData.resume.name}` : 'Choose File'}
        </Button>
      </label>

      <Button type='submit' variant='contained' startIcon={<Send />} sx={{ mt: 2, background: '#8B181B' }}>
        Submit
      </Button>
    </Box>
  )
}

export default JobApplicationForm
