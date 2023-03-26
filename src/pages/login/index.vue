<template>
  <div class="login-wrapper">
    <Header />
    <div class="login-container">
      <div class="title-container">
        <h1 class="title margin-no">登录到</h1>
        <h1 class="title">ZP-ADMIN</h1>
        <div class="sub-title">
          <p class="tip">{{ '账号:admin 密码:123456' }}</p>
          <p class="tip"></p>
        </div>
      </div>

      <login />
    </div>
  </div>
</template>
<script lang="ts">
export default {
  name: 'LoginIndex',
};
</script>
<script setup lang="ts">
import { ref } from 'vue';

import Login from './components/Login.vue';
import Register from './components/Register.vue';
import LoginHeader from './components/Header.vue';
import TdesignSetting from '@/layouts/setting.vue';
import { useNotificationStore, usePermissionStore, useSettingStore, useTabsRouterStore, useUserStore } from '@/store';
import Header from '@/pages/login/components/Header.vue';

const clearLocalStorage = () => {
  useUserStore().$reset();
  useTabsRouterStore().$reset();
  useSettingStore().resetConfig();
  usePermissionStore().$reset();
  useNotificationStore().$reset();
};
</script>

<style lang="less" scoped>
@import url('./index.less');
</style>
