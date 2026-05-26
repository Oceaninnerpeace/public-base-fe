<script setup lang="ts">
import { ref } from 'vue'

import type { MonitorPresetItem, PtzDirection, PtzEventPayload } from '../../types/monitor'

defineOptions({ name: 'PbCameraPtz' })

const props = withDefaults(
  defineProps<{
    disabled?: boolean
    /** 云台速度 1-7，与海康 demo 一致 */
    speed?: number
    showPresets?: boolean
    presets?: MonitorPresetItem[]
    title?: string
  }>(),
  {
    disabled: false,
    speed: 4,
    showPresets: true,
    presets: () => [],
    title: '云台控制',
  },
)

const emit = defineEmits<{
  ptz: [payload: PtzEventPayload]
  'preset-set': [presetId: number | string]
  'preset-goto': [presetId: number | string]
}>()

const presetIdInput = ref('1')
const presetGotoInput = ref('')

/** 方向键布局（与海康编号一致，参考 dist demo.html） */
const directionPad: { dir: PtzDirection; label: string; title: string }[] = [
  { dir: 5, label: '↖', title: '左上' },
  { dir: 1, label: '↑', title: '上' },
  { dir: 7, label: '↗', title: '右上' },
  { dir: 3, label: '←', title: '左' },
  { dir: 9, label: 'A', title: '自动' },
  { dir: 4, label: '→', title: '右' },
  { dir: 6, label: '↙', title: '左下' },
  { dir: 2, label: '↓', title: '下' },
  { dir: 8, label: '↘', title: '右下' },
]

const lensRows = [
  { key: 'zoom' as const, label: '变倍', inTitle: '变倍+', outTitle: '变倍-' },
  { key: 'iris' as const, label: '光圈', inTitle: '光圈+', outTitle: '光圈-' },
  { key: 'focus' as const, label: '变焦', inTitle: '变焦+', outTitle: '变焦-' },
]

const activeDir = ref<PtzDirection | null>(null)

function emitMove(direction: PtzDirection, stop = false) {
  emit('ptz', {
    command: direction === 9 ? 'auto' : 'move',
    direction,
    speed: props.speed,
    stop,
  })
}

function onDirDown(dir: PtzDirection) {
  if (props.disabled) return
  activeDir.value = dir
  emitMove(dir, false)
}

function onDirUp(dir: PtzDirection) {
  if (props.disabled) return
  activeDir.value = null
  emitMove(dir, true)
}

function onLensDown(
  command: 'zoom' | 'focus' | 'iris',
  action: 'in' | 'out',
) {
  if (props.disabled) return
  emit('ptz', { command, [command]: action, speed: props.speed, stop: false })
}

function onLensUp(command: 'zoom' | 'focus' | 'iris') {
  if (props.disabled) return
  emit('ptz', { command, stop: true })
}

function onPresetSet() {
  emit('preset-set', presetIdInput.value)
}

function onPresetGoto() {
  const id = presetGotoInput.value || presetIdInput.value
  emit('preset-goto', id)
}
</script>

