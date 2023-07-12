<template>

  <div v-if="node.id === null" style="text-align: center">
    <MenuNotChangeIcon style="height: calc(60vh);width: calc(60vh);"></MenuNotChangeIcon>
    <div>
      <span>请选择右侧</span>
    </div>
  </div>
  <div v-else style="margin: 20px">
    <t-form :data="formData"
            ref="formRef"
            :loading="formLoading"
            @submit="onSubmit"
            :rules="formRules"
            :label-width="100">
      <t-form-item label="唯一Id" name="id">
        <t-input v-model="formData.id" :disabled="true"></t-input>
      </t-form-item>
      <t-form-item label="URL路径" name="path">
        <t-input v-model="formData.path" :disabled="formData.id!==null&&formData.id!==undefined"></t-input>
      </t-form-item>
      <t-form-item label="权限名称" name="name">
        <t-input v-model="formData.name" :disabled="formData.id!==null&&formData.id!==undefined"></t-input>
      </t-form-item>
      <t-form-item  label="组件名称" name="component">
        <t-input v-model="formData.component"></t-input>
      </t-form-item>
      <t-form-item  label="跳转路径" name="redirect">
        <t-input v-model="formData.redirect" :disabled="formData.id!==null&&formData.id!==undefined"></t-input>
      </t-form-item>
      <t-form-item  label="父组件" name="parentId">
        <t-select v-model="formData.parentId" :options="parentIdList" placeholder="请选择" />
      </t-form-item>
      <t-form-item  label="标题名称" name="metaTitle">
        <t-input v-model="formData.metaTitle" ></t-input>
      </t-form-item>
      <t-form-item  label="展示图标" name="metaIcon">
        <t-select
          v-model="formData.metaIcon"
          placeholder="请选择"
          :popup-props="{ overlayInnerStyle: { width: '400px' } }" >
          <t-option v-for="item in iconOptions" :key="item.stem" :value="item.stem" class="overlay-options">
            <div>
              <t-icon :name="item.stem" />
            </div>
          </t-option>
          <template #valueDisplay><t-icon :name="formData.metaIcon" :style="{ marginRight: '8px' }" />{{ formData.metaIcon }}</template>
        </t-select>
      </t-form-item>
      <t-form-item  label="默认展开" name="metaExpanded">
        <t-select v-model="formData.metaExpanded">
          <t-option :key="true" label="是" value="true"/>
          <t-option :key="false" label="否" value="false"/>
        </t-select>
      </t-form-item>
      <t-form-item  label="菜单顺序" name="metaOrderNo">
        <t-input-number v-model="formData.metaOrderNo" theme="row" :min="0" :max="9999" :defaultValue="0"/>
      </t-form-item>
      <t-form-item  label="是否隐藏" name="metaHidden">
        <t-select v-model="formData.metaHidden">
          <t-option :key="true" label="是" :value="true"/>
          <t-option :key="false" label="否" :value="false"/>
        </t-select>
      </t-form-item>
      <t-form-item  label="面包屑隐藏" name="metaHiddenBreadcrumb">
        <t-select v-model="formData.metaHiddenBreadcrumb">
          <t-option :key="true" label="是" :value="true"/>
          <t-option :key="false" label="否" :value="false"/>
        </t-select>
      </t-form-item>
      <t-form-item  label="外网地址" name="metaFrameSrc0">
        <t-input-adornment style="width: 100%">
          <template #prepend>
            <t-select v-model="formData.frameUrlPre1">
              <t-option :key="'http://'" label="http://" value="http://"/>
              <t-option :key="'https://'" label="https://" value="https://"/>
            </t-select>
          </template>
          <t-input v-model="formData.metaFrameSrc0" ></t-input>
        </t-input-adornment>
      </t-form-item>
      <t-form-item  label="新建窗口" name="metaFrameBlank">
        <t-select v-model="formData.metaFrameBlank">
          <t-option :key="true" label="是" value="true"/>
          <t-option :key="false" label="否" value="false"/>
        </t-select>
      </t-form-item>
      <t-form-item style="float: right">
        <t-button theme="danger" @click="onDelete" v-if="formData.id!==null&&formData.id!==undefined" style="margin-bottom: 20px;margin-right: 20px">删除</t-button>
        <t-button type="submit" :loading="formSubmicLoading" style="margin-bottom: 20px;margin-right: 20px">保存</t-button>
      </t-form-item>
    </t-form>
  </div>

</template>

<script lang="ts">
import {watch} from "vue";
export default {
  name: "SingleMenu",
}
</script>

<script lang="ts" setup>

import {onMounted, ref, watch} from "vue";
import {request} from "@/utils/request";
import {DialogPlugin, MessagePlugin} from "tdesign-vue-next";
import { manifest } from 'tdesign-icons-vue-next/lib/manifest';
import MenuNotChangeIcon from '@/assets/user/menu/meunNotChange.svg';

