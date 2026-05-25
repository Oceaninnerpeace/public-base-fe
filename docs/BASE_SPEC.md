# 前端公共微前端基座建设规范（落地版）

对照《前端公共微前端基座建设落地技术文档（最终完整版）》的本仓库实现说明。

## 架构定位

| 层级 | 职责 |
|------|------|
| 基座 `public-base-fe` | 统一门户、应用切换、布局容器、Qiankun 调度、工程规范 |
| 子应用 | 独立登录、路由、权限、字典、请求实例、存储前缀 |

**基座永久关闭**：全局登录、全局 Token、全局路由守卫鉴权、动态业务菜单、全局用户/权限/字典。

## 子应用注册

配置：`src/config/portal-apps.ts`

| 应用 | 仓库 | 存储前缀 | 路由 |
|------|------|----------|------|
| 无人机 | `drone-system` | `DRONE_` | `/micro/uav` |
| 智慧电站 | `smart-power-admin` | `STATION_` | `/micro/power` |

## 防串登

- 子应用 Token/缓存必须带业务前缀（见上表）
- 子应用独立 Axios 实例，禁止复用基座请求做业务鉴权
- Qiankun 开启 `strictStyleIsolation`
- 基座不向子应用 `props` 注入 Token

## 启动

```bash
# 子应用先启动
cd D:\code\drone-system && pnpm dev      # :5666
cd D:\code\smart-power-admin && pnpm dev # :5177

# 基座
cd D:\code\public-base-fe && pnpm dev    # :5173
```

访问 `/portal` 进入应用中心，或顶栏切换子应用。

## iframe 外接

`?embed=1` 隐藏基座布局，仅展示内容区。外系统通信见 `docs/EMBED.md`。
