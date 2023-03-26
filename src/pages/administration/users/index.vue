<template>
  <div>
    <t-card :bordered="false">
      <t-row :gutter="0">
        <t-col :span="3">
          <t-button
            theme="primary"
            @click="
              () => {
                resetDialogFormData();
                dialogVisible = true;
              }
            "
            >新增</t-button
          >
        </t-col>
        <t-col :span="9">
          <t-form
            :data="tableSearchFormData"
            :layout="'inline'"
            label-width="0px"
            style="float: right"
            @submit="onSearchClick"
          >
            <t-form-item label="" name="username" style="min-width: 0; margin-right: 0">
              <t-input
                v-model="tableSearchFormData.username"
                style="width: 150px"
                clearable
                placeholder="用户名"
              ></t-input>
            </t-form-item>
            <t-form-item label="" name="nameCn" style="min-width: 0; margin-right: 0">
              <t-input v-model="tableSearchFormData.nameCn" style="width: 150px" clearable placeholder="别名"></t-input>
            </t-form-item>
            <t-form-item label="" style="min-width: 0; margin-right: 0">
              <t-button theme="success" type="submit">查询</t-button>
            </t-form-item>
          </t-form>
        </t-col>
      </t-row>

      <t-table
        row-key="id"
        style="margin-top: 10px"
        :data="pageData.tableData"
        :columns="columns"
        :pagination="pagination"
        :loading="dataLoading"
        @page-change="rehandlePageChange"
        :hover="true"
      >
        <template #disable="{ row }">
          <t-switch :customValue="[1, 0]" v-model="row.disable" @change="disableClicked(row)"></t-switch>
        </template>

        <template #avatarId="{ row }">
          <t-avatar
            :image="host + '/v1/file/api/web/getFilePublic?resourceUid=' + row.avatarId"
            :alt="'加载失败'"
            :hide-on-load-failed="true"
            size="large"
          ></t-avatar>
        </template>

        <template #operation="{ row }">
          <t-dropdown :options="dropDownList" @click="onDropListClick($event, row)">
            <t-space>
              <t-button theme="primary" size="small" style="margin-right: 10px"> 管理 </t-button>
            </t-space>
          </t-dropdown>
          <t-popconfirm theme="danger" content="三思!" @confirm="onDeleteClick(row)">
            <t-button theme="danger" size="small">删除</t-button>
          </t-popconfirm>
        </template>
      </t-table>
    </t-card>

    <t-drawer
      v-model:visible="detailedInformationDrawer"
      header="详细信息"
      :placement="'right'"
      :destroy-on-close="true"
      :size="'50%'"
      :cancelBtn="null"
      @confirm="detailedInformationDrawer = false"
      :mode="'overlay'"
    >
      <t-card :title="'基础信息'" header-bordered :style="{ width: '100%' }" hover-shadow>
        <div class="info-block">
          <div class="info-item">
            <h1>用户ID:</h1>
            <t-tag theme="primary" style="float: left">{{ detailInformationData.id }}</t-tag>
          </div>

          <div class="info-item">
            <h1>用户名:</h1>
            <span>{{ detailInformationData.username }}</span>
          </div>

          <div class="info-item">
            <h1>注册时间:</h1>
            <span>{{ detailInformationData.createTime }}</span>
          </div>

          <div class="info-item">
            <h1>过期时间:</h1>
            <span>{{ detailInformationData.expireTime }}</span>
          </div>

          <div class="info-item">
            <h1>状态:</h1>
            <span>
              <icon-font v-if="detailInformationData.disable === 0" name="check-circle-filled" style="color: green" />
              <icon-font v-else name="close-circle-filled" style="color: red" />
              {{ detailInformationData.disable === 0 ? '正常' : '禁用' }}
            </span>
          </div>

          <div class="info-item">
            <h1>上次登录时间:</h1>
            <span>{{ detailInformationData.lastLoginTime }}</span>
          </div>

          <div class="info-item">
            <h1>上次登录IP:</h1>
            <span>{{ detailInformationData.lastLoginIp }}</span>
          </div>

          <div class="info-item">
            <h1>上次登录系统:</h1>
            <span>{{ detailInformationData.lastLoginOs }}</span>
          </div>
        </div>
      </t-card>

      <t-card :title="'详细信息'" header-bordered :style="{ width: '100%', marginTop: '20px' }" hover-shadow>
        <div class="info-block">
          <div class="info-item">
            <h1>别名:</h1>
            <span>{{ detailInformationData.nameCn }}</span>
          </div>
          <div class="info-item">
            <h1>邮箱:</h1>
            <span>{{ detailInformationData.email }}</span>
          </div>
          <div class="info-item">
            <h1>电话:</h1>
            <span>{{ detailInformationData.phone }}</span>
          </div>
          <div class="info-item">
            <h1>上级用户ID:</h1>
            <span>{{ detailInformationData.superUserId }}</span>
          </div>
          <div class="info-item">
            <h1>职务:</h1>
            <span>{{ detailInformationData.post }}</span>
          </div>
          <div class="info-item">
            <h1>签名:</h1>
            <span>{{ detailInformationData.autograph }}</span>
          </div>
          <div class="info-item">
            <h1>简介:</h1>
            <span>{{ detailInformationData.introduce }}</span>
          </div>
          <div class="info-item">
            <h1>头像:</h1>
            <span
              ><t-avatar
                :image="host + '/v1/file/api/web/getFilePublic?resourceUid=' + detailInformationData.avatarId"
                :hide-on-load-failed="true"
                size="small"
                shape="round"
              ></t-avatar
            ></span>
          </div>
          <div class="info-item">
            <h1>角色:</h1>
            <t-tag theme="success" style="float: left">{{ detailInformationData.roleName }}</t-tag>
          </div>
        </div>
      </t-card>
    </t-drawer>

    <t-dialog
      v-model:visible="dialogVisible"
      :header="false"
      :close-btn="true"
      :destroy-on-close="true"
      :confirm-on-enter="true"
      :close-on-overlay-click="false"
      width="50%"
      height="500px"
      :cancel-btn="null"
      :confirm-btn="null"
    >
      <t-tabs :default-value="1" v-model="tabIndex">
        <t-tab-panel :destroy-on-hide="false" :value="1" label="基础信息">
          <t-form
            ref="formValidatorStatus"
            :data="dialogFormData"
            :rules="formRules"
            :label-width="80"
            :status-icon="true"
            style="height: 300px; margin-top: 20px"
          >
            <t-form-item label="用户名" name="username">
              <t-input v-model="dialogFormData.username" placeholder="用户名" clearable></t-input>
            </t-form-item>

            <t-form-item label="到期时间" name="expireTime">
              <t-date-picker @change="dc" v-model="dialogFormData.expireTime" placeholder="到期时间" />
            </t-form-item>

            <t-form-item label="状态" name="disable">
              <t-radio-group
                variant="default-filled"
                :disabled="concurrentUserInfo.userBase.id === dialogFormData.id"
                :default-value="0"
                v-model="dialogFormData.disable"
              >
                <t-radio-button :value="0">启用</t-radio-button>
                <t-radio-button :value="1">禁用</t-radio-button>
              </t-radio-group>
            </t-form-item>
          </t-form>
        </t-tab-panel>
        <t-tab-panel :destroy-on-hide="false" :value="2" label="详细信息">
          <t-form
            ref="formValidatorStatus1"
            :data="dialogFormData"
            :rules="formRules"
            :label-width="80"
            :status-icon="true"
            style="height: 300px; margin-top: 20px"
          >
            <t-form-item label="别名" name="nameCn">
              <t-input v-model="dialogFormData.nameCn" placeholder="别名"></t-input>
            </t-form-item>

            <t-form-item label="邮箱" name="email">
              <t-input v-model="dialogFormData.email" placeholder="邮箱"></t-input>
            </t-form-item>

            <t-form-item label="电话" name="phone">
              <t-input v-model="dialogFormData.phone" placeholder="电话"></t-input>
            </t-form-item>

            <t-form-item label="签名" name="autograph">
              <t-input v-model="dialogFormData.autograph" placeholder="签名"></t-input>
            </t-form-item>

            <t-form-item label="简介" name="introduce">
              <t-input v-model="dialogFormData.introduce" placeholder="简介"></t-input>
            </t-form-item>
          </t-form>
        </t-tab-panel>
      </t-tabs>

      <t-space size="small" style="float: right">
        <t-button theme="primary" @click="formSubmit" :loading="dialogFormSubmicStatus">提交</t-button>
        <t-button
          theme="default"
          variant="base"
          type="reset"
          @click="resetDialogFormData"
          :disabled="!(dialogFormData.id === null)"
          >重置</t-button
        >
      </t-space>
    </t-dialog>
  </div>
