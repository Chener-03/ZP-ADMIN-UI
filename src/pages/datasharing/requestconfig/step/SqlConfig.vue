<template>
  <t-space direction="vertical" style="width: 100%">


    <t-row :gutter="10">
      <t-col :span="3">
        <t-select v-model="data.orgId"
                  :loading="orgLoading"
                  placeholder="请选择组织"
                  @change="onOrgChange(true)"
                  :options="orgOptions"></t-select>
      </t-col>
      <t-col :span="4">
        <t-select v-model="data.datasourceId"
                  :loading="datasourceLoading"
                  placeholder="请选择数据源"
                  :options="datasourceOptions"></t-select>
      </t-col>
      <t-col :span="5">
        <div style="float: right">
          <t-button shape="circle" theme="default" @click="helpDialog=true">
            <template #icon><HelpIcon /></template>
          </t-button>
        </div>
      </t-col>
    </t-row>


    <div>
      <codemirror
        v-model="data.sql"
        placeholder="这里编辑SQL代码"
        :style="{ height: '600px' }"
        :autofocus="true"
        :indent-with-tab="true"
        :tab-size="2"
        :extensions="extensions"
        @ready="handleReady"
      />
    </div>
  </t-space>

  <t-dialog v-model:visible="helpDialog"
            :confirm-btn="null"
            :cancel-btn="null"
            title="帮助"
            width="500px">
    <div>Sql以分号 ; 区分,多个sql会保存至多个结果集。</div>
    <div>Sql中使用 ${} 来替换变量,并支持表达式计算,Demo请查看文档。</div>
  </t-dialog>
</template>

<script lang="ts">
export default {
  name: "SqlConfig"
}
</script>


<script lang="ts" setup>

import {Codemirror} from "vue-codemirror";
import {onMounted, ref, shallowRef} from "vue";
import { sql } from '@codemirror/lang-sql'
import { HelpIcon} from "tdesign-icons-vue-next";
import {request} from "@/utils/request";
import {MessagePlugin} from "tdesign-vue-next";

const props = defineProps({
  data: {
    type: String,
    default: () => {
      return {
        datasourceId: '',
        orgId: '',
        sql: ''
      }
    }
  }
})

const extensions = [sql()]
const view = shallowRef()
const helpDialog = ref(false)

const datasourceOptions = ref([])
const orgLoading = ref(false)
const orgOptions = ref([])
const datasourceLoading = ref(false)




onMounted(async () => {
  await getOrgOptions()
})

const onOrgChange = (d)=>{
  if (d===true){
    props.data.datasourceId = ''
  }
  if (props.data.orgId) {
    datasourceLoading.value = true
    request.get({
      url:'/v1/datasharing/api/web/datasource/list',
      params:{
        orgId:props.data.orgId,
        queryFields:'id,datasourceName'
      }
    }).then(res=>{
      datasourceOptions.value = res.list.map(item => {
        return {label: item.datasourceName, value: item.id}
      })
    }).catch(err=>{
      MessagePlugin.error(err.message)
    }).finally(()=>{
      datasourceLoading.value = false
    })
  }
}

const getOrgOptions = async () => {
  try {
    orgLoading.value = true
    let res = await request.get({
      url: '/v1/user/api/web/getUserOrgsByConcurrentUser'
    })
    orgOptions.value = res.map(item => {
      return {label: item.orgChSimpleName, value: item.id}
    })
  } catch (err) {
    MessagePlugin.error(err.message)
  } finally {
    orgLoading.value = false
    onOrgChange(false)
  }
}

const handleReady = (payload) => {
  view.value = payload.view
}

</script>


<style scoped>

</style>
