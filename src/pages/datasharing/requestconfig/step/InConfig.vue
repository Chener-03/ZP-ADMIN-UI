<template>
  <div v-for="(item,index) in data" style="margin-bottom: 10px" >
<!--   参数名 必填 默认 校验 转换    -->
    <t-row :gutter="5">
      <t-col :span="3">
        <t-input v-model="item.paramKey" clearable placeholder="参数名"></t-input>
      </t-col>
      <t-col :span="3">
        <t-select v-model="item.must" :options="[
          {label: '必填', value: true},
          {label: '选填', value: false}
        ]" placeholder="是否必填"></t-select>
      </t-col>
      <t-col :span="3">
        <t-input v-model="item.defaultValue" clearable placeholder="默认值" style="width: 100%"></t-input>
      </t-col>
      <t-col :span="3">
        <t-select v-model="item.transformTypes" :options="[
          {label: 'Base64', value: 'BASE64DECODE'}
        ]" placeholder="转换" clearable></t-select>
      </t-col>
    </t-row>
    <t-row :gutter="5" style="margin-top: 5px">
      <t-col :span="3">
        <t-select v-model="item.verifyTypes" :options="[
          {label: 'NUMBER', value: 'NUMBER_VERIFY_TYPE'},
          {label: 'STRING', value: 'STRING_VERIFY_TYPE'},
          {label: 'SQL_INJECT', value: 'SQL_INJECT_VERIFY_TYPE'},
          {label: 'REGULAR', value: 'REGULAR:'},
        ]" placeholder="验证" clearable></t-select>
      </t-col>
      <t-col :span="3">
        <t-input :disabled="getDisable(item)" v-model="item.reg" clearable placeholder="正则表达式"></t-input>
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
  </div>
</template>

<script lang="ts">
export default {
  name: "InConfig"
}
</script>


<script lang="ts" setup>

import {ref} from "vue";
import {AddIcon} from "tdesign-icons-vue-next";

const props = defineProps({
  data: {
    type: Array,
    default: () => {
      return []
    }
  }
})


const addIn = ()=>{
  props.data.push({
    must: false,
  })
}

const getDisable = (item)=>{
  return item.verifyTypes !== 'REGULAR:'
}

const removeType = (index)=>{
  props.data.splice(index,1)
}

</script>


<style scoped>

</style>