</template>

<script lang="ts">
export default {
  name: 'AdministrationUsers',
};
</script>

<script setup lang="ts">
import { ref, computed, onMounted, toRefs, reactive } from 'vue';
import { request } from '@/utils/request';
import { MessagePlugin } from 'tdesign-vue-next';
import proxy from '@/config/proxy';
import { IconFont } from 'tdesign-icons-vue-next';
import { getUserStore, useUserStore } from '@/store';

const env = import.meta.env.MODE || 'development';
const host = env === 'mock' || !proxy.isRequestProxy ? '' : proxy[env].host;
const tabIndex = ref(1);
const dc = (value, { dayjsValue }) => {
  dialogFormData.expireTime = dayjsValue.format('YYYY-MM-DD HH:mm:ss');
};
const dialogFormSubmicStatus = ref(false);
const formSubmit = () => {
  if (tabIndex.value !== 1) {
    tabIndex.value = 1;
  }

  formValidatorStatus.value
    .validate()
    .then((res) => {
      dialogFormSubmicStatus.value = true;
      if (res === true) {
        //@ts-ignore
        request
          .post({
            url: '/v1/user/api/web/saveUserBaseInfo',
            params: dialogFormData,
          })
          .then((r0) => {
            if (r0 !== null && r0 !== undefined) {
              dialogFormData.id = r0.id;
              dialogFormData.userId = r0.id;
              //@ts-ignore
              request
                .post({
                  url: '/v1/user/api/web/saveUserExtendInfo',
                  params: dialogFormData,
                })
                .then((r1) => {
                  if (r1 !== null && r1 !== undefined) {
                    MessagePlugin.success('保存成功');
                    dialogFormSubmicStatus.value = false;
                    getData(pagination.value.current, pagination.value.pageSize);
                    dialogVisible.value = false;
                  } else {
                    MessagePlugin.error('其它信息保存失败');
                    dialogFormSubmicStatus.value = false;
                    getData(pagination.value.current, pagination.value.pageSize);
                  }
                })
                .catch(() => {
                  dialogFormSubmicStatus.value = false;
                });
            } else {
              MessagePlugin.error('基础信息保存失败');
              dialogFormSubmicStatus.value = false;
            }
          })
          .catch((err) => {
            dialogFormSubmicStatus.value = false;
            MessagePlugin.error(err.message);
          });
      } else {
        dialogFormSubmicStatus.value = false;
      }
    })
    .catch(() => {
      dialogFormSubmicStatus.value = false;
    });
};
const formValidatorStatus = ref(null);
const formValidatorStatus1 = ref(null);
const dropDownList = [
  { content: '详细信息', value: 1 },
  { content: '编辑', value: 2 },
  { content: '重置登录', value: 3 },
  { content: '重置密码', value: 4 },
];
const detailedInformationDrawer = ref(false);
const detailInformationData = ref({});
const pagination = ref({
  pageSize: 10,
  total: 100,
  current: 1,
});
const dataLoading = ref(false);
const dialogVisible = ref(false);
const dialogFormData = reactive({
  id: null,
  userId: null,
  username: '',
  expireTime: null,
  disable: 0,
  email: '',
  phone: '',
  superUserId: null,
  post: '',
  autograph: '',
  introduce: '',
  nameCn: '',
});
const concurrentUserInfo = getUserStore().userInfo;
const resetDialogFormData = () => {
  dialogFormData.id = null;
  dialogFormData.userId = null;
  dialogFormData.username = '';
  dialogFormData.expireTime = null;
  dialogFormData.disable = 0;
  dialogFormData.email = '';
  dialogFormData.phone = '';
  dialogFormData.superUserId = null;
  dialogFormData.post = '';
  dialogFormData.autograph = '';
  dialogFormData.introduce = '';
  dialogFormData.nameCn = '';
};
const formRules = {
  username: [
    {
      validator: (res) => {
        return new Promise((resolve) => {
          if (res === null || res.length < 3 || res.length > 20) {
            return resolve({ result: false, message: '用户名长度在 3 到 20 个字符', type: 'error', trigger: 'blur' });
          }

          if (dialogFormData.id !== null && editOldUserName.value === res) {
            return resolve({ result: true });
          }
          //@ts-ignore
          request
            .get({
              url: '/v1/user/api/web/getUserBaseInfo',
              params: {
                username: res,
              },
            })
            .then((req) => {
              if (req.total !== 0) {
                return resolve({ result: false, message: '用户名重复', type: 'error', trigger: 'blur' });
              } else {
                return resolve({ result: true, message: '用户名可用', type: 'success', trigger: 'blur' });
              }
            });
        });
      },
    },
  ],
  expireTime: [{ required: true, message: '请输入到期时间', trigger: 'blur' }],
  email: [{ email: true, message: '确定是邮箱?', type: 'warning' }],
  phone: [{ telnumber: true, message: '确定是手机号?', type: 'warning' }],
};
const editOldUserName = ref('');

