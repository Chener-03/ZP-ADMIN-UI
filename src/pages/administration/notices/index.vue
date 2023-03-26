<template>
  <t-card :bordered="false">
    <t-form :data="searchForm">
      <t-row :gutter="10">
        <t-col :span="1.5">
          <t-select
            class="form-continer"
            clearable
            v-model="searchForm.type"
            :options="noticeTypeOption"
            placeholder="选择通知类型"
          ></t-select>
        </t-col>
        <t-col :span="1.5">
          <t-date-range-picker clearable class="form-continer" @change="rdpChange1" placeholder="创建时间" />
        </t-col>
        <t-col :span="1.5">
          <t-date-range-picker class="form-continer" clearable @change="rdpChange2" placeholder="结束时间" />
        </t-col>
        <t-col :span="0.5">
          <t-button @click="getData" class="form-continer">查询</t-button>
        </t-col>
        <t-col :span="0.5">
          <t-button @click="onFbClick" theme="success" class="form-continer">发布</t-button>
        </t-col>
      </t-row>
    </t-form>

    <t-table
      :data="tableData"
      style="margin-top: 10px"
      :pagination="pagination"
      :loading="tableLoading"
      @page-change="rehandlePageChange"
      :columns="columns"
    >
      <template #op="{ row }">
        <t-popconfirm
          v-if="row.type === '3'"
          theme="danger"
          content="确认将此通知置为过期?"
          @confirm="onRemoveNotifyClick(row)"
        >
          <t-button theme="danger" size="small">移除通知</t-button>
        </t-popconfirm>
      </template>

      <template #type="{ row }">
        <span>{{ parseNoticeTypeType(row.type) }}</span>
      </template>

      <template #ditch="{ row }">
        <t-space v-for="item in parseNoticeDitchType(row.ditch)">
          <t-tag style="margin-left: 2px">{{ item }}</t-tag>
        </t-space>
      </template>
    </t-table>
    <t-dialog
      v-model:visible="fbDialogVisible"
      header="发布"
      attach="body"
      :confirm-on-enter="true"
      :cancel-btn="null"
      :confirm-btn="null"
      :close-on-overlay-click="false"
    >
      <t-form
        ref="publishForm"
        :rules="publishFormRule"
        :data="publishFormData"
        :colon="true"
        :label-width="90"
        @submit="onPublish"
      >
        <t-form-item label="通知类型" name="type">
          <t-select
            clearable
            v-model="publishFormData.type"
            :options="noticeTypeOption"
            placeholder="选择通知类型"
          ></t-select>
        </t-form-item>
        <t-form-item label="内容" name="content">
          <t-textarea
            v-model="publishFormData.content"
            placeholder="请输入..."
            :autosize="{ minRows: 2, maxRows: 5 }"
          />
        </t-form-item>
        <t-form-item label="用户" name="userNames">
          <t-select
            :disabled="publishFormData.type !== '2'"
            v-model="publishFormData.users"
            multiple
            filterable
            placeholder="搜索用户"
            :options="formUsersOptions"
            :loading="formUsersSelectLoading"
            reserve-keyword
            @search="formUsersRemoteMethod"
          />
        </t-form-item>
        <t-form-item label="渠道" name="ditch">
          <t-select
            clearable
            :disabled="publishFormData.type === '3'"
            v-model="publishFormData.ditch"
            multiple
            :options="noticeDitchOption"
            placeholder="选择通知渠道"
          ></t-select>
        </t-form-item>
        <t-form-item label="结束时间" name="endTime">
          <t-date-picker
            :disabled="publishFormData.type !== '3'"
            enable-time-picker
            allow-input
            clearable
            v-model="publishFormData.endTime"
          />
        </t-form-item>
        <t-form-item label="包含链接">
          <t-select v-model="publishFormData.containLink">
            <t-option :value="0" :label="'否'" :key="0"> </t-option>
            <t-option :value="1" :label="'是'" :key="1"> </t-option>
          </t-select>
        </t-form-item>
        <t-form-item label="链接标题" v-if="publishFormData.containLink === 1">
          <t-input v-model="publishFormData.jmpLinkText" clearable></t-input>
        </t-form-item>
        <t-form-item label="链接地址" v-if="publishFormData.containLink === 1">
          <t-input v-model="publishFormData.jmpLink" clearable></t-input>
        </t-form-item>
        <t-form-item style="float: right">
          <t-button theme="primary" :loading="publishFormLoading" type="submit">提交</t-button>
        </t-form-item>
      </t-form>
    </t-dialog>
  </t-card>
