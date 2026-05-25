<script setup lang="ts">
import { ImageCaptcha, SliderCaptcha } from '@/components';
import { useUserStore } from '@/store/user';
import { message } from 'ant-design-vue';
import { reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

const form = reactive({
  username: 'admin',
  password: '123456',
  captchaInput: '',
});

const loading = ref(false);
const captchaPassed = ref(false);
const imageCaptchaRef = ref<InstanceType<typeof ImageCaptcha>>();

async function onSubmit() {
  if (!captchaPassed.value) {
    message.warning('请先完成滑块验证');
    return;
  }
  if (!imageCaptchaRef.value?.validate(form.captchaInput)) {
    message.error('图形验证码错误');
    imageCaptchaRef.value?.refresh();
    return;
  }
  loading.value = true;
  try {
    await userStore.login(form);
    message.success('登录成功');
    const redirect = (route.query.redirect as string) || '/';
    router.replace(redirect);
  } catch (e) {
    message.error((e as Error).message || '登录失败');
  } finally {
    loading.value = false;
  }
}

function onCaptchaSuccess() {
  captchaPassed.value = true;
}
</script>

<template>
  <div class="login-page">
    <a-card title="Vue Admin Template" class="login-page__card">
      <a-form layout="vertical" :model="form" @finish="onSubmit">
        <a-form-item label="用户名" name="username" :rules="[{ required: true }]">
          <a-input v-model:value="form.username" placeholder="admin / user" />
        </a-form-item>
        <a-form-item label="密码" name="password" :rules="[{ required: true }]">
          <a-input-password v-model:value="form.password" />
        </a-form-item>
        <a-form-item label="滑块验证">
          <SliderCaptcha v-model="captchaPassed" @success="onCaptchaSuccess" />
        </a-form-item>
        <a-form-item label="图形验证码" name="captchaInput" :rules="[{ required: true }]">
          <a-space>
            <a-input v-model:value="form.captchaInput" placeholder="输入验证码" style="width: 160px" />
            <ImageCaptcha ref="imageCaptchaRef" />
          </a-space>
        </a-form-item>
        <a-button type="primary" html-type="submit" block :loading="loading">登录</a-button>
      </a-form>
      <p class="login-page__tip">演示：admin 全权限 / user 部分权限</p>
    </a-card>
  </div>
</template>

<style scoped lang="less">
.login-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #1677ff 0%, #69b1ff 100%);

  &__card {
    width: 420px;
  }

  &__tip {
    margin-top: 12px;
    color: @text-color-secondary;
    font-size: 12px;
    text-align: center;
  }
}
</style>
