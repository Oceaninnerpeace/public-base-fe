# @Oceaninnerpeace/public-base-components

公司公共中后台组件库（基于 **Vue 3 + Ant Design Vue 4** 二次封装）。

## 安装

```bash
pnpm add @Oceaninnerpeace/public-base-components
```

需同时安装 peer：`vue`、`ant-design-vue`、`@ant-design/icons-vue`。

## 使用

```ts
// main.ts
import PublicBaseComponents from '@Oceaninnerpeace/public-base-components'
import '@Oceaninnerpeace/public-base-components/style.css'
import 'ant-design-vue/dist/reset.css'

app.use(PublicBaseComponents)
```

或按需引入：

```vue
<script setup lang="ts">
import { PbTable, PbQueryBar, pbMessage } from '@Oceaninnerpeace/public-base-components'
</script>
```

## 组件清单

| 分类 | 组件 | 说明 |
|------|------|------|
| 基础 | `PbButton` | 按钮，支持 `debounce` 防重复点击 |
| | `PbCard` / `PbDivider` / `PbTag` / `PbBadge` | 展示类 |
| 反馈 | `PbModal` / `PbDrawer` / `PbLoading` | 弹窗、抽屉、加载 |
| | `pbMessage` / `pbNotification` | 消息、通知 |
| 展示 | `PbEmpty` | 空状态 |
| 异常 | `PbException` | `status`: 403 / 404 / 500 |
| 业务 | `PbQueryBar` | 通用查询栏，支持防抖 |
| | `PbAdvancedSearch` | 高级搜索（展开/收起） |
| | `PbTable` | 分页表格，排序、导出 CSV |
| | `PbForm` | Schema 表单，内置校验 |
| | `PbDictSelect` | 字典下拉（注入 `loader`） |
| | `PbUpload` | 文件上传 |
| 布局 | `PbPage` / `PbPageWrapper` | 页面容器 |

## 工具

- `debounce` / `useDebounceFn`
- `exportTableCsv` — 表格导出
- `requiredRule` / `mergeRules` — 表单校验辅助
- `useLoading` — 异步 loading

## 字典下拉示例

```vue
<PbDictSelect
  v-model="status"
  dict-code="user_status"
  :loader="(code) => fetchDictOptions(code)"
/>
```

## 表格示例

```vue
<PbQueryBar v-model="query" :fields="fields" @search="tableRef?.reload()" />
<PbTable
  ref="tableRef"
  :columns="columns"
  :search-params="query"
  :request="({ page, pageSize }) => api.getList({ page, pageSize, ...query })"
/>
```

## 发布

在 `public-base-fe/packages/public-components` 执行 `npm publish`（同 `public-base-request`）。