<template>
  <div class="pb-camera-ptz" :class="{ 'is-disabled': disabled }">
    <div v-if="title" class="pb-camera-ptz__title">{{ title }}</div>

    <div class="pb-camera-ptz__body">
      <div class="pb-camera-ptz__pad">
        <button
          v-for="item in directionPad"
          :key="item.dir"
          type="button"
          class="pb-camera-ptz__dir"
          :class="{ 'is-active': activeDir === item.dir }"
          :title="item.title"
          :disabled="disabled"
          @mousedown.prevent="onDirDown(item.dir)"
          @mouseup.prevent="onDirUp(item.dir)"
          @mouseleave="activeDir === item.dir ? onDirUp(item.dir) : undefined"
          @touchstart.prevent="onDirDown(item.dir)"
          @touchend.prevent="onDirUp(item.dir)"
        >
          {{ item.label }}
        </button>
      </div>

      <div class="pb-camera-ptz__lens">
        <div v-for="row in lensRows" :key="row.key" class="pb-camera-ptz__lens-row">
          <span class="pb-camera-ptz__lens-label">{{ row.label }}</span>
          <button
            type="button"
            class="pb-camera-ptz__lens-btn"
            :title="row.inTitle"
            :disabled="disabled"
            @mousedown.prevent="onLensDown(row.key, 'in')"
            @mouseup.prevent="onLensUp(row.key)"
            @mouseleave="onLensUp(row.key)"
          >
            +
          </button>
          <button
            type="button"
            class="pb-camera-ptz__lens-btn"
            :title="row.outTitle"
            :disabled="disabled"
            @mousedown.prevent="onLensDown(row.key, 'out')"
            @mouseup.prevent="onLensUp(row.key)"
            @mouseleave="onLensUp(row.key)"
          >
            −
          </button>
        </div>
      </div>
    </div>

    <div v-if="showPresets" class="pb-camera-ptz__presets">
      <div class="pb-camera-ptz__presets-title">预置位</div>
      <div class="pb-camera-ptz__presets-row">
        <a-input v-model:value="presetIdInput" size="small" placeholder="编号" style="width: 72px" />
        <a-button size="small" :disabled="disabled" @click="onPresetSet">设置</a-button>
      </div>
      <div class="pb-camera-ptz__presets-row">
        <a-select
          v-if="presets.length"
          v-model:value="presetGotoInput"
          size="small"
          placeholder="选择预置位"
          style="flex: 1"
          :options="presets.map((p) => ({ value: String(p.id), label: p.name }))"
        />
        <a-input v-else v-model:value="presetGotoInput" size="small" placeholder="编号" style="flex: 1" />
        <a-button size="small" type="primary" :disabled="disabled" @click="onPresetGoto">调用</a-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pb-camera-ptz {
  width: 280px;
  padding: 12px;
  color: #fff;
  background: rgb(5 80 114 / 60%);
  border-radius: 10px;
}

.pb-camera-ptz.is-disabled {
  opacity: 0.55;
  pointer-events: none;
}

.pb-camera-ptz__title {
  margin-bottom: 10px;
  font-size: 14px;
  text-align: center;
}

.pb-camera-ptz__body {
  display: flex;
  gap: 12px;
}

.pb-camera-ptz__pad {
  display: grid;
  grid-template-columns: repeat(3, 44px);
  gap: 4px;
}

.pb-camera-ptz__dir {
  width: 44px;
  height: 44px;
  padding: 0;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
  background: rgb(0 40 60 / 80%);
  border: 1px solid rgb(112 208 249 / 35%);
  border-radius: 6px;
  transition: background 0.15s, border-color 0.15s;
}

.pb-camera-ptz__dir:hover,
.pb-camera-ptz__dir.is-active {
  background: rgb(61 255 248 / 25%);
  border-color: #70d0f9;
}

.pb-camera-ptz__lens {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 8px;
  justify-content: center;
}

.pb-camera-ptz__lens-row {
  display: flex;
  gap: 6px;
  align-items: center;
}

.pb-camera-ptz__lens-label {
  width: 32px;
  font-size: 12px;
  color: rgb(255 255 255 / 75%);
}

.pb-camera-ptz__lens-btn {
  flex: 1;
  min-width: 36px;
  height: 32px;
  color: #fff;
  cursor: pointer;
  background: rgb(0 40 60 / 80%);
  border: 1px solid rgb(112 208 249 / 35%);
  border-radius: 6px;
}

.pb-camera-ptz__lens-btn:hover {
  border-color: #70d0f9;
}

.pb-camera-ptz__presets {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid rgb(255 255 255 / 12%);
}

.pb-camera-ptz__presets-title {
  margin-bottom: 8px;
  font-size: 13px;
}

.pb-camera-ptz__presets-row {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}
</style>
