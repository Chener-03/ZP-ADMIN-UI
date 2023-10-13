<template>
  <t-card :bordered="false" >
    <t-form
      ref="form"
      :data="searchData"
      :style="{ marginBottom: '8px',marginTop:'10px'}"
      @reset="reset"
      @submit="getData">
      <t-row>
        <t-col :span="10">
          <t-row :gutter="[16, 24]">
            <t-col :sm="3" :span="4">
                <t-input v-model="searchData.userName"
                         class="form-item-content"
                         placeholder="请输入用户名"
                         :style="{ maxWidth: '160px' }"
                         type="search" clearable>
                  <template #prefix-icon>
                    <SearchIcon />
                  </template>
                </t-input>
            </t-col>
            <t-col :sm="5" :span="6">
                <t-date-range-picker
                  v-model="timeRange"
                  :presets="presets"
                  :placeholder="['开始时间', '结束时间']"
                  clearable
                  @change="rdpChange"
                  class="form-item-content"
                  :style="{ maxWidth: '250px' }"/>
            </t-col>
          </t-row>
        </t-col>

        <t-col :span="2" class="operation-container">
          <t-button type="reset" variant="base" theme="default"> 重置 </t-button>
          <t-button theme="primary"
                    type="submit"
                    :loading="dataLoading"
                    :style="{ marginLeft: '8px' }"> 查询 </t-button>
        </t-col>
      </t-row>
    </t-form>

    <t-table row-key="id"
             :data="data"
             :loading="dataLoading"
             :pagination="pagination"
             @page-change="rehandlePageChange"
             :columns="columns">
      <template #message="{ row }">
        <div v-if="row.isSuccess === 1">
          <t-tag theme="success">成功</t-tag>
        </div>
        <div v-else>
          <t-popup :content="row.failReason">
            <t-tag theme="danger">失败</t-tag>
          </t-popup>
        </div>
      </template>

      <template #loginType="{row}">
        <span>{{row.loginType==='0'?'账号密码':'二维码'}}</span>
      </template>

    </t-table>
  </t-card>
</template>

<script lang="ts">
export default {
  name: "LoginEventLog"
}
</script>
<script lang="ts" setup>
import {onMounted, ref} from "vue";
import dayjs from "dayjs";
import {request} from "@/utils/request";
import {MessagePlugin} from "tdesign-vue-next";
import {SearchIcon} from "tdesign-icons-vue-next";
const rehandlePageChange = (curr, pageInfo) => {
  pagination.value.pageSize = curr.pageSize
  pagination.value.current = curr.current
  getData()
}
const columns = [
  {
    title: '用户名',
    colKey: 'userName',
    ellipsis: true
  },
  {
    title: '时间',
    colKey: 'time',
    ellipsis: true
  },
  {
    title: 'IP',
    colKey: 'ip',
    ellipsis: true
  },
  {
    title: '地址',
    colKey: 'address',
    ellipsis: true
  },
  {
    title: '系统',
    colKey: 'os',
    ellipsis: true
  },
  {
    title: '登录方式',
    colKey: 'loginType',
    ellipsis: true
  },
  {
    title: '信息',
    colKey: 'message'
  }
]
const data = ref([])
const timeRange = ref([])
const searchData = ref({
  userName: '',
  startTime: '',
  endTime: ''
})
const reset = ()=>{
  searchData.value.userName = ''
  searchData.value.startTime = ''
  searchData.value.endTime = ''
  timeRange.value = []
}
const pagination = ref({
  pageSize: 10,
  total: 100,
  current: 1,
});
const dataLoading = ref(false)
const getData = ()=>{
  console.log({...searchData.value})
  dataLoading.value = true
  request.get({
    url: '/v1/user/api/web/getLoginEventList',
    params: {
      ...searchData.value,
      size: pagination.value.pageSize,
      page: pagination.value.current
    }
  }).then(res=>{
    dataLoading.value = false
    data.value = res.list
    pagination.value.total = res.total
  }).catch(err=>{
    dataLoading.value = false
    MessagePlugin.error(err.message)
  })
}
onMounted(()=>{
  getData()
})
const rdpChange = (val)=>{
  searchData.value.startTime = val[0] === undefined ? '' : val[0]
  searchData.value.endTime = val[1] === undefined ? '' : val[1]
}
const presets = ref({
  "最近7天": [dayjs().subtract(6, 'day'), dayjs()],
  "最近3天": [dayjs().subtract(2, 'day'), dayjs()],
  "今天": [dayjs(), dayjs()],
});

</script>

<style lang="less" scoped>
.list-common-table {
  background-color: var(--td-bg-color-container);
  padding: 30px 32px;
  border-radius: var(--td-radius-default);

  .table-container {
    margin-top: 30px;
  }
}

.form-item-content {
  width: 100%;
}

.operation-container {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  .expand {
    .t-button__text {
      display: flex;
      align-items: center;
    }
    .t-icon {
      margin-left: 4px;
      transition: transform 0.3s ease;
    }
  }
}

.payment-col {
  display: flex;

  .trend-container {
    display: flex;
    align-items: center;
    margin-left: 8px;
  }
}
</style>
