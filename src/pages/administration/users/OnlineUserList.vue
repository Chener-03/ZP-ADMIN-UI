
<template>
<div>
  <t-table row-key="id"
           style="margin-top: 10px"
           :data="data"
           :columns="columns"
           :loading="loading"
           :hover="true">
  </t-table>
</div>
</template>


<script setup lang="ts">
//@ts-nocheck

import {onMounted, ref} from "vue";
import {request} from "@/utils/request";
import {MessagePlugin} from "tdesign-vue-next";

const loading = ref(false)

const data = ref([])

onMounted(() => {

  loading.value = true
  //@ts-ignore
  request.get({
    url: '/v1/user/api/web/getWsOnlineUsersData'
  }).then(res => {
    data.value = res
  }).catch(err => {
    MessagePlugin.error(err.message)
  }).finally(() => {
    loading.value = false
  })
})

const columns = [
  {
    title: '会话ID',
    colKey: 'sessionId'
  },
  {
    title: '用户',
    colKey: 'username'
  },
  {
    title: 'IP地址',
    colKey: 'ip'
  },
  {
    title: '平台',
    colKey: 'system'
  }
]

</script>


<style scoped lang="less">

</style>
