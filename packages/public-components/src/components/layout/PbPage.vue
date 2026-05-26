<script setup lang="ts">
import PbLoading from '../feedback/PbLoading.vue'

defineOptions({ name: 'PbPage' })

withDefaults(
  defineProps<{
    title?: string
    subTitle?: string
    loading?: boolean
  }>(),
  {
    loading: false,
  },
)
</script>

<template>
  <div class="pb-page">
    <a-page-header v-if="title || $slots.title" :title="title" :sub-title="subTitle">
      <template v-if="$slots.title" #title>
        <slot name="title" />
      </template>
      <template v-if="$slots.extra" #extra>
        <slot name="extra" />
      </template>
    </a-page-header>
    <PbLoading :spinning="loading">
      <div class="pb-page__body">
        <slot />
      </div>
    </PbLoading>
  </div>
</template>

<style scoped>
.pb-page__body {
  padding: 0 16px 16px;
}
</style>
