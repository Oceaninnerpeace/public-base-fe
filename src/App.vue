<script setup lang="ts">
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import { useEmbedStore } from '@/store/embed';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import { watchEffect } from 'vue';

dayjs.locale('zh-cn');

const embedStore = useEmbedStore();

watchEffect(() => {
  document.documentElement.classList.toggle('is-embed', embedStore.isEmbed);
});
</script>

<template>
  <a-config-provider :locale="zhCN">
    <router-view />
  </a-config-provider>
</template>