const tableSearchFormData = ref({
  username: '',
  nameCn: '',
});

const rehandlePageChange = (curr, pageInfo) => {
  pagination.value.pageSize = curr.pageSize;
  pagination.value.current = curr.current;
  getData(curr.current, curr.pageSize);
};

const setConcurrentFormData = (data) => {
  dialogFormData.id = data.id;
  dialogFormData.userId = data.id;
  dialogFormData.username = data.username;
  dialogFormData.expireTime = data.expireTime;
  dialogFormData.disable = data.disable;
  dialogFormData.email = data.email;
  dialogFormData.phone = data.phone;
  dialogFormData.superUserId = data.superUserId;
  dialogFormData.post = data.post;
  dialogFormData.autograph = data.autograph;
  dialogFormData.introduce = data.introduce;
  dialogFormData.nameCn = data.nameCn;
};

const onDeleteClick = (data) => {
  //@ts-ignore
  request
    .post({
      url: '/v1/user/api/web/deleteUser',
      params: {
        username: data.username,
      },
    })
    .then((res) => {
      if (res === true) {
        MessagePlugin.success('成功');
        getData(pagination.value.current, pagination.value.pageSize);
      } else {
        MessagePlugin.error('失败:' + res);
      }
    })
    .catch((res) => {
      MessagePlugin.error('失败:' + res.message);
    });
};

