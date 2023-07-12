<template>
  <div v-for="(item,index) in data" style="margin-bottom: 15px" >
<!--  参数key 展示key 默认值 格式化类型 格式化表达式 转换类型  -->
    <t-row :gutter="5">
      <t-col :span="3">
        <t-input v-model="item.paramKey" clearable placeholder="数据库字段"></t-input>
      </t-col>
      <t-col :span="3">
        <t-input v-model="item.showKey" clearable placeholder="展示字段"></t-input>
      </t-col>
      <t-col :span="3">
        <t-input v-model="item.defaultValue" clearable placeholder="默认值"></t-input>
      </t-col>
      <t-col :span="3">
        <t-select v-model="item.transformTypes" :options="[
          {label: 'Base64', value: 'BASE64ENCODE'},
          {label: '脱敏', value: 'antianaphylaxis'}
        ]" placeholder="转换类型" clearable></t-select>
      </t-col>
    </t-row>
    <t-row :gutter="5" style="margin-top: 5px">
      <t-col :span="3">
        <t-select v-model="item.fomatterType" :options="[
          {label: 'TIME', value: 'TIME'}
        ]" placeholder="格式化类型" clearable></t-select>
      </t-col>
      <t-col :span="3">
        <t-input :disabled="getDisable(item)" v-model="item.fomatterExp" clearable placeholder="格式化表达式"></t-input>
      </t-col>
      <t-col :span="5"> </t-col>
      <t-col :span="1">
        <t-button theme="danger" variant="text" @click="removeType(index)">移除</t-button>
      </t-col>
    </t-row>
  </div>
  <div style="text-align: center">
    <t-button theme="primary" variant="text" @click="addIn">
      <template #icon><add-icon /></template>
      添加参数映射
    </t-button>
    <t-button theme="primary" variant="text" @click="dialogShow=true">
      <template #icon><add-icon /></template>
      执行SQL以导入
    </t-button>
  </div>

  <t-dialog v-model:visible="dialogShow"
            :confirm-btn="null"
            :destroy-on-close="true"
            :cancel-btn="null"
            header="获取结果"
            width="500px">
    <t-alert theme="error" v-if="getTestEnable" style="margin-bottom: 20px">
      检测到未配置数据源，请先配置数据源
    </t-alert>

    <t-space style="width: 100%" direction="vertical">
      <t-textarea
        v-model="testSql"
        placeholder="输入要执行的sql"
        :autosize="{ minRows: 3, maxRows: 10 }"
      />

      <t-button :disabled="getTestEnable" :loading="getColumnLoading" @click="getColumn">获取</t-button>
    </t-space>

  </t-dialog>

</template>

<script lang="ts">
export default {
  name: "OutConfig"
}
</script>

<script lang="ts" setup>

import {AddIcon} from "tdesign-icons-vue-next";
import {computed, ref} from "vue";
import {request} from "@/utils/request";
import {MessagePlugin} from "tdesign-vue-next";

const props = defineProps({
  data: {
    type: Array,
    default: () => {
      return []
    }
  },
  sqlData: {
    type: String,
    default: () => {
      return {
        datasourceId: '',
        orgId: '',
      }
    }
  }
})

const dialogShow = ref(false)

const addIn = ()=>{
  props.data.push({
    must: false,
  })
}


const getTestEnable = computed(()=>{
  return props.sqlData.datasourceId === '' || props.sqlData.datasourceId === undefined || props.sqlData.datasourceId === null
})

const removeType = (index)=>{
  props.data.splice(index,1)
}

const getDisable = (item)=>{
  return item.fomatterType !== 'TIME'
}

const getColumnLoading = ref(false)
const testSql = ref('')
const getColumn = ()=>{
  let sql = testSql.value
  let datasourceId = props.sqlData.datasourceId
  if (!sql || !datasourceId) {
    MessagePlugin.error('请先配置数据源和SQL')
    return
  }
  getColumnLoading.value = true
  request.post({
    url: '/v1/datasharing/api/web/requestConfig/getSqlResultParam',
    params:{
      sql:sql,
      datasourceId: datasourceId
    }
  }).then(res=>{
    let i = 0;
    for (i = 0;i<res[0].length;i++) {
      props.data.push({
        paramKey: res[0][i],
        showKey: res[1][i],
      })
    }
    MessagePlugin.success(`成功添加${i}个参数`)
    dialogShow.value = false
  }).catch(err=>{
    MessagePlugin.error(err.message)
  }).finally(()=>{
    getColumnLoading.value = false
  })
}

</script>

<style scoped>

</style>
