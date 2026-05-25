import type { RouteMeta } from './router';

export {};

declare module 'vue-router' {
  interface RouteMeta extends RouteMeta {}
}
