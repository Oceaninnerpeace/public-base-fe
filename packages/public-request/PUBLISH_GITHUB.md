# 发布 @Oceaninnerpeace/public-base-request

**源码归属：主基座 `public-base-fe/packages/public-request`**（公共能力，子应用通过 npm / file 引用）

GitHub Packages：`https://npm.pkg.github.com`  
包名：`@Oceaninnerpeace/public-base-request`

---

## 1. 创建 Token（classic）

GitHub → Settings → Developer settings → **Tokens (classic)** → Generate new token

勾选：`repo`、`write:packages`、`read:packages`

```powershell
$env:GITHUB_TOKEN="ghp_你的token"
```

---

## 2. 配置 `.npmrc`

```powershell
cd D:\code\public-base-fe\packages\public-request
copy .npmrc.example .npmrc
```

---

## 3. 发布（在基座仓库）

```powershell
cd D:\code\public-base-fe\packages\public-request
pnpm install
npm publish
```

仓库地址：`https://github.com/Oceaninnerpeace/public-base-fe`

---

## 4. 子应用安装

**已发布到 GitHub：**

```ini
# 项目 .npmrc
@Oceaninnerpeace:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

```bash
pnpm add @Oceaninnerpeace/public-base-request
```

**本地联调（与智慧电站同盘）：**

```json
"@Oceaninnerpeace/public-base-request": "file:../public-base-fe/packages/public-request"
```

---

## 5. 使用

```ts
import { createRequest, createHttpClient } from '@Oceaninnerpeace/public-base-request'
```

基座：`resolveWithBusinessData: true`  
子应用：注入 `getToken`、`onUnauthorized`、`baseURL`
