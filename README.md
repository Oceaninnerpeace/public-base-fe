# public-base-fe · 公共微前端基座

公司级**门户容器**主应用，负责统一平台体验与 Qiankun 子应用调度；**不参与**业务登录、业务权限、业务菜单。

## 子应用

| 系统 | 路径 | 本地工程 |
|------|------|----------|
| 无人机 | `/micro/uav` | `D:\code\drone-system` |
| 智慧电站 | `/micro/power` | `D:\code\smart-power-admin` |

配置：`src/config/portal-apps.ts`

## 快速开始

```bash
# 1. 启动子应用（端口见 portal-apps / .env.development）
cd D:\code\drone-system && pnpm dev
cd D:\code\smart-power-admin && pnpm dev

# 2. 启动基座
cd D:\code\public-base-fe
pnpm install
pnpm dev
```

浏览器打开基座地址 → **应用中心** 或顶栏切换应用。各子应用内使用**各自账号**登录。

## 环境变量

```env
VITE_MICRO_ENABLED=true
VITE_MICRO_DRONE_ENTRY=//localhost:5666
VITE_MICRO_POWER_ENTRY=//localhost:5177
```

## 文档

- [docs/BASE_SPEC.md](./docs/BASE_SPEC.md) — 与最终版技术文档对齐说明
- [docs/MICRO.md](./docs/MICRO.md) — 微前端接入
- [docs/EMBED.md](./docs/EMBED.md) — iframe 外接

## 技术栈

Vue3 · TS · Vite · Pinia · Ant Design Vue · Tailwind · Qiankun
