<template>
  <t-row :gutter="[24, 24]">
    <t-col :flex="3">
      <div class="user-left-greeting">
        <div>
          Hi，{{
            userExt.nameCn === '' || userExt.nameCn === undefined || userExt.nameCn === null
              ? userBase.username
              : userExt.nameCn
          }}
          <span class="regular"> {{ timeStr }}好，今天是你加入的第 {{ days }} 天</span>
        </div>
        <img src="@/assets/zplogo.png" style="height: 50px; width: 80px" class="logo" />
      </div>

      <t-card :hover-shadow="true" class="user-info-list" title="个人信息" :bordered="false">
        <template #actions>
          <t-button theme="default" shape="square" variant="text" @click="editClick">
            <t-icon name="edit" size="18" v-if="isEdit === false" />
            <t-icon name="save" size="18" v-else />
          </t-button>
        </template>
        <t-form v-model="userExt">
          <t-row class="content" justify="space-between" :gutter="20">
            <t-col class="contract" :span="6">
              <div class="contract-title">
                {{ '名字' }}
              </div>
              <div class="contract-detail">
                <t-input
                  v-model="userExt.nameCn"
                  :disabled="isEdit === false"
                  style="border-color: rgba(255, 0, 0, 0)"
                ></t-input>
              </div>
            </t-col>

            <t-col class="contract" :span="6">
              <div class="contract-title">
                {{ '联系方式' }}
              </div>
              <div class="contract-detail">
                <t-input
                  v-model="userExt.phone"
                  :disabled="isEdit === false"
                  style="border-color: rgba(255, 0, 0, 0)"
                ></t-input>
              </div>
            </t-col>

            <t-col class="contract" :span="6">
              <div class="contract-title">
                {{ '邮箱' }}
              </div>
              <div class="contract-detail">
                <t-input
                  v-model="userExt.email"
                  :disabled="isEdit === false"
                  style="border-color: rgba(255, 0, 0, 0)"
                ></t-input>
              </div>
            </t-col>

            <t-col class="contract" :span="6">
              <div class="contract-title">
                {{ '职务' }}
              </div>
              <div class="contract-detail">
                <t-input
                  v-model="userExt.post"
                  :disabled="isEdit === false"
                  style="border-color: rgba(255, 0, 0, 0)"
                ></t-input>
              </div>
            </t-col>

            <t-col class="contract" :span="12">
              <div class="contract-title">
                {{ '签名' }}
              </div>
              <div class="contract-detail">
                <t-input
                  v-model="userExt.autograph"
                  :disabled="isEdit === false"
                  style="border-color: rgba(255, 0, 0, 0)"
                ></t-input>
              </div>
            </t-col>

            <t-col class="contract" :span="12" style="height: 150px">
              <div class="contract-title">
                {{ '简介' }}
              </div>
              <div class="contract-detail">
                <!--                <t-input v-model="userExt.introduce" :disabled="isEdit===false" style="border-color:rgba(255,0,0,0);"></t-input>-->
                <t-textarea
                  :disabled="isEdit === false"
                  v-model="userExt.introduce"
                  placeholder="未填写"
                  name="introduce"
                  :autosize="{ minRows: 3, maxRows: 5 }"
                />
              </div>
            </t-col>
          </t-row>
        </t-form>
      </t-card>

      <t-card :hover-shadow="true" class="user-info-list" title="修改密码" :bordered="false">
        <t-form ref="pwdForm" :label-width="0" :data="pwd" :rules="pwdRule">
          <t-row :gutter="15" style="margin-bottom: 20px">
            <t-col :span="3">
              <t-form-item name="oldPwd">
                <t-input class="tinput2" type="password" v-model="pwd.oldPwd" placeholder="原密码"></t-input>
              </t-form-item>
            </t-col>
            <t-col :span="3">
              <t-form-item name="newPwd">
                <t-input class="tinput2" type="password" v-model="pwd.newPwd" placeholder="新密码"></t-input>
              </t-form-item>
            </t-col>
            <t-col :span="3">
              <t-form-item name="confirmPwd">
                <t-input class="tinput2" type="password" v-model="pwd.confirmPwd" placeholder="确认密码"></t-input>
              </t-form-item>
            </t-col>
            <t-col :span="3">
              <t-button theme="primary" @click="pwdSubmit">修改</t-button>
            </t-col>
          </t-row>
        </t-form>
      </t-card>
    </t-col>

    <t-col :flex="1">
      <t-card class="user-intro" :bordered="false">
        <t-upload
          v-model="uploadFileData"
          :action="`${host}/v1/file/api/web/uploadFilePublic`"
          :tips="''"
          :headers="headers"
          accept="image/*"
          theme="custom"
          name="file"
          @fail=""
          @success="onUploadSuccess"
        >
          <t-avatar
            size="90px"
            v-if="userExt.avatarId === undefined || userExt.avatarId === null || userExt.avatarId === ''"
            >{{ userBase.username }}</t-avatar
          >
          <t-avatar
            size="90px"
            v-else
            :image="`${host}/v1/file/api/web/getFilePublic?resourceUid=${userExt.avatarId}`"
            :hideOnLoadFailed="true"
            >{{ userBase.username }}</t-avatar
          >
        </t-upload>

        <div class="name">{{ userBase.username }}</div>
        <div class="position">{{ userExt.nameCn }}</div>
      </t-card>

      <t-card title="其它信息" class="user-team" :bordered="false">
        <t-list :split="true">
          <t-list-item>
            <t-list-item-meta
              title="所属部门"
              :description="userOtherInfo.orgName === null ? '您不是组织用户' : userOtherInfo.orgName"
            />
          </t-list-item>
          <t-list-item>
            <t-list-item-meta title="所属角色" :description="userOtherInfo.roleName" />
          </t-list-item>
          <t-list-item>
            <t-list-item-meta title="创建时间" :description="userBase.createTime" />
          </t-list-item>
          <t-list-item>
            <t-list-item-meta title="过期时间" :description="userBase.expireTime" />
            <template #action>
              <span>
                <t-link theme="primary" hover="color" style="margin-left: 16px" @click="onRenewalClick">续期</t-link>
              </span>
            </template>
          </t-list-item>
        </t-list>
      </t-card>
    </t-col>
  </t-row>