</template>

<script lang="ts">
export default {
  name: 'Notices',
};
</script>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { request } from '@/utils/request';
import { MessagePlugin } from 'tdesign-vue-next';

const tableData = ref([]);
const columns = [
  {
    title: '内容',
    colKey: 'content',
    ellipsis: true,
  },
  {
    title: '创建时间',
    colKey: 'createTime',
    ellipsis: true,
  },
  {
    title: '过期时间',
    colKey: 'endTime',
    ellipsis: true,
  },
  {
    title: '通知类型',
    colKey: 'type',
    ellipsis: true,
  },
  {
    title: '通知渠道',
    colKey: 'ditch',
    ellipsis: true,
  },
  {
    title: '发布人',
    colKey: 'publishUserName',
    ellipsis: true,
  },
  {
    title: '操作',
    colKey: 'op',
    fixed: 'right',
  },
];
const pagination = ref({
  pageSize: 10,
  total: 100,
  current: 1,
});
const tableLoading = ref(false);
const rehandlePageChange = (curr, pageInfo) => {
  pagination.value.pageSize = curr.pageSize;
  pagination.value.current = curr.current;
  getData();
};
const getData = () => {
  tableLoading.value = true;
  // @ts-ignore
  request
    .get({
      url: '/v1/user/api/web/getNoticesList',
      params: {
        ...searchForm.value,
        page: pagination.value.current,
        size: pagination.value.pageSize,
      },
    })
    .then((res) => {
      tableLoading.value = false;
      tableData.value = res.list;
      pagination.value.total = res.total;
    })
    .catch((err) => {
      tableLoading.value = false;
      MessagePlugin.error(err.message);
    });
};

const searchForm = ref({
  type: '',
});
const noticeTypeOption = ref([]);
const parseNoticeTypeType = (type) => {
  for (let a of noticeTypeOption.value) {
    if (a.value === type) {
      return a.label;
    }
  }
  return '';
};
const getNoticeTypeOption = () => {
  // @ts-ignore
  request
    .get({
      url: '/v1/user/api/web/getNoticesTypeJson',
    })
    .then((res) => {
      noticeTypeOption.value = JSON.parse(res);
    })
    .catch((err) => {
      MessagePlugin.error(err.message);
    });
};
const noticeDitchOption = ref([]);
const parseNoticeDitchType = (type) => {
  let arr = [];
  try {
    type.split(',').map((item) => {
      for (let a of noticeDitchOption.value) {
        if (a.value === item) {
          arr.push(a.label);
        }
      }
    });
  } catch (err) {}
  return arr;
};
const getNoticeDitchOption = () => {
  // @ts-ignore
  request
    .get({
      url: '/v1/user/api/web/getNoticesDitchJson',
    })
    .then((res) => {
      noticeDitchOption.value = JSON.parse(res);
    })
    .catch((err) => {
      MessagePlugin.error(err.message);
    });
};
const rdpChange1 = (val) => {
  searchForm.value.createTime1 = val[0] === undefined ? '' : val[0];
  searchForm.value.createTime2 = val[1] === undefined ? '' : val[1];
};
const rdpChange2 = (val) => {
  searchForm.value.endTime1 = val[0] === undefined ? '' : val[0];
  searchForm.value.endTime2 = val[1] === undefined ? '' : val[1];
};

const onRemoveNotifyClick = (row) => {
  // @ts-ignore
  request
    .post({
      url: '/v1/user/api/web/notificationExpiration',
      params: {
        id: row.id,
      },
    })
    .then((res) => {
      MessagePlugin.success('成功');
      getData();
    })
    .catch((err) => {
      MessagePlugin.error(err.message);
    });
};

