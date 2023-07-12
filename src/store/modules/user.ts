// @ts-nocheck
import {defineStore} from 'pinia';
import {TOKEN_NAME} from '@/config/global';
import {store, usePermissionStore} from '@/store';
import {UserInfomation} from "@/entity/user/userInfomation";
import {request} from "@/utils/request";
import {UserLoginResult} from "@/entity/user/userLoginResult";
import {Base64} from "js-base64";
import {globleWebsocketClose, globleWebsocketStart} from "@/utils/ws";

const userInfomation : UserInfomation = new UserInfomation();

const InitUserInfo = {
  roles: [],
  ...userInfomation
};

export interface UserLoginParam{
  username: string;
  password: string;

  phone: string;
  email: string;
  verification: string;

}

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem(TOKEN_NAME), // 默认token不走权限
    userInfo: { ...InitUserInfo },
  }),
  getters: {
    roles: (state) => {
      state.userInfo.roles = state.userInfo?.roleList;
      return state.userInfo?.roles;
    },
  },
  actions: {
    async login(userInfo: UserLoginParam) {
      const doLogin = async (userInfo: UserLoginParam) => {

        userInfo.username = Base64.encode(userInfo.username);
        userInfo.password = Base64.encode(userInfo.password);
        userInfo.phone = Base64.encode(userInfo.phone);
        userInfo.email = Base64.encode(userInfo.email);
        let loginRes = await request.post<UserLoginResult>({
          data: userInfo,
          url: '/v1/user/api/web/userDoLogin',
        })
        return {
          ...loginRes
        };
      };
      const res = await doLogin(userInfo);
      if (res.success === true) {
        this.token = res.token;
        localStorage.setItem(TOKEN_NAME,res.token)
        return res;
      } else {
        throw res;
      }
    },
    async getUserInfo() {
      globleWebsocketStart();
      const getConcurrentUserInfo = async (token: string) => {
        try {
          return await request.get({
            url: '/v1/user/api/web/getConcurrentUserInformation'
          });
        }catch (ex) {
          console.log(ex)
        }
        return{};
      };
      let u = this.userInfo;
      if (u.userBase === undefined || u.userBase === null) {
        this.userInfo = await getConcurrentUserInfo(this.token);
      }
    },
    async logout() {
      globleWebsocketClose();
      localStorage.removeItem(TOKEN_NAME);
      this.token = '';
      this.userInfo = { ...InitUserInfo };
    },
    async removeToken() {
      this.token = '';
    },
    async setToken(token) {
      this.token = token;
      localStorage.setItem(TOKEN_NAME,token)
    },
    hasAccess(key: string) : Boolean {
      return this.userInfo.roleList.includes(key);
    }
  },
  persist: {
    afterRestore: () => {
      const permissionStore = usePermissionStore();
      permissionStore.initRoutes();
    },
  },
});

export function getUserStore() {
  return useUserStore(store);
}
