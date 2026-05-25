<script setup lang="ts">
import { onMounted, ref } from 'vue';

const props = withDefaults(
  defineProps<{
    length?: number;
    width?: number;
    height?: number;
  }>(),
  {
    length: 4,
    width: 120,
    height: 40,
  },
);

const code = ref('');
const canvasRef = ref<HTMLCanvasElement>();

function randomCode() {
  const chars = 'ABCDEFGHJKMNPQRSTWXYZ23456789';
  let s = '';
  for (let i = 0; i < props.length; i++) {
    s += chars[Math.floor(Math.random() * chars.length)];
  }
  code.value = s;
  draw();
}

function draw() {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  canvas.width = props.width;
  canvas.height = props.height;
  ctx.fillStyle = '#f0f2f5';
  ctx.fillRect(0, 0, props.width, props.height);
  for (let i = 0; i < 4; i++) {
    ctx.strokeStyle = `hsl(${Math.random() * 360}, 60%, 60%)`;
    ctx.beginPath();
    ctx.moveTo(Math.random() * props.width, Math.random() * props.height);
    ctx.lineTo(Math.random() * props.width, Math.random() * props.height);
    ctx.stroke();
  }
  ctx.font = 'bold 22px sans-serif';
  ctx.fillStyle = '#1677ff';
  ctx.textBaseline = 'middle';
  const gap = props.width / (props.length + 1);
  for (let i = 0; i < code.value.length; i++) {
    const x = gap * (i + 1);
    const y = props.height / 2 + (Math.random() - 0.5) * 8;
    const angle = (Math.random() - 0.5) * 0.4;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.fillText(code.value[i]!, 0, 0);
    ctx.restore();
  }
}

function validate(input: string) {
  return input.trim().toUpperCase() === code.value;
}

onMounted(randomCode);

defineExpose({ refresh: randomCode, validate, getCode: () => code.value });
</script>

<template>
  <div class="image-captcha">
    <canvas ref="canvasRef" class="image-captcha__canvas" @click="randomCode" />
    <a-button type="link" size="small" @click="randomCode">换一张</a-button>
  </div>
</template>

<style scoped lang="less">
.image-captcha {
  display: inline-flex;
  gap: 4px;
  align-items: center;

  &__canvas {
    cursor: pointer;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
  }
}
</style>