const fbDialogVisible = ref(false);
const onFbClick = () => {
  publishFormData.value = {};
  fbDialogVisible.value = true;
};
const publishFormData = ref({});
const publishForm = ref(null);
const publishFormRule = {
  content: [{ required: true, message: '请输入内容', trigger: 'blur' }],
  type: [{ required: true, message: '请选择通知类型', trigger: 'blur' }],
  ditch: [
    {
      validator: (res) => {
        return new Promise((resolve) => {
          if (publishFormData.value.type !== '3') {
            if (
              publishFormData.value.ditch === null ||
              publishFormData.value.ditch === undefined ||
              publishFormData.value.ditch.length === 0
            ) {
              return resolve({ result: false, message: '请选择通知渠道', type: 'error', trigger: 'blur' });
            }
          }
          return resolve({ result: true, message: '', type: 'success', trigger: 'blur' });
        });
      },
    },
  ],
  containLink: [{ required: true, message: '请选择是否包含链接', trigger: 'blur' }],
  jmpLinkText: [{ required: true, message: '请输入链接标题', trigger: 'blur' }],
  jmpLink: [{ required: true, message: '请输入链接地址', trigger: 'blur' }],
  endTime: [
    {
      validator: (res) => {
        return new Promise((resolve) => {
          if (publishFormData.value.type === '3') {
            if (publishFormData.value.endTime === null || publishFormData.value.endTime === undefined) {
              return resolve({ result: false, message: '请选择结束时间', type: 'error', trigger: 'blur' });
            }
          }
          return resolve({ result: true, message: '', type: 'success', trigger: 'blur' });
        });
      },
    },
  ],
  userNames: [
    {
      validator: (res) => {
        return new Promise((resolve) => {
          if (publishFormData.value.type === '2') {
            if (publishFormData.value.users.length === 0) {
              return resolve({ result: false, message: '请选择用户', type: 'error', trigger: 'blur' });
            }
          }
          return resolve({ result: true, message: '', type: 'success', trigger: 'blur' });
        });
      },
    },
  ],
};
const formUsersOptions = ref([]);
const formUsersSelectLoading = ref(false);
const formUsersRemoteMethod = async (val) => {
  if (val) {
    formUsersSelectLoading.value = true;
    try {
      //@ts-ignore
      const res = await request.get({
        url: '/v1/user/api/web/getUserAllInfo',
        params: {
          page: 1,
          size: 100,
          username: val,
          isLike: true,
          queryFields: 'id,username',
        },
      });
      formUsersOptions.value = res.list.map((item) => {
        return {
          label: item.username,
          value: item.id,
        };
      });
    } catch (err) {
      MessagePlugin.error(err.message);
    } finally {
      formUsersSelectLoading.value = false;
    }
  }
};
const publishFormLoading = ref(false);
const onPublish = () => {
  publishForm.value.validate().then((success) => {
    if (success === true) {
      if (
        publishFormData.value.users !== undefined &&
        publishFormData.value.users !== null &&
        publishFormData.value.users.length > 0
      ) {
        publishFormData.value.userNames = publishFormData.value.users.join(',');
      }

      if (
        publishFormData.value.ditch !== undefined &&
        publishFormData.value.ditch !== null &&
        publishFormData.value.ditch.length > 0
      ) {
        publishFormData.value.ditchs = publishFormData.value.ditch.join(',');
      }

      publishFormLoading.value = true;
      // @ts-ignore
      request
        .post({
          url: '/v1/user/api/web/publishNotices',
          params: {
            ...publishFormData.value,
          },
        })
        .then((res) => {
          if (res === true) {
            publishFormLoading.value = false;
            fbDialogVisible.value = false;
            MessagePlugin.success('发布成功');
            getData();
          } else {
            publishFormLoading.value = false;
            MessagePlugin.error('发布失败');
          }
        })
        .catch((err) => {
          publishFormLoading.value = false;
          MessagePlugin.error(err.message);
        });
    }
  });
};

onMounted(() => {
  getData();
  getNoticeTypeOption();
  getNoticeDitchOption();
});
</script>

<style lang="less" scoped>
.form-continer {
  margin-top: 5px;
  margin-bottom: 5px;
}
</style>
