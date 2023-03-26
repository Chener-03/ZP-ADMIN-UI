import { defineStore } from 'pinia';
import { request } from '@/utils/request';

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    msgData: [],
  }),
  getters: {
    unReadMsg: (state) => {
      return state.msgData;
    },
  },
  actions: {
    setMsgData(data: any) {
      this.msgData = data;
    },
    async requestMsgData() {
      // @ts-ignore
      let data = await request.get({
        url: '/v1/user/api/web/getMessagesList',
        params: {
          isReceive: true,
          page: 1,
          size: 100,
          isread: false,
        },
      });
      this.msgData = data.list;
    },
  },
  persist: false,
});
