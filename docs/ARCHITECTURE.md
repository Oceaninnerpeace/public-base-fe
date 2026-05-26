# 架构说明（最终完整版对齐）

## 四层架构

1. **基础工程层** — Vite、ESLint、主题、环境
2. **公共内核层** — 请求封装（`packages/public-request`）、异常监控、工具、存储
3. **通用组件层** — 二次封装 AntD 组件
4. **业务应用层** — Qiankun 子应用 / iframe 外接（自治）

## 公共 npm 包（本仓库）

| 包 | 路径 | 说明 |
|----|------|------|
| `@Oceaninnerpeace/public-base-request` | `packages/public-request` | 公共 Axios 工厂，**在此维护与发布** |
| `@Oceaninnerpeace/public-base-components` | `packages/public-components` | 公共中后台组件库（Pb* 组件） |

子应用通过 GitHub Packages 或 `file:../public-base-fe/packages/...` 引用。

## 基座 vs 子应用

| 能力 | 基座 | 子应用 |
|------|------|--------|
| 登录鉴权 | 无 | 独立 |
| 路由菜单 | 应用切换 + 容器 | 独立 |
| 请求 | 公共封装（可选） | 私有 Axios |
| 权限字典 | 无 | 独立 |
| 缓存 | 仅门户偏好 | `DRONE_` / `STATION_` 前缀 |

## 入口

- `/portal` — 应用中心
- `/micro/uav/*` — 无人机
- `/micro/power/*` — 智慧电站
