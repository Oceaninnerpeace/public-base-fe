# 公共组件库

包名：`@Oceaninnerpeace/public-base-components`  
路径：`packages/public-components`

## 设计原则

1. **Ant Design Vue 二次封装**，统一交互与命名（`Pb` 前缀）
2. **业务无关**：字典、上传等通过 `loader` / `customUpload` 注入
3. **可按需引入或 `app.use` 全量注册**
4. **与 `public-base-request` 同级**，从主基座发布到 GitHub Packages

## 能力矩阵

| 场景 | 组件 / API |
|------|------------|
| 按钮防重复 | `PbButton` + `debounce` |
| 弹窗 / 抽屉 | `PbModal` / `PbDrawer` |
| 消息 / 通知 | `pbMessage` / `pbNotification` |
| 列表页 | `PbQueryBar` + `PbTable` |
| 复杂筛选 | `PbAdvancedSearch` |
| 表单页 | `PbForm` |
| 字典 | `PbDictSelect` |
| 上传 | `PbUpload` |
| 异常页 | `PbException` |
| 页面壳 | `PbPage` / `PbPageWrapper` |

## 本地开发

```bash
cd D:\code\public-base-fe
pnpm install
pnpm run build:components
```

## 子应用接入

```bash
pnpm add @Oceaninnerpeace/public-base-components
```

详见 `packages/public-components/README.md`。
