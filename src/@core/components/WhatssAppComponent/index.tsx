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
export const shareToWhatsAppNumber = (phoneNumber: string, text: string) => {
  const formattedNumber = phoneNumber.replace(/\D/g, '') // Remove caracteres não numéricos
  const encodedMessage = encodeURIComponent(text) // Codifica caracteres especiais
  const whatsappUrl = `https://wa.me/${formattedNumber}?text=${encodedMessage}`

  window.open(whatsappUrl, '_blank')
}
