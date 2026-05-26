# 发布 @Oceaninnerpeace/public-base-components

GitHub Packages：`https://npm.pkg.github.com`  
包名：`@Oceaninnerpeace/public-base-components`  
仓库：`https://github.com/Oceaninnerpeace/public-base-fe`（目录 `packages/public-components`）

---

## 1. 前置：代码已 push 到 GitHub

本地 `public-base-fe` 需已关联远程并推送：

```powershell
cd D:\code\public-base-fe
git push origin main
```

---

## 2. 创建 Token（classic）

GitHub → **Settings** → **Developer settings** → **Personal access tokens (classic)** → Generate new token

勾选：

- `repo`（私有仓库需要）
- `write:packages`
- `read:packages`

PowerShell（**与 `npm publish` 同一窗口**）：

```powershell
$env:GITHUB_TOKEN="ghp_你的token"
```

验证：

```powershell
$env:GITHUB_TOKEN.Length -gt 0
```

---

## 3. 配置 `.npmrc`

```powershell
cd D:\code\public-base-fe\packages\public-components
copy .npmrc.example .npmrc
```

内容：

```ini
@Oceaninnerpeace:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

> 勿将含 token 的 `.npmrc` 提交到 Git。

---

## 4. 发布

```powershell
cd D:\code\public-base-fe\packages\public-components
pnpm install
npm publish
```

`prepublishOnly` 会自动：构建 `dist/` → 切换 `exports` 指向 dist → 上传。

成功后：GitHub **Profile → Packages** 或仓库 **Packages** 标签可见。

---

## 5. 升级版本再发

编辑 `package.json`：

```json
"version": "0.1.1"
```

再执行 `npm publish`。

---

## 6. 子项目安装

项目根目录 `.npmrc`：

```ini
@Oceaninnerpeace:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

```powershell
$env:GITHUB_TOKEN="ghp_xxx"
cd D:\code\smart-power-admin
pnpm add @Oceaninnerpeace/public-base-components
```

使用：

```ts
import PublicBaseComponents from '@Oceaninnerpeace/public-base-components'
import '@Oceaninnerpeace/public-base-components/style.css'

app.use(PublicBaseComponents)
```

---

## 常见问题

| 问题 | 处理 |
|------|------|
| 401 Unauthorized | 同窗口设置 `$env:GITHUB_TOKEN`；或把 token 直接写入本地 `.npmrc` |
| 403 | Token 缺 `write:packages`；包名 scope 须为 `@Oceaninnerpeace` |
| 409 version exists | 提高 `version` 后再发 |
| 安装后找不到样式 | `import '@Oceaninnerpeace/public-base-components/style.css'` |