const resetPassword = (data: any, ispwd: boolean) => {
  console.log(ispwd);
  //@ts-ignore
  request
    .post({
      url: '/v1/user/api/web/resetPassword',
      params: {
        username: data.username,
        isPwd: ispwd,
      },
    })
    .then((res) => {
      if (res === true) {
        MessagePlugin.success('成功');
      } else {
        MessagePlugin.error('失败:' + res);
      }
    })
    .catch((res) => {
      MessagePlugin.error('失败:' + res.message);
    });
};

const onDropListClick = (a, b, c) => {
  switch (a.value) {
    case 1: {
      detailInformationData.value = b;
      detailedInformationDrawer.value = true;
      break;
    }
    case 2: {
      setConcurrentFormData(b);
      editOldUserName.value = b.username;
      dialogVisible.value = true;
      break;
    }
    case 3: {
      resetPassword(b, false);
      break;
    }
    case 4: {
      resetPassword(b, true);
      break;
    }
  }
};

const pageData = ref({
  tableData: [],
});

const onSearchClick = () => {
  getData(pagination.value.current, pagination.value.pageSize);
};

const disableClicked = (row) => {
  //@ts-ignore
  request
    .post({
      url: '/v1/user/api/web/setUserDisable',
      params: {
        username: row.username,
        disable: row.disable,
      },
    })
    .then((res) => {
      if (res !== null && res !== undefined && res === true) {
        if (row.disable == 1) {
          MessagePlugin.success('禁用成功');
        } else {
          MessagePlugin.success('启用成功');
        }
      }
    })
    .catch((err) => {
      console.log(err);
      if (row.disable === 1) {
        row.disable = 0;
      } else {
        row.disable = 1;
      }
      MessagePlugin.error(err.message);
    });
};

const getData = (page, size) => {
  dataLoading.value = true;
  //@ts-ignore
  request
    .get({
      url: '/v1/user/api/web/getUserAllInfo',
      params: {
        page: page,
        size: size,
        isLike: true,
        ...tableSearchFormData.value,
      },
    })
    .then((res: any) => {
      pagination.value.total = res.total;
      pageData.value.tableData = res.list;
    })
    .catch((res: Error) => {
      MessagePlugin.error(res.message);
    })
    .finally(() => {
      dataLoading.value = false;
    });
};

onMounted(() => {
  getData(pagination.value.current, pagination.value.pageSize);
});

const columns = [
  {
    title: '头像',
    colKey: 'avatarId',
    width: 100,
    fixed: 'left',
  },
  {
    title: '用户名',
    align: 'left',
    width: 150,
    colKey: 'username',
  },
  {
    title: '别名',
    colKey: 'nameCn',
    width: 200,
  },
  {
    title: '联系方式',
    ellipsis: true,
    colKey: 'phone',
  },
  {
    title: '过期时间',
    colKey: 'expireTime',
    ellipsis: true,
  },
  {
    title: '禁用',
    width: 100,
    colKey: 'disable',
  },
  {
    title: '操作',
    colKey: 'operation',
    width: 200,
    fixed: 'right',
  },
];
</script>

<style scoped lang="less">
.t-switch.t-is-checked {
  background-color: #ff0000;
}

.info-block {
  column-count: 2;

  .info-item {
    padding: 20px 0;
    display: flex;
    color: var(--td-text-color-primary);

    h1 {
      width: 130px;
      font: var(--td-font-body-medium);
      color: var(--td-text-color-secondary);
      font-weight: normal;
      text-align: left;

      @media (max-width: @screen-sm-max) {
        width: 80px;
      }

      @media (min-width: @screen-md-min) and (max-width: @screen-md-max) {
        width: 100px;
      }
    }

    span {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      margin-left: 24px;
    }
  }
}
</style>
