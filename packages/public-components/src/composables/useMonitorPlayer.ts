import { onBeforeUnmount, ref, shallowRef, type Ref } from 'vue'

import type { MonitorPlaySource, MonitorProtocol } from '../types/monitor'

export interface UseMonitorPlayerOptions {
  videoRef: Ref<HTMLVideoElement | undefined>
  onError?: (err: Error) => void
}

function detectProtocol(url: string, explicit?: MonitorProtocol): MonitorProtocol {
  if (explicit && explicit !== 'auto') return explicit
  if (url.includes('.m3u8') || url.includes('m3u8')) return 'hls'
  if (url.startsWith('webrtc:') || url.includes('/api/webrtc')) return 'webrtc'
  return 'mp4'
}

/** ZLMediaKit WebRTC 拉流（POST SDP） */
export async function connectZlmWebRtc(
  video: HTMLVideoElement,
  apiUrl: string,
  iceServers?: RTCIceServer[],
): Promise<() => void> {
  const pc = new RTCPeerConnection({ iceServers: iceServers ?? [] })

  pc.addTransceiver('video', { direction: 'recvonly' })
  pc.addTransceiver('audio', { direction: 'recvonly' })

  pc.ontrack = (ev) => {
    const [stream] = ev.streams
    if (stream) video.srcObject = stream
  }

  const offer = await pc.createOffer()
  await pc.setLocalDescription(offer)

  const res = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: offer.sdp ?? '',
  })

  if (!res.ok) {
    pc.close()
    throw new Error(`WebRTC 信令失败: ${res.status}`)
  }

  const answerSdp = await res.text()
  await pc.setRemoteDescription({ type: 'answer', sdp: answerSdp })

  const teardown = () => {
    pc.close()
    video.srcObject = null
  }

  return teardown
}

export function useMonitorPlayer(options: UseMonitorPlayerOptions) {
  const { videoRef, onError } = options

  const loading = ref(false)
  const playing = ref(false)
  const protocol = ref<MonitorProtocol>('auto')

  let hlsInstance: { destroy: () => void } | null = null
  let webrtcTeardown: (() => void) | null = null

  async function destroyPlayer() {
    hlsInstance?.destroy()
    hlsInstance = null
    webrtcTeardown?.()
    webrtcTeardown = null
    const video = videoRef.value
    if (video) {
      video.pause()
      video.removeAttribute('src')
      video.srcObject = null
      video.load()
    }
    playing.value = false
  }

  async function loadHls(url: string) {
    const video = videoRef.value
    if (!video) return

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = url
      return
    }

    try {
      const Hls = (await import('hls.js')).default
      if (!Hls.isSupported()) {
        throw new Error('当前浏览器不支持 HLS，请安装 hls.js 或改用 WebRTC')
      }
      hlsInstance = new Hls({ enableWorker: true, lowLatencyMode: true })
      hlsInstance.on(Hls.Events.ERROR, (_e, data) => {
        if (data.fatal) onError?.(new Error(`HLS 播放失败: ${data.type}`))
      })
      hlsInstance.loadSource(url)
      hlsInstance.attachMedia(video)
    } catch (e) {
      const err = e instanceof Error ? e : new Error(String(e))
      if (err.message.includes('Cannot find module') || err.message.includes('Failed to fetch')) {
        throw new Error('请安装可选依赖 hls.js: pnpm add hls.js')
      }
      throw err
    }
  }

  async function load(source: MonitorPlaySource) {
    await destroyPlayer()
    const video = videoRef.value
    if (!video) return

    loading.value = true
    protocol.value = detectProtocol(source.url, source.protocol)

    try {
      if (protocol.value === 'hls') {
        await loadHls(source.url)
      } else if (protocol.value === 'webrtc') {
        const apiUrl = source.webrtc?.apiUrl ?? source.url
        webrtcTeardown = await connectZlmWebRtc(
          video,
          apiUrl,
          source.webrtc?.iceServers,
        )
      } else {
        video.src = source.url
      }

      await video.play().catch(() => {
        /* 自动播放策略可能拦截，用户可手动点播放 */
      })
      playing.value = !video.paused
    } catch (e) {
      const err = e instanceof Error ? e : new Error(String(e))
      onError?.(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function play() {
    const video = videoRef.value
    if (!video) return
    await video.play()
    playing.value = true
  }

  function pause() {
    videoRef.value?.pause()
    playing.value = false
  }

  function toggle() {
    if (playing.value) pause()
    else void play()
  }

  onBeforeUnmount(() => {
    void destroyPlayer()
  })

  return {
    loading,
    playing,
    protocol,
    load,
    play,
    pause,
    toggle,
    destroyPlayer,
  }
}
