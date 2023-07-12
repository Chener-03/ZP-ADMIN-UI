<template>
  <t-form ref="fromRef"
          :data="formData"
          :label-align="'left'"
          :label-width="150"
          :rules="formRules">
    <t-form-item v-if="formData.id" label="ID" name="id">
      <t-input v-model="formData.id" disabled></t-input>
    </t-form-item>
    <t-form-item label="所属" name="orgId">
      <t-select v-model="formData.orgId" :disabled="formData.id" :loading="orgLoading" :options="orgOptions"
                filterable></t-select>
    </t-form-item>
    <t-form-item label="名称" name="requestName">
      <t-input v-model="formData.requestName" clearable></t-input>
    </t-form-item>

    <t-form-item label="地址" name="requestUid" style="width: 100%">
      <t-input-adornment prepend="http://ip:port/v1/datasharing/api/web/datasharing/out/" style="width: 100%">
        <t-input v-model="formData.requestUid" clearable></t-input>
      </t-input-adornment>
    </t-form-item>

    <t-form-item label="日限制" name="dayLimit">
      <t-input-number style="width: 100%" v-model="formData.dayLimit" :min="0" theme="column"></t-input-number>
    </t-form-item>

    <t-form-item label="请求字节限制" name="byteRequestLimit">
      <t-input-number style="width: 100%" v-model="formData.byteReqLimit" :min="0" theme="column"></t-input-number>
    </t-form-item>

    <t-form-item label="响应字节限制" name="byteReturnLimie">
      <t-input-number style="width: 100%" v-model="formData.byteReturnLimie" :min="0" theme="column"></t-input-number>
    </t-form-item>

    <t-form-item label="状态" name="enable">
      <t-select v-model="formData.enable" :options="[{label: '启用', value: true}, {label: '禁用', value: false}]"></t-select>
    </t-form-item>

    <t-form-item label="方法" name="requestMethod">
      <t-select v-model="formData.requestMethod" @change="getParamTypeOptions"
                :options="[
                  {label: 'GET', value: 'GET'},
                  {label: 'POST', value: 'POST'},
                  {label: 'PUT', value: 'PUT'},
                  {label: 'DELETE', value: 'DELETE'},
                  {label: 'PATCH', value: 'PATCH'},
                  {label: 'HEAD', value: 'HEAD'},
                ]">
      </t-select>
    </t-form-item>

    <t-form-item label="参数类型" name="paramType">
      <t-select v-model="formData.paramType"
                :options="paramTypeOptions">
      </t-select>
    </t-form-item>

  </t-form>
</template>

<script lang="ts">
export default {
  name: "BaseInfoConfig"
}
</script>

<script lang="ts" setup>
import {request} from "@/utils/request";
import {MessagePlugin} from "tdesign-vue-next";
import {onActivated, onMounted, ref} from "vue";

const props = defineProps({
  formData: {
    type: Object,
    default: () => {
      return {}
    }
  },
  formRef: {
    type: Object,
    default: () => {
      return null
    }
  }
})

const orgLoading = ref(false)
const orgOptions = ref([])

// const fromRef = ref(null)
// const formData = ref({})
const formRules = {}


const paramTypeOptions = ref([])
const getParamTypeOptions = ()=>{
  if (!props.formData.requestMethod){
    paramTypeOptions.value = [
      {label: 'JSON', value: 'JSON'},
      {label: 'FORM', value: 'FORM'},
      {label: 'QUERY', value: 'QUERY'}
    ]
  }else if (props.formData.requestMethod === 'GET'){
    paramTypeOptions.value = [
      {label: 'QUERY', value: 'QUERY'}
    ]
  }else {
    paramTypeOptions.value = [
      {label: 'JSON', value: 'JSON'},
      {label: 'FORM', value: 'FORM'}
    ]
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
  }
}

onMounted(async () => {
  await getOrgOptions()
})


</script>


<style lang="less" scoped>
/deep/ .t-input-adornment {
  width: 100%;
  font: var(--td-font-body-medium);
  color: var(--td-text-color-primary);
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
}
</style>
