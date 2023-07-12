<template>
<div>
  <t-card :bordered="false" :hover-shadow="true">
    <t-button shape="circle" theme="default" @click="goBack" style="margin-bottom: 10px;margin-left: 10px">
      <template #icon><ArrowLeftIcon /></template>
    </t-button>
    <t-loading size="small" :loading="loadingData">
      <t-list :split="true">
        <t-list-item v-for="item in data" >
          <t-list-item-meta :title="item.name" :description="item.status" />
        </t-list-item>
      </t-list>
    </t-loading>

  </t-card>
</div>
</template>

<script lang="ts">
export default {
  name: "AppInfo"
}
</script>

<script lang="ts" setup>

import {useRoute, useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import {rotate} from "zrender/lib/core/matrix";
import {request} from "@/utils/request";
import {ArrowLeftIcon} from "tdesign-icons-vue-next";
const router = useRouter()
const route = useRoute();
const url = ref(null);
const data = ref([])
const loadingData = ref(false)
const goBack = ()=>{
  router.push('/system/apps')
}
const getData = ()=>{
  if (url.value === null){
    return
  }
  loadingData.value = true
  //@ts-ignore
  request.get({
    url:'/v1/system/api/web/getInstanceInfo',
    params:{
      url:url.value
    }
  }).then(res=>{
    loadingData.value = false
    data.value = res
  }).catch(err=>{
    loadingData.value = false

  })

}
onMounted(() => {
  route.query.url && (url.value = route.query.url);
  getData()
});

</script>

<style scoped>

</style>
