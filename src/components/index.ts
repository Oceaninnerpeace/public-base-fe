/**
 * 组件出口
 * - 公共能力：@Oceaninnerpeace/public-base-components（GitHub Packages）
 * - 基座扩展：本目录下 Page / 验证码 / 裁剪上传等
 */

export {
  PbBadge,
  PbButton,
  PbCard,
  PbDivider,
  PbTag,
  PbModal,
  PbDrawer,
  PbLoading,
  PbEmpty,
  PbException,
  PbQueryBar,
  PbAdvancedSearch,
  PbTable,
  PbForm,
  PbDictSelect,
  PbUpload,
  PbPage,
  PbPageWrapper,
  /** 兼容旧命名 */
  PbModal as AppModal,
  PbDrawer as AppDrawer,
  PbForm as BasicForm,
  PbTable as ProTable,
  PbLoading as AppLoading,
  pbMessage,
  pbNotification,
  useLoading,
  useDebounceFn,
  exportTableCsv,
} from '@Oceaninnerpeace/public-base-components';

export type { FormSchema, QueryFieldSchema, PbTableColumn } from '@Oceaninnerpeace/public-base-components';

/** 403/404/500 优先用 PbException；coming-soon 等仍用本地 Fallback */
export { default as Fallback } from './Fallback/index.vue';

export { default as Page } from './Page/index.vue';
export { default as PageWrapper } from './PageWrapper/index.vue';
export { default as ColPage } from './ColPage/index.vue';
export { default as EllipsisText } from './EllipsisText/index.vue';
export { default as CountTo } from './CountTo/index.vue';
export { default as ApiComponent } from './ApiComponent/index.vue';
export { default as JsonViewer } from './JsonViewer/index.vue';
export { default as IconPicker } from './IconPicker/index.vue';
export { default as AccessControl } from './AccessControl/index.vue';
export { default as AuthButton } from './AuthButton/index.vue';
export { default as SliderCaptcha } from './SliderCaptcha/index.vue';
export type { CaptchaPassData, SliderCaptchaProps } from './SliderCaptcha/types';
export { default as ImageCaptcha } from './ImageCaptcha/index.vue';
export { default as ImageCropper } from './ImageCropper/index.vue';
/** 含裁剪能力，基座示例页使用；一般业务可用 PbUpload */
export { default as FileUpload } from './FileUpload/index.vue';
