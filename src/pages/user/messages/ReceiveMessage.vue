<template>
  <div style="margin: 20px">
    <t-row :gutter="15">
      <t-col :span="2">
        <t-select size="small" clearable v-model="formData.isread" placeholder="状态">
          <t-option value="0" label="未读"></t-option>
          <t-option value="1" label="已读"></t-option>
        </t-select>
      </t-col>
      <t-col :span="2">
        <t-select size="small" clearable  v-model="formData.imp" placeholder="类型">
          <t-option value="0" label="普通"></t-option>
          <t-option value="1" label="重要"></t-option>
          <t-option value="2" label="非常重要"></t-option>
        </t-select>
      </t-col>
      <t-col :span="2">
        <t-button size="small"  theme="primary" :loading="tableLoading" @click="getData">查询</t-button>
      </t-col>
    </t-row>

    <t-table :data="tableData"
    style="margin-top: 10px"
    :pagination="pagination"
    :loading="tableLoading"
    @page-change="rehandlePageChange"
    :columns="columns" >
      <template #title="{row}">
        <t-badge dot :offset="[-5, 2]" v-if="row.isread===false">
          <span>{{row.title}} </span>
        </t-badge>
        <span v-else>{{row.title}}</span>

      </template>
      <template #imp="{row}">
        <t-tag v-if="row.imp === '0'"   theme="default">普通</t-tag>
        <t-tag v-if="row.imp === '1'"   theme="warning">重要</t-tag>
        <t-tag v-if="row.imp === '2'"  theme="danger">非常重要</t-tag>
      </template>
      <template #op="{row}">
        <t-button variant="text" size="small" @click="jmpToLookUp(row.id)">查看</t-button>

        <t-popconfirm theme="danger" content="确认删除?" @confirm="deleteMessage(row.id)">
          <t-button variant="text" size="small" theme="danger"  >删除</t-button>
        </t-popconfirm>
      </template>
    </t-table>

  </div>
</template>

<script lang="ts">
export default {
  name: "ReceiveMessage"
}
</script>
<script lang="ts" setup>
import {onMounted, ref} from "vue";

import {useRoute, useRouter} from "vue-router";
import {request} from "@/utils/request";
import {MessagePlugin} from "tdesign-vue-next";
import {useNotificationStore} from "@/store";
const router = useRouter();

const jmpToLookUp = (id: number) => {
   router.push({
      path: '/user/messages/lookupMessage',
      query: {
        id: id
      }
   });
}
const tableData = ref([])
const pagination = ref({
  pageSize: 10,
  total: 100,
  current: 1,
});
const tableLoading = ref(false)
const rehandlePageChange = (curr, pageInfo) =>{
  pagination.value.pageSize = curr.pageSize
  pagination.value.current = curr.current
  getData()
}
const columns = [
  {
    title: "发件人",
    colKey: 'sendUserName'
  },
  {
    title: "标题",
    colKey: 'title'
  },
  {
    title: "类型",
    colKey: 'imp',
  },
  {
    title: "时间",
    colKey: 'createTime',
    ellipsis: true,
  },
  {
    title: "操作",
    colKey: 'op',
  }

]
const getData = ()=>{
  tableLoading.value = true
  request.get({
    url: '/v1/user/api/web/getMessagesList',
    params: {
      page: pagination.value.current,
      size: pagination.value.pageSize,
      isReceive:true,
      ...formData.value
    }
  }).then((res)=>{
    tableLoading.value = false
    tableData.value = res.list
    pagination.value.total = res.total
  }).catch((err)=>{
    tableLoading.value = false
    MessagePlugin.error(err.message)
  })
}

const formData = ref({
  imp:'',
  isread:'',
})
const deleteMessage = (id)=>{
  request.post({
    url: '/v1/user/api/web/removeMessage',
    params: {
      messageId: id,
      isReceive:true
    }
  }).then((res)=>{
    if (res === true){
      MessagePlugin.success('删除成功')
      getData()
    }else {
      MessagePlugin.error('删除失败')
    }
  }).catch((err)=>{
    MessagePlugin.error(err.message)
  })
}

onMounted(() => {
  getData()
  useNotificationStore().requestMsgData()
})

</script>
<style scoped>

</style>
