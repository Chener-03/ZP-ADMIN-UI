import {DashboardIcon, HomeIcon} from 'tdesign-icons-vue-next';
import { shallowRef } from 'vue';
import Layout from '@/layouts/index.vue';

export default [
  {
    path: '/home',
    component: Layout,
    redirect: '/home/base',
    name: 'Home',
    meta: {
      title: '首页',
      icon: shallowRef(HomeIcon),
      orderNo: 0,
    },
    children: [
      {
        path: 'base',
        name: 'HomeBase',
        component: () => import('@/pages/dashboard/base/index.vue'),
        meta: {
          title: '概览',
        },
      }
    ],
  },
];



/* old json
   {
    path: '/dashboard',
    component: Layout,
    redirect: '/dashboard/base',
    name: 'dashboard',
    meta: {
      title: '首页',
      icon: shallowRef(DashboardIcon),
      orderNo: 0,
    },
    children: [
      {
        path: 'base',
        name: 'DashboardBase',
        component: () => import('@/pages/dashboard/base/index.vue'),
        meta: {
          title: '概览',
        },
      }
    ],
  },
*
* */
