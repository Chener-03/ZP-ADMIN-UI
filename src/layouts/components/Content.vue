<template>

  <t-watermark :alpha="setting.showWatemark?1:0"
               :watermark-content="{ text: concurrentUser.userInfo.userBase.username }"
               style="height: auto"
               :y="120" :x="120" :width="120" :height="60" >
    <router-view v-if="!isRefreshing" v-slot="{ Component }"  >

      <transition name="page-transition" mode="out-in">
        <!--      <keep-alive :include="aliveViews">-->
        <component :is="Component" />
        <!--      </keep-alive>-->
      </transition>
    </router-view>
  </t-watermark>



  <frame-page />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { ComputedRef } from 'vue';
import {useSettingStore, useTabsRouterStore, useUserStore} from '@/store';
import FramePage from '@/layouts/frame/index.vue';

// <suspense>标签属于实验性功能，请谨慎使用
// 如果存在需解决/page/1=> /page/2 刷新数据问题 请修改代码 使用activeRouteFullPath 作为key
// <suspense>
//  <component :is="Component" :key="activeRouteFullPath" />
// </suspense>

// import { useRouter } from 'vue-router';
// const activeRouteFullPath = computed(() => {
//   const router = useRouter();
//   return router.currentRoute.value.fullPath;
// });

const setting = useSettingStore();

const concurrentUser = useUserStore()


const aliveViews = computed(() => {
  const tabsRouterStore = useTabsRouterStore();
  const { tabRouters } = tabsRouterStore;

  return tabRouters.filter((route) => route.isAlive).map((route) => route.name);
}) as ComputedRef<string[]>;

const isRefreshing = computed(() => {
  const tabsRouterStore = useTabsRouterStore();
  const { refreshing } = tabsRouterStore;
  return refreshing;
});
</script>

<style lang="less" scoped>

@keyframes slideIn {
  0% {
    scale: (0.8);
    transform: translateX(100%);
  }

  50%{
    scale: (0.8);
    transform: translateX(0%);
  }

  100% {
    scale: (1.0);
    transform: translateX(0);
  }
}

@keyframes slideOut {
  0% {
    opacity: 100%;
  }

  100% {
    opacity: 0;
  }
}




.page-transition-enter-active {
  animation: slideIn 0.7s cubic-bezier(0.25, 0.1, 0.25, 1) forwards;
}




.page-transition-leave-active {
  animation: slideOut 0.3s   forwards;
}


</style>
