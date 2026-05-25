<script setup lang="ts">
import { computed, onMounted, onUpdated, ref } from 'vue';

const props = withDefaults(
  defineProps<{
    line?: number;
    maxWidth?: number | string;
    placement?: 'top' | 'left' | 'right' | 'bottom';
    tooltip?: boolean;
    tooltipWhenEllipsis?: boolean;
    expand?: boolean;
  }>(),
  {
    line: 1,
    maxWidth: '100%',
    placement: 'top',
    tooltip: true,
    tooltipWhenEllipsis: false,
    expand: false,
  },
);

const emit = defineEmits<{ expandChange: [boolean] }>();

const textRef = ref<HTMLElement>();
const isExpand = ref(false);
const isEllipsis = ref(false);

const maxWidthStyle = computed(() =>
  typeof props.maxWidth === 'number' ? `${props.maxWidth}px` : props.maxWidth,
);

const showTooltip = computed(() => {
  if (!props.tooltip || isExpand.value) return false;
  if (props.tooltipWhenEllipsis) return isEllipsis.value;
  return true;
});

function checkEllipsis() {
  const el = textRef.value;
  if (!el || !props.tooltipWhenEllipsis) return;
  const w = el.scrollWidth - el.clientWidth;
  const h = el.scrollHeight - el.clientHeight;
  isEllipsis.value = props.line === 1 ? w > 3 : h > 3;
}

function toggleExpand() {
  if (!props.expand) return;
  isExpand.value = !isExpand.value;
  emit('expandChange', isExpand.value);
  checkEllipsis();
}

onMounted(checkEllipsis);
onUpdated(checkEllipsis);
</script>

<template>
  <a-tooltip v-if="showTooltip" :placement="placement">
    <template #title>
      <slot name="tooltip">
        <slot />
      </slot>
    </template>
    <div
      ref="textRef"
      class="ellipsis-text"
      :class="{ 'ellipsis-text--multi': line > 1 && !isExpand, 'ellipsis-text--click': expand }"
      :style="{
        maxWidth: maxWidthStyle,
        WebkitLineClamp: isExpand ? 'unset' : line,
      }"
      @click="toggleExpand"
    >
      <slot />
    </div>
  </a-tooltip>
  <div
    v-else
    ref="textRef"
    class="ellipsis-text"
    :class="{ 'ellipsis-text--multi': line > 1 && !isExpand, 'ellipsis-text--click': expand }"
    :style="{
      maxWidth: maxWidthStyle,
      WebkitLineClamp: isExpand ? 'unset' : line,
    }"
    @click="toggleExpand"
  >
    <slot />
  </div>
</template>

<style scoped lang="less">
.ellipsis-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &--multi {
    display: -webkit-box;
    white-space: normal;
    -webkit-box-orient: vertical;
  }

  &--click {
    cursor: pointer;
  }
}
</style>
