import type { Config } from 'tailwindcss';

/** 与 Ant Design Vue 共存：关闭 preflight，避免覆盖 antd 基础样式 */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        primary: '#1677ff',
      },
    },
  },
} satisfies Config;
