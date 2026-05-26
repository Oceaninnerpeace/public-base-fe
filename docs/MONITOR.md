# 监控视频组件（PbMonitor*）

基于 ZLMediaKit 转码后的 **HLS / WebRTC** 播放，云台交互对齐原 `dist/videos/cn` 海康 demo 编号。

## 安装（子应用）

```bash
pnpm add @Oceaninnerpeace/public-base-components hls.js
```

## 后端接口约定（建议）

### 1. 获取播放地址

```http
GET /api/camera/{cameraId}/play
```

```json
{
  "protocol": "hls",
  "url": "https://stream.example.com/live/cam1/hls.m3u8"
}
```

WebRTC（ZLMediaKit）：

```json
{
  "protocol": "webrtc",
  "url": "",
  "webrtc": {
    "apiUrl": "https://stream.example.com/index/api/webrtc?app=live&stream=cam1&type=play"
  }
}
```

### 2. 云台控制（替代前端直连设备 ISAPI）

```http
POST /api/camera/{cameraId}/ptz
```

```json
{
  "command": "move",
  "direction": 1,
  "speed": 4,
  "stop": false
}
```

`direction` 与海康一致：1上 2下 3左 4右 5左上 6左下 7右上 8右下 9自动。

`command` 还可为 `zoom` | `focus` | `iris`，配合 `zoom: "in"|"out"` 等。

### 3. 预置位

- `GET /api/camera/{cameraId}/presets` → 列表
- `POST .../presets` body `{ id }` 设置
- `POST .../presets/{id}/goto` 调用

## 组件用法

### 仅播放器

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { PbMonitorPlayer } from '@Oceaninnerpeace/public-base-components'
import type { MonitorPlaySource } from '@Oceaninnerpeace/public-base-components'

const source = ref<MonitorPlaySource | null>(null)

onMounted(async () => {
  const { data } = await fetch('/api/camera/1/play').then((r) => r.json())
  source.value = data
})
</script>

<template>
  <PbMonitorPlayer :source="source" style="height: 400px" @screenshot="onShot" />
</template>
```

HLS 简写：

```vue
<PbMonitorPlayer url="https://xxx/live/cam1/hls.m3u8" protocol="hls" />
```

### 播放器 + 云台（PbMonitorPanel）

```vue
<script setup lang="ts">
import { PbMonitorPanel } from '@Oceaninnerpeace/public-base-components'
import type { PtzEventPayload } from '@Oceaninnerpeace/public-base-components'

async function onPtz(payload: PtzEventPayload) {
  await fetch(`/api/camera/${cameraId}/ptz`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}
</script>

<template>
  <PbMonitorPanel
    :source="playSource"
    :presets="presetList"
    :ptz-disabled="!hasPtz"
    @ptz="onPtz"
    @preset-goto="(id) => gotoPreset(id)"
  />
</template>
```

### 暴露方法

```ts
const playerRef = ref<InstanceType<typeof PbMonitorPlayer>>()
await playerRef.value?.reload()
await playerRef.value?.screenshot()
```

## 与 dist 老项目对照

| dist | 新方案 |
|------|--------|
| WebVideoCtrl 插件预览 | `PbMonitorPlayer` + ZLM HLS/WebRTC |
| `mouseDownPTZControl(1-9)` | `PbCameraPtz` → `@ptz` → 后端 ISAPI |
| `clickCapturePic` | 工具栏截图 / `captureVideoFrame` |
| `videodemo.html` RTMP+VLC 红外 | 后端单独返回红外流 `publishUrl`（HLS） |
| sessionStorage 传参 | Vue props + API |

## Qiankun 子应用

组件放在子应用内使用即可，静态资源随子应用构建；无需 iframe + 插件。
