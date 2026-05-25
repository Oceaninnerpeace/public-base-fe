<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const props = withDefaults(
  defineProps<{
    status?: '403' | '404' | '500' | 'coming-soon' | 'offline';
    title?: string;
    description?: string;
    homePath?: string;
    showBack?: boolean;
  }>(),
  {
    status: 'coming-soon',
    homePath: '/',
    showBack: true,
  },
);

const router = useRouter();

const resultStatus = computed(() => {
  if (props.status === 'coming-soon' || props.status === 'offline') return 'info';
  return Number(props.status) as 403 | 404 | 500;
});

const defaultTitle = computed(() => {
  const map: Record<string, string> = {
    '403': '403',
    '404': '404',
    '500': '500',
    'coming-soon': '敬请期待',
    offline: '网络异常',
  };
  return props.title || map[props.status] || '';
});

const defaultDesc = computed(() => {
  const map: Record<string, string> = {
    '403': '抱歉，您无权访问该页面',
    '404': '抱歉，您访问的页面不存在',
    '500': '抱歉，服务器出错了',
    'coming-soon': '该功能正在开发中',
    offline: '请检查网络后重试',
  };
  return props.description || map[props.status] || '';
});

function backHome() {
  router.push(props.homePath);
}

function refresh() {
  location.reload();
}
</script>

<template>
  <a-result :status="resultStatus" :title="defaultTitle" :sub-title="defaultDesc">
    <template #extra>
      <slot name="action">
        <a-button v-if="showBack && (status === '403' || status === '404')" type="primary" @click="backHome">
          返回首页
        </a-button>
        <a-button v-else-if="status === '500' || status === 'offline'" type="primary" @click="refresh">
          刷新
        </a-button>
      </slot>
    </template>
  </a-result>
</template>
