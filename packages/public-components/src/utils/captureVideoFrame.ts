/** 从 video 元素截取当前帧为 Blob（用于截图） */
export async function captureVideoFrame(
  video: HTMLVideoElement,
  mimeType = 'image/png',
  quality = 0.92,
): Promise<Blob> {
  const width = video.videoWidth
  const height = video.videoHeight
  if (!width || !height) {
    throw new Error('视频尚未就绪，无法截图')
  }

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('无法创建 Canvas 上下文')

  ctx.drawImage(video, 0, 0, width, height)

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('截图失败'))),
      mimeType,
      quality,
    )
  })
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
