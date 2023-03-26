<template>
  <header class="login-header">
    <div class="operations-container">
      <t-button theme="default" shape="square" variant="text" @click="navToGitHub">
        <t-icon name="logo-github" class="icon" />
      </t-button>
      <t-button theme="default" shape="square" variant="text" @click="navToHelper">
        <t-icon name="help-circle" class="icon" />
      </t-button>
    </div>
  </header>
</template>

<script setup lang="ts">

import { useSettingStore } from '@/store';

const settingStore = useSettingStore();


const navToGitHub = () => {
  window.open('https://github.com/chener999/ZP-ADMIN');
};
const navToHelper = () => {
  window.open('http://zpdoc.chener.xyz');
};
</script>

<style lang="less" scoped>
.login-header {
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  backdrop-filter: blur(5px);
  color: var(--td-text-color-primary);

  .logo {
    width: 188px;
  }

  .operations-container {
    display: flex;
    align-items: center;
    .t-button {
      margin-left: 16px;
    }

    .icon {
      height: 20px;
      width: 20px;
      padding: 6px;
      box-sizing: content-box;

      &:hover {
        cursor: pointer;
      }
    }
  }
}
</style>
