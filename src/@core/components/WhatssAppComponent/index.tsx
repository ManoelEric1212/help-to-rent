export const shareContent = async (title: string, text: string) => {
  if (navigator.share) {
    try {
      await navigator.share({
        title,
        text,
        url: window.location.href // Obtém a URL atual
      })
    } catch (error) {
      console.error('Erro ao compartilhar:', error)
    }
  } else {
    alert('Seu navegador não suporta compartilhamento.')
  }
}

export const shareOnWhatsApp = (text: string, url?: string) => {
  const message = encodeURIComponent(text + (url ? ` ${url}` : ''))
  const whatsappUrl = `https://wa.me/?text=${message}`

  window.open(whatsappUrl, '_blank')
}

export const shareOnFacebookMessenger = (text: string) => {
  // Copia o texto para a área de transferência
  navigator.clipboard
    .writeText(text)
    .then(() => {
      // Abre o Messenger no navegador
      alert('Text copied! You will be redirected to Facebook messeger')
      window.open('https://www.facebook.com/messages/', '_blank')
    })
    .catch(err => {
      console.error('Error copy message:', err)
    })
}

export const shareOnInstagramDirect = (text: string) => {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      alert('Text copied! You will be redirected to Instagram Direct')
      const instagramDirectUrl = 'https://www.instagram.com/direct/inbox/'
      window.open(instagramDirectUrl, '_blank')
    })
    .catch(() => {
      alert('Erro ao copiar a mensagem para a área de transferência.')
    })
}

export const shareCopy = (text: string) => {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      alert('Text copied!')
    })
    .catch(() => {
      alert('Copy message error.')
    })
}

export const shareToWhatsAppNumber = (phoneNumber: string, text: string) => {
  const formattedNumber = phoneNumber.replace(/\D/g, '') // Remove caracteres não numéricos
  const encodedMessage = encodeURIComponent(text) // Codifica caracteres especiais
  const whatsappUrl = `https://wa.me/${formattedNumber}?text=${encodedMessage}`

  window.open(whatsappUrl, '_blank')
}
