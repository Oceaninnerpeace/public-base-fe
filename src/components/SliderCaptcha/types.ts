import type { CSSProperties } from 'vue';

export interface SliderCaptchaProps {
  class?: string;
  actionStyle?: CSSProperties;
  barStyle?: CSSProperties;
  contentStyle?: CSSProperties;
  wrapperStyle?: CSSProperties;
  successText?: string;
  text?: string;
}

export interface CaptchaPassData {
  isPassing: boolean;
  time: string;
}
