<template>
  <div v-for="(item,index) in data" style="margin-bottom: 10px">
    <t-row :gutter="10">
      <t-col :span="3">
        <t-select
          v-model="item.authType"
          filterable
          placeholder="方式"
          :options="[
            {label: 'MD5', value: 'md5_xyz.chener.zp.datasharing.requestProcess.entity.pe.AuthPe'},
            {label: 'IP白名单', value: 'ip_xyz.chener.zp.datasharing.requestProcess.entity.pe.AuthPe'},
            {label: 'HEAD', value: 'head_xyz.chener.zp.datasharing.requestProcess.entity.pe.AuthPe'},
          ]"
        />
      </t-col>
      <t-col :span="8">
        <t-textarea
          v-model="item.value"
          :placeholder="getPlaceholder(item)"  :autosize="true"/>
      </t-col>
      <t-col :span="1">
        <t-button theme="danger" variant="text" @click="removeType(index)">移除</t-button>
      </t-col>
    </t-row>
  </div>
  <div style="text-align: center" >
    <t-button theme="primary" variant="text" @click="addAuth">
      <template #icon><add-icon /></template>
      添加授权类型
    </t-button>
  </div>
</template>

<script lang="ts">
export default {
  name: "AuthConfig"
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

// const data = ref([])

const addAuth = ()=>{
  props.data.push({
    authType: 'md5_xyz.chener.zp.datasharing.requestProcess.entity.pe.AuthPe',
    value: ''
  })
}

const getPlaceholder = (item)=>{
  if(item.authType === 'md5_xyz.chener.zp.datasharing.requestProcess.entity.pe.AuthPe'){
    return '输入格式为: \'存放MD5的字段:盐:参数1,参数2,以此类推...\''
  }else if(item.authType === 'ip_xyz.chener.zp.datasharing.requestProcess.entity.pe.AuthPe'){
    return '输入格式为: \'第一个IP,第二个IP.......\''
  }else if(item.authType === 'head_xyz.chener.zp.datasharing.requestProcess.entity.pe.AuthPe'){
    return '输入格式为: \'key0=value0&key1=value1 ........ \''
  }
}

const removeType = (index)=>{
  props.data.splice(index,1)
}

</script>


<style scoped>

</style>
