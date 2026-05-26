# 公共组件

从 `D:\code\vue-vben-admin` 的 `packages/effects/common-ui` 等模块移植，并做以下调整：

- UI 改为 **Ant Design Vue**
- 去除 `@vben/*`、`Vben*` 等命名与依赖
- 单文件可直接使用，无需 monorepo

## 使用

```ts
import { Page, ProTable, PbQueryBar, ApiComponent, AccessControl, useModal } from '@/components';
```

## 验证码 / 图片 / 上传

| 组件 | 说明 |
|------|------|
| `SliderCaptcha` | 滑块验证码（登录页） |
| `ImageCaptcha` | 图形字符验证码 |
| `ImageCropper` | 图片裁剪（支持比例锁定） |
| `PbQueryBar` / `PbTable` / `PbForm` | 来自 `@Oceaninnerpeace/public-base-components` |
| `FileUpload` | 基座扩展：上传（预览、裁剪） |

```vue
<SliderCaptcha v-model="passed" @success="onSuccess" />
<FileUpload v-model:file-list="list" crop aspect-ratio="1:1" :max-size="2" />
<ImageCropper :img="url" aspect-ratio="16:9" ref="cropperRef" />
```

## 指令

- `v-auth` / `v-access`：按钮级权限（隐藏无权限元素）
- `v-loading`：标记需相对定位（推荐直接用 `<AppLoading>`）