const emit = defineEmits(["listChange"])

const props = defineProps({
  node: {
    type: Object,
    required: true
  }
})
const formLoading = ref(false)
const formData = ref({})
const parentIdList = ref([])
const getParentIds = async () => {
  try {
    const res = await request.get({
      url: '/v1/user/api/web/getAllParentMenus'})
    parentIdList.value = []
    parentIdList.value.push({value: null, key: null, label: 'ROOT'})
    res.forEach((item) => {
      parentIdList.value.push({
        value : item.id,
        key : item.id,
        label : item.metaTitle
      })
    })
  }catch (e){
    MessagePlugin.error(e.message)
  }
}
const formRules = ref({
  path: [
    {required: true, message: '路径必填', trigger: 'blur'},
    {min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur'}
  ],
  name: [
    {required: true, message: '请输入权限名', trigger: 'blur'},
    {min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur'}
  ],
  component: [
    {required: true, message: '请输入组件', trigger: 'blur'},
    {min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur'}
  ],
  metaTitle: [
    {required: true, message: '请输入标题', trigger: 'blur'},
    {min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur'}
  ]
})
const formRef = ref(null)
const formSubmicLoading = ref(false)
const iconOptions = ref(manifest);
const parseFormData = ()=>{
  // @ts-ignore
  if (formData.value.metaFrameSrc !== null && formData.value.metaFrameSrc !== undefined) {
    // @ts-ignore
    let index = formData.value.metaFrameSrc.indexOf('://')
    if (index !== -1) {
      // @ts-ignore
      formData.value.frameUrlPre1 = formData.value.metaFrameSrc.substring(0, index + 3)
      // @ts-ignore
      formData.value.metaFrameSrc0 = formData.value.metaFrameSrc.substring(index + 3)
    }
  }
}

const encodeFormData = ()=>{
  // @ts-ignore
  if (formData.value.metaFrameSrc0 !== null && formData.value.metaFrameSrc0 !== undefined) {
    // @ts-ignore
    formData.value.metaFrameSrc = formData.value.frameUrlPre1 + formData.value.metaFrameSrc0
  }
}

const getInfo = ()=>{
  if (props.node.id === null)
  {
    formData.value = {}
    return
  }
  formLoading.value = true
  request.get({
    url:'/v1/user/api/web/getMenuInfo',
    params:{
      id: props.node.id
    }
  }).then(res=>{
    formLoading.value = false
    if (res === null || res === undefined)
    {
      formData.value = {}
      MessagePlugin.error('获取菜单信息失败')
    }else {
      formData.value = res
      parseFormData()
    }
  }).catch(err=>{
    formLoading.value = false
    MessagePlugin.error(err.message)
  })
}

const onSubmit = ()=>{
  encodeFormData()
  formRef.value.validate().then(res=>{
    if(res === true)
    {
      formSubmicLoading.value = true
      request.post({
        url:'/v1/user/api/web/saveMenuInfo',
        data:formData.value
      }).then(res=>{
        formSubmicLoading.value = false
        if (res!==null && res!==undefined)
        {
          MessagePlugin.success('保存成功')
          emit('listChange')
        }else {
          MessagePlugin.warning('保存失败')
        }
      }).catch(err=>{
        formSubmicLoading.value = false
        MessagePlugin.error(err.message)
      })
    }
  })
}
const onDelete = ()=>{
  // @ts-ignore
  if (formData.value.id === null || formData.value.id === undefined || formData.value.id === -1)
  {
    return
  }
  let dialog = DialogPlugin.confirm({
    header: '提示',
    body: '删除后可能导致侧边栏异常显示,谨慎删除',
    theme:'danger',
    onConfirm: () => {
      request.post({
        url:'/v1/user/api/web/deleteMenuInfo',
        params:{
          id: formData.value.id
        }
      }).then(res=>{
        dialog.destroy()
        if (res === true)
        {
          MessagePlugin.success('删除成功')
          emit('listChange')
        }else {
          MessagePlugin.warning('删除失败')
        }
      }).catch(err=>{
        dialog.destroy()
        MessagePlugin.error(err.message)
      })
    }
  })
}

const newForm = ()=>{
  formData.value = {}
  MessagePlugin.warning('非开发人员请勿随意配置')
}

watch(()=>props.node.id, (newVal, oldVal)=>{
  if(newVal !== -1)
  {
    getInfo()
  }else {
    newForm()
  }
})
onMounted(()=>{
  getParentIds()
})


</script>

<style lang="less" >

.t-input-adornment {
  width: 100%;
}
.t-input-adornment__prepend {
  width: 26%;
}
.overlay-options {
  display: inline-block;
  font-size: 20px;
}
</style>