</template>
<script lang="ts">
export default {
  name: 'UserIndex',
};
</script>
<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, watch, computed, ref, reactive } from 'vue';
import { request } from '@/utils/request';
import { MessagePlugin } from 'tdesign-vue-next';
import proxy from '@/config/proxy';
import { DS_KEY, TOKEN_NAME } from '@/config/global';
import { ToMd5Hex } from '@/utils/MD5';
import router from '@/router';
import { useUserStore } from '@/store';

const env = import.meta.env.MODE || 'development';
const host = env === 'mock' || !proxy.isRequestProxy ? '' : proxy[env].host;
const headers = {
  Authorization: localStorage.getItem(TOKEN_NAME),
};

const userBase = ref({});
const userExt = ref({
  nameCn: '',
  phone: '',
  email: '',
  post: '',
  autograph: '',
  introduce: '',
  avatarId: '',
});
const userOtherInfo = ref({});
const days = ref(0);
const timeStr = ref('');
const processData = () => {
  // @ts-ignore
  let time = userBase.value.createTime;
  let date1 = new Date(time);
  let date2 = new Date();
  let date3 = date2.getTime() - date1.getTime();
  days.value = Math.floor(date3 / (24 * 3600 * 1000));

  let hours = date2.getHours();
  if (hours < 12) {
    timeStr.value = '上午';
  } else if (hours < 18) {
    timeStr.value = '下午';
  } else {
    timeStr.value = '晚上';
  }
};
const getUserInfo = async () => {
  try {
    let res = await request.get({
      url: '/v1/user/api/web/getConcurrentUserInformation',
    });
    userBase.value = res.userBase;
    if (res.userExtend !== undefined && res.userExtend !== null) {
      userExt.value = res.userExtend;
    }
    processData();
  } catch (ex) {}
};
const isEdit = ref(false);
const editClick = () => {
  if (isEdit.value === true) {
    isEdit.value = false;
    saveInfo();
  } else {
    isEdit.value = true;
    MessagePlugin.info('启用编辑');
  }
};

