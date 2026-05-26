<script setup lang="ts">
import { PbException } from '@/components';
import { useRouter } from 'vue-router';

const router = useRouter();
</script>

<template>
  <PbException status="404" @back="router.push('/portal')" />
</template>
