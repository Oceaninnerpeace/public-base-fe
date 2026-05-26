<script setup lang="ts">
import { ref } from 'vue'

import type { MonitorPlaySource, MonitorPresetItem, PtzEventPayload } from '../../types/monitor'

import PbCameraPtz from './PbCameraPtz.vue'
import PbMonitorPlayer from './PbMonitorPlayer.vue'

defineOptions({ name: 'PbMonitorPanel' })

withDefaults(
  defineProps<{
    source?: MonitorPlaySource | null
    url?: string
    protocol?: MonitorPlaySource['protocol']
    showPtz?: boolean
    ptzDisabled?: boolean
    presets?: MonitorPresetItem[]
    playerHeight?: string
  }>(),
  {
    showPtz: true,
    ptzDisabled: false,
    presets: () => [],
    playerHeight: '400px',
  },
)

const emit = defineEmits<{
  ptz: [payload: PtzEventPayload]
  'preset-set': [presetId: number | string]
  'preset-goto': [presetId: number | string]
  screenshot: [blob: Blob]
  error: [error: Error]
}>()

const playerRef = ref<InstanceType<typeof PbMonitorPlayer>>()

defineExpose({
  getPlayer: () => playerRef.value,
})
</script>

<template>
  <div class="pb-monitor-panel">
    <div class="pb-monitor-panel__player" :style="{ height: playerHeight }">
      <PbMonitorPlayer
        ref="playerRef"
        :source="source"
        :url="url"
        :protocol="protocol"
        @screenshot="emit('screenshot', $event)"
        @error="emit('error', $event)"
      />
    </div>
    <PbCameraPtz
      v-if="showPtz"
      class="pb-monitor-panel__ptz"
      :disabled="ptzDisabled"
      :presets="presets"
      @ptz="emit('ptz', $event)"
      @preset-set="emit('preset-set', $event)"
      @preset-goto="emit('preset-goto', $event)"
    />
  </div>
</template>

<style scoped>
.pb-monitor-panel {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.pb-monitor-panel__player {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  border-radius: 8px;
}

.pb-monitor-panel__ptz {
  flex-shrink: 0;
}
</style>
