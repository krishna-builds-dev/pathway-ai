export function compressImage(file: File, maxWidth = 600): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.src = URL.createObjectURL(file)
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ratio = maxWidth / img.width
      canvas.width = maxWidth
      canvas.height = img.height * ratio
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob)
          else reject(new Error('Canvas empty'))
        },
        'image/jpeg',
        0.8
      )
    }
    img.onerror = reject
  })
}