<template>
  <t-form
    ref="form"
    :class="['item-container', `login-${type}`]"
    :data="formData"
    :rules="FORM_RULES"
    label-width="0"
    @submit="onSubmitWithRecaptcha"
  >
    <template v-if="type == 'password'">
      <t-form-item name="account">
        <t-input v-model="formData.account" size="large" placeholder="请输入账号：admin">
          <template #prefix-icon>
            <t-icon name="user" />
          </template>
        </t-input>
      </t-form-item>

      <t-form-item name="password">
        <t-input
          v-model="formData.password"
          size="large"
          :type="showPsw ? 'text' : 'password'"
          clearable
          placeholder="请输入登录密码：admin"
        >
          <template #prefix-icon>
            <t-icon name="lock-on" />
          </template>
          <template #suffix-icon>
            <t-icon :name="showPsw ? 'browse' : 'browse-off'" @click="showPsw = !showPsw" />
          </template>
        </t-input>
      </t-form-item>

      <div class="check-container remember-pwd">
        <t-checkbox>记住账号</t-checkbox>
        <span class="tip">忘记账号？</span>
      </div>
    </template>

    <!-- 扫码登陆 -->
    <template v-else-if="type == 'qrcode'">
      <div class="tip-container">
        <span class="tip">请使用APP扫一扫登录</span>
        <span class="refresh">刷新<t-icon name="refresh" /> </span>
      </div>
      <qrcode-vue value="敬请期待" :size="192" level="H" />
    </template>

    <t-form-item v-if="type !== 'qrcode'" class="btn-container">
      <t-button block size="large" type="submit" :loading="loginBtnLoadding"> {{ loginBtnText }} </t-button>
    </t-form-item>

    <div class="switch-container">
      <span v-if="type !== 'password'" class="tip" @click="switchType('password')">使用账号密码登录</span>
      <span v-if="type !== 'qrcode'" class="tip" @click="switchType('qrcode')">使用APP扫码登录</span>
    </div>
  </t-form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import QrcodeVue from 'qrcode.vue';
import { MessagePlugin, NotifyPlugin } from 'tdesign-vue-next';
import type { FormInstanceFunctions, FormRule } from 'tdesign-vue-next';
import { useCounter } from '@/hooks';
import { getPermissionStore, UserLoginParam, useUserStore } from '@/store';
import { globleWebsocketStart } from '@/utils/ws';

const userStore = useUserStore();

const INITIAL_DATA = {
  phone: '',
  email: '',
  account: 'admin',
  password: '123456',
  verifyCode: '',
  checked: false,
};

const FORM_RULES: Record<string, FormRule[]> = {
  phone: [{ required: true, message: '手机号必填', type: 'error' }],
  account: [{ required: true, message: '账号必填', type: 'error' }],
  password: [{ required: true, message: '密码必填', type: 'error' }],
  verifyCode: [{ required: true, message: '验证码必填', type: 'error' }],
};

const type = ref('password');
const permissionStore = getPermissionStore();
const form = ref<FormInstanceFunctions>();
const formData = ref({ ...INITIAL_DATA });
const showPsw = ref(false);

const [countDown, handleCounter] = useCounter();

const switchType = (val: string) => {
  type.value = val;
};

const recaptchaCode = ref('');
const loginBtnLoadding = ref(false);
const loginBtnText = ref('登录');
const router = useRouter();
const route = useRoute();

const onSubmitWithRecaptcha = async ({ validateResult }) => {
  if (validateResult === true) {
    loginBtnLoadding.value = true;
    loginBtnText.value = '人机校验中...';
    //@ts-ignore
    window.grecaptcha.ready(() => {
      //@ts-ignore
      window.grecaptcha
        .execute('6LfSuiUiAAAAAM4N4hjEAnaHL6vQi1eGCRgqXvmf', { action: 'submit' })
        .then(async (token: string) => {
          loginBtnText.value = '登录中...';
          recaptchaCode.value = token;
          await permissionStore.clearRoutes();
          await onSubmit({ validateResult: true });
          loginBtnText.value = '登录';
        })
        .catch((err) => {
          loginBtnLoadding.value = false;
          loginBtnText.value = '登录';
          MessagePlugin.error('人机验证失败');
        });
    });
  }
};

const onSubmit = async ({ validateResult }) => {
  if (validateResult === true) {
    try {
      let userLoginParam: UserLoginParam = {
        username: formData.value.account,
        password: formData.value.password,
        phone: '',
        email: '',
        verification: recaptchaCode.value,
      };

      let res = await userStore.login(userLoginParam);
      loginBtnLoadding.value = false;
      MessagePlugin.success('登陆成功');
      NotifyPlugin.success({
        closeBtn: true,
        title: '登陆成功',
        content: `上次登录时间 : ${res.lastLoginTime}`,
        footer: `上次登录IP : ${res.lastLoginIp}`,
        duration: 5000,
      });
      const redirect = route.query.redirect as string;
      const redirectUrl = redirect ? decodeURIComponent(redirect) : '/home';
      globleWebsocketStart();
      router.push(redirectUrl);
    } catch (e) {
      loginBtnLoadding.value = false;
      MessagePlugin.error(e.message);
    }
  }
};
</script>

<style lang="less" scoped>
@import url('../index.less');
</style>
