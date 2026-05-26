/** ZLMediaKit / 业务后端返回的播放地址 */
export type MonitorProtocol = 'auto' | 'hls' | 'mp4' | 'webrtc'

export interface MonitorPlaySource {
  /** m3u8 / mp4 / 或 WebRTC 信令地址（由 protocol 决定） */
  url: string
  protocol?: MonitorProtocol
  /**
   * WebRTC（ZLMediaKit）示例：
   * { apiUrl: 'https://stream.example.com/index/api/webrtc?app=live&stream=cam1&type=play' }
   */
  webrtc?: {
    apiUrl: string
    iceServers?: RTCIceServer[]
  }
}

/**
 * 与海康 WebVideoCtrl 云台编号一致（参考 dist/videos/cn/demo.html）
 * 1上 2下 3左 4右 5左上 6左下 7右上 8右下 9自动
 */
export type PtzDirection = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

export type PtzLensAction = 'in' | 'out'

export interface PtzEventPayload {
  command: 'move' | 'zoom' | 'focus' | 'iris' | 'auto'
  /** move / auto 时使用 */
  direction?: PtzDirection
  zoom?: PtzLensAction
  focus?: PtzLensAction
  iris?: PtzLensAction
  speed?: number
  /** mouseup / 停止变倍等 */
  stop?: boolean
}

export interface MonitorPresetItem {
  id: number | string
  name: string
  sort?: number
}