const saveInfo = () => {
  request
    .post({
      url: '/v1/user/api/web/saveSelfExtendInfo',
      data: {
        ...userExt.value,
      },
    })
    .then((res) => {
      MessagePlugin.success('保存成功');
    })
    .catch((ex) => {
      MessagePlugin.error('保存失败');
    });
};
const uploadFileData = ref([]);
const onUploadSuccess = (a) => {
  let res = a.response;
  if (res.code === 200) {
    userExt.value.avatarId = res.obj.fileSystemMap.resourceUid;
    debugger;
    saveInfo();
  } else {
    MessagePlugin.error('上传失败:' + res.message);
  }
};

const pwdForm = ref(null);
const pwd = ref({
  oldPwd: '',
  newPwd: '',
  confirmPwd: '',
});
const pwdRule = {
  oldPwd: [
    { required: true, message: '请输入旧密码', type: 'error', trigger: 'blur' },
    { required: true, message: '请输入旧密码', type: 'error', trigger: 'change' },
  ],
  newPwd: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' },
  ],
  confirmPwd: [
    {
      validator: (res) => {
        return new Promise((resolve) => {
          if (pwd.value.newPwd === pwd.value.confirmPwd) {
            return resolve({ result: true, message: '', type: 'success', trigger: 'blur' });
          }
          return resolve({ result: false, message: '两次输入不一致', type: 'error', trigger: 'blur' });
        });
      },
    },
  ],
};
const pwdSubmitBtnLoading = ref(false);
const pwdSubmit = () => {
  pwdForm.value.validate().then((valid) => {
    if (valid === true) {
      let param = {
        oldPassword: pwd.value.oldPwd,
        newPassword: pwd.value.newPwd,
        ds: ToMd5Hex(pwd.value.oldPwd + pwd.value.newPwd + DS_KEY),
      };
      pwdSubmitBtnLoading.value = true;
      request
        .post({
          url: '/v1/user/api/web/resetSelfPassword',
          data: {
            ...param,
          },
        })
        .then((res) => {
          pwdSubmitBtnLoading.value = false;
          if (res.success === true) {
            MessagePlugin.success('修改成功,即将重新登录....');
            pwd.value.oldPwd = '';
            pwd.value.newPwd = '';
            pwd.value.confirmPwd = '';
            pwdForm.value.clearValidate();

            setTimeout(() => {
              router.push({
                path: '/login',
                query: { redirect: encodeURIComponent(router.currentRoute.value.fullPath) },
              });
            }, 1000);
          } else {
            MessagePlugin.error(res.message);
          }
        })
        .catch((ex) => {
          pwdSubmitBtnLoading.value = false;
          MessagePlugin.error(ex.message);
        });
    } else {
      return false;
    }
  });
  // pwdForm.value.clearValidate();
};

const getUserOtherInfo = () => {
  // @ts-ignore
  request
    .get({
      url: '/v1/user/api/web/getSelfOtherInfo',
    })
    .then((res) => {
      userOtherInfo.value = res;
    })
    .catch((ex) => {
      MessagePlugin.error(ex.message);
    });
};

const onRenewalClick = () => {
  MessagePlugin.info('请联系管理员');
};
const userStore = useUserStore();
onMounted(() => {
  getUserInfo();
  getUserOtherInfo();
});

onUnmounted(() => {});
</script>

<style lang="less" scoped>
@import url('./index.less');

/deep/.t-input.t-is-disabled {
  color: rgba(0, 0, 0, 0);
  background-color: #eee0;
  border-color: rgba(255, 255, 255, 0);
}

/deep/.t-input.t-is-disabled .t-input__inner {
  cursor: not-allowed;
  color: rgb(0 0 0 / 95%);
}

.t-avatar {
  cursor: pointer;
}

/deep/.t-textarea .t-is-disabled {
  background-color: #eee0;
  cursor: not-allowed;
  border-color: #f5deb300;
  color: rgb(0 0 0 / 95%);
}
/*
/deep/.narrow-scrollbar {
  border-color: rgba(0, 0, 0, 0.00);
  scrollbar-color: var(--td-scrollbar-color) transparent;
  scrollbar-width: thin;
}
/deep/.t-textarea{
  border-color: #f5deb300;
}

/deep/.t-input {
  border-color: rgba(255, 255, 255, 0.0);
}*/

.tinput2 &.t-input {
  border-color: var(--td-border-level-2-color);
  background-color: var(--td-bg-color-specialcomponent);
}
</style>
