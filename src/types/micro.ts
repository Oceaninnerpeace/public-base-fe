export interface MicroAppConfig {
  name: string;
  entry: string;
  activeRule: string;
  container?: string;
  props?: Record<string, unknown>;
}
