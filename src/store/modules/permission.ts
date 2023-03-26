import { defineStore } from 'pinia';
import { RouteRecordRaw } from 'vue-router';
import router, { fixedRouterList, homepageRouterList } from '@/router';
import { store } from '@/store';
import { RouteItem } from '@/api/model/permissionModel';
import { getMenuList } from '@/api/permission';
import { transformObjectToRoute } from '@/utils/route';
import { MessagePlugin } from 'tdesign-vue-next';

export const usePermissionStore = defineStore('permission', {
  state: () => ({
    whiteListRouters: ['/login'],
    routers: [],
    removeRoutes: [],
    asyncRoutes: [],
  }),
  actions: {
    async initRoutes() {
      const accessedRouters = this.asyncRoutes;

      // 在菜单展示全部路由
      this.routers = [...homepageRouterList, ...accessedRouters, ...fixedRouterList];
      // 在菜单只展示动态路由和首页
      // this.routers = [...homepageRouterList, ...accessedRouters];
      // 在菜单只展示动态路由
      // this.routers = [...accessedRouters];
    },
    async buildAsyncRoutes() {
      try {
        // 发起菜单权限请求 获取菜单列表
        let routeItems: Array<RouteItem> = await getMenuList();
        this.asyncRoutes = transformObjectToRoute(routeItems);
        await this.initRoutes();
        return this.asyncRoutes;
      } catch (error) {
        router.push('/login');
        MessagePlugin.error('获取菜单失败');
        throw new Error("Can't build routes");
      }
    },
    async restoreRoutes() {
      this.removeRoutes.forEach((item: RouteRecordRaw) => {
        router.addRoute(item);
      });
    },
    async clearRoutes() {
      this.asyncRoutes = [];
    },
  },
});

export function getPermissionStore() {
  return usePermissionStore(store);
}
