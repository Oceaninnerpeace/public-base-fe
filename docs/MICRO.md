# 微前端子应用接入

主应用 `public-base-fe` 为**门户容器**，通过 Qiankun 调度子应用，**不向子应用注入 Token**。

## 子应用清单

| 业务 | 本地路径 | Qiankun name | 激活路由 | 存储前缀 | 开发端口 |
|------|----------|--------------|----------|----------|----------|
| 无人机系统 | `D:\code\drone-system` | `drone-system` | `/micro/uav` | `DRONE_` | 5666 |
| 智慧电站 | `D:\code\smart-power-admin` | `smart-power-admin` | `/micro/power` | `STATION_` | 5177 |

注册表：`src/config/portal-apps.ts`

## 启动顺序（三个终端）

```bash
# 1. 无人机
cd D:\code\drone-system && pnpm dev

# 2. 智慧电站
cd D:\code\smart-power-admin && pnpm dev

# 3. 基座
cd D:\code\public-base-fe && pnpm dev
```

浏览器打开基座 → `/portal` 或顶栏切换应用。在子应用内使用**各自账号**登录。

## 环境变量（基座 `.env.development`）

```env
VITE_MICRO_ENABLED=true
VITE_MICRO_DRONE_ENTRY=//localhost:5666
VITE_MICRO_POWER_ENTRY=//localhost:5177
```

## 子应用改造要点

1. `vite-plugin-qiankun`，`name` 与 `portal-apps.ts` 中 `name` 一致
2. 路由 `base`：无人机 `/micro/uav/`，电站 `/micro/power`
3. 门户模式（`poweredByPortal`）保留子应用顶栏与侧栏；仅 `embed=1` 外接时隐藏壳子
4. Token、权限、字典、菜单均在子应用内实现；`localStorage` 使用 `DRONE_` / `STATION_` 前缀

## 子应用如何调用基座方法

Qiankun 在 **mount** 时把基座能力通过 `props` 传给子应用，不要用 `window.parent.xxx` 直接调基座代码。

### 1. props.portal（推荐）

基座 `src/micro/portal-bridge.ts` 注入：

| 方法 | 说明 |
|------|------|
| `portal.goPortal()` | 跳转应用中心 `/portal` |
| `portal.switchApp('power')` | 切换子应用（id 见 `portal-apps.ts`） |
| `portal.getHostPath()` | 当前基座路由 |
| `portal.globalActions` | Qiankun 全局状态 API |

智慧电站示例（`mount` 里已 `bindPortalHost(props)`）：

```ts
import { getPortalHost } from '@/utils/portal-host'

const portal = getPortalHost()
portal?.goPortal()
portal?.switchApp('drone')
```

### 2. globalActions（状态通信）

适合主题、语言、通知等**跨应用共享状态**，不适合代替各自业务 API。

```ts
// 子应用监听基座状态
props.portal?.globalActions.onGlobalStateChange((state, prev) => {
  console.log(state, prev)
}, true)

// 子应用更新（基座与其它子应用也会收到）
props.portal?.globalActions.setGlobalState({ locale: 'zh-CN' })
```

基座侧在 `setupPortalGlobalState` 后也可 `onGlobalStateChange` 监听子应用上报。

### 3. 基座扩展自定义方法

在 `createPortalBridge(router)` 里增加方法，例如 `openHelp()`，一并挂在 `portal` 上；子应用扩展 `PortalBridge` 类型即可。

### 注意

- **不要**在子应用里 `import` 基座源码（构建、沙箱、版本都会耦合）。
- **登录 / Token / 业务接口** 仍在子应用内完成，基座不传 `getToken`。
- 仅 iframe 外接 `?embed=1` 时用 URL 参数通信（见 `docs/EMBED.md`）。

## 无人机白屏排查

| 现象 | 原因 | 处理 |
|------|------|------|
| 整页空白 | 基座 `strictStyleIsolation: true` | 已关闭；Vben/AntD 样式无法进 Shadow DOM |
| 一直转圈/白底 | 子应用 `#__app-loading__` 未移除 | `qiankun-lifecycle` 在容器内移除 loading |
| `Target container ... not existed` | Qiankun 早于 Vue 挂载 / 容器在异步路由里 | 容器在 `BasicLayout`；`setupMicroApps` 在 `app.mount` 之后；`beforeLoad` 轮询等待 |
| 跳到登录也空白 | 子应用未启动或端口不对 | 先 `pnpm dev` 无人机 `:5666` |

独立访问 `http://localhost:5666` 正常、仅基座内白屏时，优先重启基座后再试。
