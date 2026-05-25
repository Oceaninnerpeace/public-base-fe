# @Oceaninnerpeace/public-base-request

**公共 Axios 封装 · 源码在主基座 `public-base-fe`**

供基座与各子应用通过 `createRequest` / `createHttpClient` 创建**独立实例**（各自 baseURL、Token、401 跳转）。

## 安装

```bash
# 子应用本地联调（与 public-base-fe 同级目录）
pnpm add @Oceaninnerpeace/public-base-request@file:../public-base-fe/packages/public-request

# GitHub Packages（见 PUBLISH_GITHUB.md）
pnpm add @Oceaninnerpeace/public-base-request
```

## 发布

在 **主基座** 目录：

```bash
cd D:\code\public-base-fe\packages\public-request
npm publish
```

详见 [PUBLISH_GITHUB.md](./PUBLISH_GITHUB.md)
