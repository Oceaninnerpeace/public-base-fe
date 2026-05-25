# 环境变量说明

## 文件约定

| 文件 | 用途 |
|------|------|
| `.env` | 所有环境公共默认值 |
| `.env.development` | `pnpm dev` |
| `.env.test` | `pnpm dev:test` / `pnpm build:test` |
| `.env.staging` | `pnpm build:staging` |
| `.env.production` | `pnpm build` |
| `.env.local` | 本地私有覆盖（不提交 git） |
| `.env.example` | 示例模板 |

Vite 加载顺序：`.env` → `.env.[mode]` → `.env.local` → `.env.[mode].local`

## 常用变量

| 变量 | 说明 |
|------|------|
| `VITE_APP_TITLE` | 应用标题 |
| `VITE_GLOB_API_URL` | 接口 baseURL（开发一般为 `/api`） |
| `VITE_PROXY_TARGET` | 开发代理目标后端地址 |
| `VITE_USE_MOCK` | `true` 时走前端 Mock |
| `VITE_PORT` | 开发端口 |
| `VITE_BUILD_DROP_CONSOLE` | 生产构建移除 console |

## 代码中读取

```ts
import { appEnv } from '@/config';

console.log(appEnv.apiUrl, appEnv.useMock, appEnv.mode);
```

## 命令

```bash
pnpm dev              # development
pnpm dev:test         # test 配置本地调试
pnpm build            # production
pnpm build:staging    # staging
pnpm build:test       # test
```

## 对接后端

1. 修改对应环境的 `VITE_GLOB_API_URL`
2. 开发环境设置 `VITE_PROXY_TARGET` 指向真实后端
3. 设置 `VITE_USE_MOCK=false`
