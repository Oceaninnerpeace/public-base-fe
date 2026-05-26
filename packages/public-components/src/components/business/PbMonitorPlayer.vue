<script setup lang="ts">
import {
  CameraOutlined,
  FullscreenOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
  ReloadOutlined,
} from '@ant-design/icons-vue'
import { computed, ref, watch } from 'vue'

import { useMonitorPlayer } from '../../composables/useMonitorPlayer'
import type { MonitorPlaySource } from '../../types/monitor'
import { captureVideoFrame, downloadBlob } from '../../utils/captureVideoFrame'

defineOptions({ name: 'PbMonitorPlayer' })

const props = withDefaults(
  defineProps<{
    /** 播放源；变更时自动重新加载 */
    source?: MonitorPlaySource | null
    /** 兼容：仅传 url */
    url?: string
    protocol?: MonitorPlaySource['protocol']
    autoplay?: boolean
    muted?: boolean
    showToolbar?: boolean
    screenshotFilename?: string
    placeholder?: string
    objectFit?: 'contain' | 'cover' | 'fill'
  }>(),
  {
    autoplay: true,
    muted: true,
    showToolbar: true,
    screenshotFilename: 'snapshot.png',
    placeholder: '暂无视频信号',
    objectFit: 'contain',
  },
)

const emit = defineEmits<{
  ready: [video: HTMLVideoElement]
  play: []
  pause: []
  error: [error: Error]
  screenshot: [blob: Blob]
}>()

const videoRef = ref<HTMLVideoElement>()
const errorMessage = ref('')

const resolvedSource = computed<MonitorPlaySource | null>(() => {
  if (props.source?.url) return props.source
  if (props.url) {
    return { url: props.url, protocol: props.protocol ?? props.source?.protocol }
  }
  return null
})

const player = useMonitorPlayer({
  videoRef,
  onError: (err) => {
    errorMessage.value = err.message
    emit('error', err)
  },
})

async function reload() {
  errorMessage.value = ''
  const src = resolvedSource.value
  if (!src?.url) return
  try {
    await player.load(src)
    if (videoRef.value) emit('ready', videoRef.value)
  } catch {
    /* onError 已处理 */
  }
}

async function handleScreenshot() {
  const video = videoRef.value
  if (!video) return
  try {
    const blob = await captureVideoFrame(video)
    emit('screenshot', blob)
    downloadBlob(blob, props.screenshotFilename)
  } catch (e) {
    const err = e instanceof Error ? e : new Error(String(e))
    errorMessage.value = err.message
    emit('error', err)
  }
}

function handleFullscreen() {
  const el = videoRef.value?.parentElement
  if (!el) return
  if (document.fullscreenElement) {
    void document.exitFullscreen()
  } else {
    void el.requestFullscreen()
  }
}

function onVideoPlay() {
  player.playing.value = true
  emit('play')
}

function onVideoPause() {
  player.playing.value = false
  emit('pause')
}

watch(
  resolvedSource,
  (src) => {
    if (src?.url) void reload()
    else void player.destroyPlayer()
  },
  { immediate: true, deep: true },
)

defineExpose({
  play: player.play,
  pause: player.pause,
  toggle: player.toggle,
  reload,
  screenshot: handleScreenshot,
  getVideoElement: () => videoRef.value,
  destroy: player.destroyPlayer,
})
</script>

<template>
  <div class="pb-monitor-player">
    <div class="pb-monitor-player__viewport">
      <video
        ref="videoRef"
        class="pb-monitor-player__video"
        :style="{ objectFit }"
        playsinline
        :autoplay="autoplay"
        :muted="muted"
        @play="onVideoPlay"
        @pause="onVideoPause"
      />

      <div v-if="player.loading.value" class="pb-monitor-player__mask">加载中…</div>
      <div v-else-if="errorMessage" class="pb-monitor-player__mask pb-monitor-player__mask--error">
        {{ errorMessage }}
      </div>
      <div v-else-if="!resolvedSource?.url" class="pb-monitor-player__mask">{{ placeholder }}</div>

      <div v-if="showToolbar" class="pb-monitor-player__toolbar">
        <a-tooltip title="播放/暂停">
          <button type="button" class="pb-monitor-player__btn" @click="player.toggle()">
            <PauseCircleOutlined v-if="player.playing.value" />
            <PlayCircleOutlined v-else />
          </button>
        </a-tooltip>
        <a-tooltip title="重新加载">
          <button type="button" class="pb-monitor-player__btn" @click="reload()">
            <ReloadOutlined />
          </button>
        </a-tooltip>
        <a-tooltip title="截图">
          <button type="button" class="pb-monitor-player__btn" @click="handleScreenshot()">
            <CameraOutlined />
          </button>
        </a-tooltip>
        <a-tooltip title="全屏">
          <button type="button" class="pb-monitor-player__btn" @click="handleFullscreen()">
            <FullscreenOutlined />
          </button>
        </a-tooltip>
        <span v-if="player.protocol.value !== 'auto'" class="pb-monitor-player__tag">
          {{ player.protocol.value.toUpperCase() }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pb-monitor-player {
  width: 100%;
  height: 100%;
  background: #000;
}

.pb-monitor-player__viewport {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 240px;
  overflow: hidden;
}

.pb-monitor-player__video {
  display: block;
  width: 100%;
  height: 100%;
  background: #000;
}

.pb-monitor-player__mask {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgb(255 255 255 / 65%);
  font-size: 14px;
  background: rgb(0 0 0 / 45%);
  pointer-events: none;
}

.pb-monitor-player__mask--error {
  color: #ff7875;
}

.pb-monitor-player__toolbar {
  position: absolute;
  right: 8px;
  bottom: 8px;
  left: 8px;
  display: flex;
  gap: 6px;
  align-items: center;
  padding: 6px 8px;
  background: rgb(0 0 0 / 55%);
  border-radius: 6px;
}

.pb-monitor-player__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  color: #fff;
  cursor: pointer;
  background: transparent;
  border: none;
  border-radius: 4px;
  transition: background 0.2s;
}

.pb-monitor-player__btn:hover {
  background: rgb(255 255 255 / 15%);
}

.pb-monitor-player__tag {
  margin-left: auto;
  padding: 2px 8px;
  color: rgb(255 255 255 / 85%);
  font-size: 12px;
  background: rgb(255 255 255 / 12%);
  border-radius: 4px;
}
</style>
