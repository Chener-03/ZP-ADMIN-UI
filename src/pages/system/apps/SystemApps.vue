<template>
<div>
  <t-card :bordered="false" hover-shadow>

    <t-form :label-width="0">
      <t-form-item>
        <t-button theme="primary" @click="getData" >查询</t-button>
      </t-form-item>
    </t-form>

    <t-table
      style="margin-top: 20px"
      row-key="id"
      :data="data"
      :columns="columns"
      :loading="dataLoading"
      :size="size"
      :pagination="pagination"
      :expanded-row="true"
      :expand-on-row-click="false"
    >
      <template #hosts="{ row }">
        <span>{{`${row.hosts.ip}:${row.hosts.port}`}}</span>
      </template>
      <template #healthy="{ row }">
        <t-tag :theme="row.hosts.healthy===true ? 'success' : 'danger'">{{row.hosts.healthy===true  ? '正常' : '异常'}}</t-tag>
      </template>
      <template #expandedRow="{ row }">
        <span>{{`元数据: ${JSON.stringify(row.hosts.metadata)}`}}</span>
      </template>
      <template #op="{ row }">
        <t-button variant="text" theme="primary" size="small" @click="jmpInfo(`${row.hosts.ip}:${row.hosts.port}`)">详情</t-button>
      </template>

    </t-table>

  </t-card>
</div>
</template>

<script lang="ts">
export default {
  name: "SystemApps"
}
</script>

<script lang="ts" setup>

import {Base64} from "js-base64";
import {onMounted, ref} from "vue";
import {request} from "@/utils/request";
import {MessagePlugin} from "tdesign-vue-next";

import {useRouter} from "vue-router";
const router = useRouter();
const data = ref([]);
const dataLoading = ref(false);
const tableLayout = ref(false);
const size = ref('medium');
const showHeader = ref(true);

const columns = ref([
  { colKey: 'name', title: '服务名',ellipsis: true },
  {
    title: '上次刷新',
    ellipsis: true,
    colKey: 'lastRefTime',
  },
  {
    title: 'IP',
    ellipsis: true,
    colKey: 'hosts',
  },
  {
    title: '状态',
    ellipsis: true,
    colKey: 'healthy',
  },
  {
    title: '更多',
    ellipsis: true,
    colKey: 'op',
    width: 100,
  },
]);

const jmpInfo = (url)=>{

  router.push({
    path: '/system/appInfo',
    query: {
      url: Base64.encode(url)
    }
  });
}

const getData = ()=>{
  dataLoading.value = true;
  request.get({
    url: '/v1/system/api/web/getInstances',
    params: { }
  }).then((res)=>{
    data.value = res;
    let a = 1;
    for (let i of data.value) {
      i.id = a++;
    }
    pagination.value.total = res.length;
  }).catch(err=>{
    MessagePlugin.error(err.message);
  }).finally(()=>{
    dataLoading.value = false;
  })
}

const pagination = ref({
  defaultCurrent: 1,
  defaultPageSize: 10,
  total: 0,
});

onMounted(()=>{
  getData();
})

</script>

<style scoped>

</style>
