<script setup lang="ts">
import PbCard from '../basic/PbCard.vue'

defineOptions({ name: 'PbPageWrapper' })

withDefaults(
  defineProps<{
    title?: string
    dense?: boolean
  }>(),
  {
    dense: false,
  },
)
</script>

<template>
  <div class="pb-page-wrapper" :class="{ 'pb-page-wrapper--dense': dense }">
    <PbCard :title="title" :bordered="true">
      <template v-if="$slots.title" #title>
        <slot name="title" />
      </template>
      <template v-if="$slots.extra" #extra>
        <slot name="extra" />
      </template>
      <slot />
    </PbCard>
  </div>
</template>

<style scoped>
.pb-page-wrapper {
  margin: 16px;
}

.pb-page-wrapper--dense {
  margin: 8px;
}
</style>
