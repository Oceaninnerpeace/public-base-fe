<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ name: 'PbException' })

const props = withDefaults(
  defineProps<{
    status?: '403' | '404' | '500'
    title?: string
    description?: string
    showBack?: boolean
  }>(),
  {
    status: '404',
    showBack: true,
  },
)

const emit = defineEmits<{ back: []; refresh: [] }>()

const resultStatus = computed(() => Number(props.status) as 403 | 404 | 500)

const defaultTitle = computed(() => {
  const map = { '403': '403', '404': '404', '500': '500' } as const
  return props.title ?? map[props.status]
})

const defaultDesc = computed(() => {
  const map = {
    '403': '抱歉，您无权访问该页面',
    '404': '抱歉，您访问的页面不存在',
    '500': '抱歉，服务器出错了',
  } as const
  return props.description ?? map[props.status]
})
</script>

<template>
  <a-result :status="resultStatus" :title="defaultTitle" :sub-title="defaultDesc">
    <template #extra>
      <slot name="action">
        <a-button v-if="showBack && status !== '500'" type="primary" @click="emit('back')">
          返回
        </a-button>
        <a-button v-if="status === '500'" type="primary" @click="emit('refresh')">刷新</a-button>
      </slot>
    </template>
  </a-result>
</template>
