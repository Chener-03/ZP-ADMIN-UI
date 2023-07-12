<template>
<div>

  <t-space direction="vertical" style="width: 100%">

    <t-card :loading="dataLoading" :bordered="false" :hover-shadow="true" style="border-radius: 6px;">
      <div class="info-block">
        <div class="info-item">
          <h1>组织全称:</h1>
          <t-popup :content="concurrentOrgInfo.orgChName">
            <span>{{ concurrentOrgInfo.orgChName }}</span>
          </t-popup>
        </div>
        <div class="info-item">
          <h1>组织简称:</h1>
          <t-popup :content="concurrentOrgInfo.orgChSimpleName">
            <span>{{ concurrentOrgInfo.orgChSimpleName }}</span>
          </t-popup>
        </div>
        <div class="info-item">
          <h1>组织简介:</h1>
          <t-popup :content="concurrentOrgInfo.orgMessage">
            <span>{{ concurrentOrgInfo.orgMessage }}</span>
          </t-popup>
        </div>
        <div class="info-item">
          <h1>组织类型:</h1>
          <t-popup :content="concurrentOrgInfo.orgType">
            <span>{{getOrgTypeString(concurrentOrgInfo.orgType)}}</span>
          </t-popup>
        </div>
        <div class="info-item">
          <h1>负责人:</h1>
          <t-popup :content="`${concurrentOrgInfo.username}(${concurrentOrgInfo.userChName})`">
          <span>{{ `${concurrentOrgInfo.username}(${concurrentOrgInfo.userChName})` }}</span>
          </t-popup>
        </div>
        <div class="info-item">
          <h1>状态:</h1>
          <span>{{ concurrentOrgInfo.disable === false ? '正常' : '禁用' }}</span>
        </div>


      </div>
    </t-card>

    <t-row :loading="dataLoading"  :gutter="15">
      <t-col :span="4">
        <t-card  title="组织人数"
                 :bordered="false"
                 :hover-shadow="true"
                 :subtitle="`${concurrentOrgExtInfo.userCount}/${concurrentOrgInfo.peopleNum}(人)`">
        </t-card>
      </t-col>

      <t-col :span="4">
        <t-card title="子机构数" :bordered="false" :hover-shadow="true"
                :subtitle="`${concurrentOrgExtInfo.subOrgCount}/${concurrentOrgInfo.subsidiaryNum}(个)`"></t-card>
      </t-col>

      <t-col :span="4">
        <t-card title="活跃人数" :bordered="false"
                :hover-shadow="true"
                :subtitle="`${concurrentOrgExtInfo.activeUserCount}(人)`"></t-card>
      </t-col>
    </t-row>

    <t-card :bordered="false" :hover-shadow="true" style="border-radius: 6px;">
      <t-popconfirm theme="danger" content="移除后这些用户将无法正常使用" @confirm="onDeleteOrgUserClick(null)">
        <t-button theme="danger"  variant="outline" >批量移除</t-button>
      </t-popconfirm>

      <XyzTransition xyz="fade flip-up left-5">
        <t-select v-if="addShow===2"
                  style="width: 150px;display: inline-block;margin-left: 20px"
          v-model="addUserForm"
          filterable
          placeholder="搜索"
          :on-search="remoteUserMethod"
          :loading="remoteUserLoading"
          :options="remoteUserOptions">
        </t-select>
      </XyzTransition>
      <t-button style="margin-left: 10px" theme="primary" :loading="onAddUserBtnLoading"  @click="onAddUserClick">{{addShow===2?'新增':'新增用户'}}</t-button>

      <t-button theme="primary"  variant="outline" :loading="onFlushUserAuthBtnLoading"  @click="flushUserAuth" style="float: right">刷新用户权限</t-button>

      <t-table row-key="id"
               :maxHeight="'450px'"
               style="margin-top: 10px"
               :data="tableData"
               :columns="columns"
               :pagination="pagination"
               :loading="tableLoading"
               :selected-row-keys="selectedRowKeys"
               @select-change="rehandleSelectChange"
               @page-change="rehandlePageChange"
               :hover="true">

        <template #user="{row}">
          <span>{{`${row.userName}(${row.userChName})`}}</span>
        </template>

        <template #authDisable="{row}">
          <t-switch  v-model="row.authDisable" @change="changeUserAuth(row)" />
        </template>

        <template #op="{row}">
          <t-popconfirm theme="danger" content="移除后该用户将无法正常使用" @confirm="onDeleteOrgUserClick(row)">
            <t-button theme="danger" variant="outline" size="small" >移除</t-button>
          </t-popconfirm>
        </template>

      </t-table>

    </t-card>

  </t-space>

  <t-drawer
    destroyOnClose
    sizeDraggable
    :close-btn="true"
    v-model:visible="drawerVisible0"
    :close-on-overlay-click="false"
    size="40%"
    @close="onDrawerClose"
    header="header">
    <template #confirmBtn>
      <t-button theme="primary" :loading="submitBtnLoading" @click="onOrgInfoSubmit">保存</t-button>
    </template>
    <t-form :loading="submitBtnLoading" :data="orgInfoForm" ref="orgInfoFormRef" :rules="orgInfoFormRules">
      <t-form-item label="组织全称" name="orgChName">
        <t-input placeholder="请输入内容" v-model="orgInfoForm.orgChName" />
      </t-form-item>
      <t-form-item label="组织简称" name="orgChSimpleName" >
        <t-input placeholder="请输入内容" v-model="orgInfoForm.orgChSimpleName"/>
      </t-form-item>
      <t-form-item label="组织简介" name="orgMessage" >
        <t-input placeholder="请输入内容" v-model="orgInfoForm.orgMessage"/>
      </t-form-item>
      <t-form-item label="组织类型" name="orgType" >
        <t-select placeholder="请选择" v-model="orgInfoForm.orgType" :options="orgTypeOptions"> </t-select>
      </t-form-item>
      <t-form-item label="上级组织" name="parentId" >
        <t-cascader v-model="orgInfoForm.parentId" :options="parentOrgTreeOption"
                    :show-all-levels="false"
                    check-strictly />
      </t-form-item>
      <t-form-item label="子机构规模" name="subsidiaryNum" >
        <t-input placeholder="请输入内容" v-model="orgInfoForm.subsidiaryNum"/>
      </t-form-item>
      <t-form-item label="人数" name="peopleNum" >
        <t-input placeholder="请输入内容" v-model="orgInfoForm.peopleNum"/>
      </t-form-item>
      <t-form-item label="排序" name="sortNum" >
        <t-input placeholder="请输入内容" v-model="orgInfoForm.sortNum"/>
      </t-form-item>
      <t-form-item label="负责人" name="mainUserId" >
        <t-select
          v-model="orgInfoForm.mainUserId"
          filterable
          placeholder="请选择"
          :on-search="remoteUserMethod"
          :loading="remoteUserLoading"
          :options="remoteUserOptions">
        </t-select>
      </t-form-item>
      <t-form-item label="角色" name="roleId" >
        <t-select
          v-model="orgInfoForm.roleId"
          filterable
          placeholder="角色"
          clearable
          :options="remoteRoleOptions">
        </t-select>
      </t-form-item>
    </t-form>
  </t-drawer>
</div>
</template>

<script lang="ts">
export default {
  name: "OrgSetting"
}
</script>

<script lang="ts" setup>

import {onMounted, ref, watch} from "vue";
import {request} from "@/utils/request";
import {MessagePlugin} from "tdesign-vue-next";

const addShow = ref(1)
const addUserForm = ref(null)
const onAddUserBtnLoading = ref(false)
const rehandlePageChange = (curr, pageInfo) =>{
  pagination.value.pageSize = curr.pageSize
  pagination.value.current = curr.current
  getOrgUsers()
}
const onDeleteOrgUserClick = (row)=>{
  let userIds = ''
  if(row === null){
    userIds = selectedRowData.value.join(',')
  }else {
    userIds = row.userId
  }
  if (userIds === '') {
    MessagePlugin.error('请先选择用户')
    return
  }


  request.post({
    url:'/v1/user/api/web/deleteOrgUser',
    params:{
      // @ts-ignore
      orgId:concurrentOrgInfo.value.id,
      userIds:userIds
    }
  }).then(res=>{
    MessagePlugin.success('移除成功')
    getOrgUsers()
  }).catch(err=>{
    MessagePlugin.error(err)
  })
}
const onAddUserClick = ()=>{
  if (addShow.value!==2) {
    addShow.value = 2
    return
  }
  if (addUserForm.value === null ) {
    MessagePlugin.error('请先选择用户')
    return
  }
  onAddUserBtnLoading.value = true
  request.post({
    url:'/v1/user/api/web/addOrgUser',
    params:{
      // @ts-ignore
      orgId:concurrentOrgInfo.value.id,
      userIds:addUserForm.value
    }
  }).then(res=>{
    onAddUserBtnLoading.value = false
    MessagePlugin.success('添加成功')
    getOrgUsers()
    addUserForm.value = null
    addShow.value = 1
  }).catch(err=>{
    onAddUserBtnLoading.value = false
    MessagePlugin.error(err)
  })
}
const onFlushUserAuthBtnLoading = ref(false)
const flushUserAuth = ()=>{
  onFlushUserAuthBtnLoading.value = true
  request.post({
    url:'/v1/user/api/web/flushOrgUserAuth',
    params:{
      // @ts-ignore
      orgId:concurrentOrgInfo.value.id,
    }
  }).then(res=>{
    onFlushUserAuthBtnLoading.value = false
    MessagePlugin.success('刷新成功')
  }).catch(err=>{
    onFlushUserAuthBtnLoading.value = false
    MessagePlugin.error(err)
  })
}

const changeUserAuth = (row)=>{

  request.post({
    url:'/v1/user/api/web/disableOrgUserAuth',
    params:{
      // @ts-ignore
      orgId:concurrentOrgInfo.value.id,
      userIds:row.userId,
      disable:row.authDisable
    }
  }).then(res=>{
    MessagePlugin.success('修改成功')
  }).catch(err=>{
    MessagePlugin.error(err)
  })
}

const props = defineProps({
  concurrentNode: {
    type:Object,
    required:true
  },
  drawerVisible: {
    type:Boolean,
    required:true
  },
})
const emit = defineEmits(["drawerClose","orgTreeFlush"])
const onDrawerClose = ()=>{
  emit('drawerClose')
}
const dataLoading = ref(false)

watch(()=>props.drawerVisible, (newVal, oldVal)=>{
  drawerVisible0.value = newVal
})

watch(()=>props.concurrentNode.id, (newVal, oldVal)=>{
  getOrgInfo()
  getOrgExtInfo()
  getOrgUsers()
})
const tableLoading = ref(false)
const concurrentOrgInfo = ref({})
const concurrentOrgExtInfo = ref({})
const getOrgUsers = ()=>{
  tableLoading.value = true
  // @ts-ignore
  request.get({
    url:'/v1/user/api/web/getOrgUsers',
    params:{
      id:props.concurrentNode.id,
      page:pagination.value.current,
      pageSize:pagination.value.pageSize
    }
  }).then(res=>{
    tableLoading.value = false
    tableData.value = res.list
    pagination.value.total = res.total
  }).catch(err=>{
    tableLoading.value = false
    MessagePlugin.error(err.message)
  })

}
const getOrgExtInfo = ()=>{
  // @ts-ignore
  request.get({
    url:'/v1/user/api/web/getOrgExtendInfo',
    params:{
      id:props.concurrentNode.id
    }
  }).then(res=>{
    concurrentOrgExtInfo.value = res
  }).catch(err=>{
    MessagePlugin.error(err.message)
  })
}
const getOrgInfo = ()=>{
  console.log(props.concurrentNode.id)
  // @ts-ignore
  request.get({
    url:'/v1/user/api/web/getOrgInfo',
    params:{
      id:props.concurrentNode.id
    }
  }).then(res=>{
    concurrentOrgInfo.value = res
  }).catch(err=>{
    MessagePlugin.error(err.message)
  })
}

const drawerVisible0 = ref(false)
const tableData = ref([])
const pagination = ref({
  pageSize: 10,
  total: 100,
  current: 1,
});
const columns = [
  {
    colKey: 'row-select',
    type: 'multiple',
    width: 50,
    reserveSelectedRowOnPaginate:false
  },
  {
    title: "用户",
    colKey: 'user',
    ellipsis: true,
    width: 150,
  },
  {
    title: "加入日期",
    ellipsis: true,
    colKey: 'bindTime',
  },
  {
    title: "禁用权限",
    colKey: 'authDisable',
  },
  {
    title: "操作",
    position: 'right',
    colKey: 'op',
  }
]
const selectedRowKeys = ref([])
const selectedRowData = ref([])
const rehandleSelectChange = (value, data) => {
  selectedRowKeys.value = value
  selectedRowData.value = []
  data.selectedRowData.forEach((item) => {
    selectedRowData.value.push(item.userId)
  })
}

const orgIngoFormIsNew = ref(true)
const orgInfoFormRef = ref(null)
const orgInfoFormRules = {
  orgChName: [
    {
      required: true,
      message: '请输入组织名称',
      trigger: 'blur',
    },
  ],
  orgChSimpleName: [
    {
      required: true,
      message: '请输入组织名称',
      trigger: 'blur',
    },
  ],
  orgType: [
    {
      required: true,
      message: '请选择组织类型',
      trigger: 'blur',
    },
  ],
  parentId: [
    { validator : (res)=>{
        return new Promise((resolve) => {
          if (orgIngoFormIsNew.value) {
            return resolve({ result: true, message: '可用', type: 'success', trigger: 'blur' })
          }
          // @ts-ignore
          if( res == concurrentOrgInfo.value.id){
            return resolve({ result: false, message: '不可选自身', type: 'error', trigger: 'blur' })
          }else {
            return resolve({ result: true, message: '可用', type: 'success', trigger: 'blur' })
          }
        })
      }}
  ],
  subsidiaryNum: [
    {
      required: true,
      message: '请输入子机构规模',
      trigger: 'blur',
    },
  ],
  peopleNum: [
    {
      required: true,
      message: '请输入人数',
      trigger: 'blur',
    },
  ],
  sortNum: [
    {
      required: true,
      message: '请输入排序',
      trigger: 'blur',
    },
  ],
  mainUserId: [
    {
      required: true,
      message: '请输入负责人',
      trigger: 'blur',
    },
  ],
  roleId: [
    {
      required: true,
      message: '请输入角色',
      trigger: 'blur',
    },
  ],
}
const orgInfoForm = ref({})

const onOrgEditClicked = ()=>{
  orgIngoFormIsNew.value = false
  drawerVisible0.value = true
  orgInfoForm.value = Object.assign({},concurrentOrgInfo.value)
  remoteUserOptions.value = []
  remoteUserOptions.value.push({
    // @ts-ignore
    label:`${concurrentOrgInfo.value.username}(${concurrentOrgInfo.value.userChName})`, userChName:concurrentOrgInfo.value.userChName, value:concurrentOrgInfo.value.mainUserId
  })
}
const onOrgNewClicked = ()=>{
  orgIngoFormIsNew.value = true
  drawerVisible0.value = true
  orgInfoForm.value = {}
  remoteUserOptions.value = []
}

const parentOrgTreeOption = ref([])
const parseParentOrgTreeOption = (data)=>{
  let result = []
  data.forEach(item=>{
    let obj = {
      label:item.label,
      value:item.id+'',
      children:[]
    }
    if(item.children && item.children.length>0){
      obj.children = parseParentOrgTreeOption(item.children)
    }
    result.push(obj)
  })
  return result
}

const paeseParentOrgTree = (data)=>{
  parentOrgTreeOption.value = parseParentOrgTreeOption(data)
}

const submitBtnLoading = ref(false)
const onOrgInfoSubmit = ()=>{
  console.log(orgInfoForm.value)
  orgInfoFormRef.value.validate().then(res=>{
    if (res === true){
      submitBtnLoading.value = true
      // @ts-ignore
      request.post({
        url:'/v1/user/api/web/saveOrgInfo',
        data:orgInfoForm.value
      }).then(res=>{
        submitBtnLoading.value = false
        drawerVisible0.value = false
        MessagePlugin.success('保存成功')
        getOrgInfo()
        getOrgExtInfo()
        emit('orgTreeFlush')
      }).catch(err=>{
        submitBtnLoading.value = false
        MessagePlugin.error(err.message)
      })
    }
  })
}

const orgTypeOptions = ref([])
const getOrgTypeString = (data)=>{
  let result = ''
  orgTypeOptions.value.forEach(item=>{
    if(item.value == data){
      result = item.label
    }
  })
  return result
}
const getOrgTypeOption = ()=>{
  // @ts-ignore
  request.get({
    url:'/v1/user/api/web/getOrgTypesJson',
  }).then(res=>{
    orgTypeOptions.value = JSON.parse(res)
  }).catch(err=>{
    MessagePlugin.error(err.message)
  })
}
onMounted(()=>{
  getOrgTypeOption()
  getAllRoles()
})

const remoteUserOptions = ref([])
const remoteUserLoading = ref(false)
const remoteUserMethod = (data)=>{
  console.log(data)
  remoteUserLoading.value = true
  // @ts-ignore
  request.get({
    url:'/v1/user/api/web/getUserAllInfo',
    params:{
      username:data,
      isLike:true,
      queryFields:'username,nameCn,id'
    }
  }).then(res=>{
    remoteUserLoading.value = false
    remoteUserOptions.value = []
    res.list.forEach(item=>{
      remoteUserOptions.value.push({
        label:`${item.username}(${item.nameCn})`
        , nameCn:item.nameCn, value:item.id
      })
    })
  }).catch(err=>{
    remoteUserLoading.value = false
    MessagePlugin.error(err.message)
  })
}


const remoteRoleOptions = ref([])

const getAllRoles = async ()=>{
  try {
    //@ts-ignore
    const res = await request.get({
      url: '/v1/user/api/web/getRoleList',
      params: {
        page: 1,
        size: 999,
        queryFields:'roleName,id'
      }
    })
    remoteRoleOptions.value = res.list.map(item=>{
      return {
        label: item.roleName,
        value: item.id
      }
    })
  }catch (err){
    MessagePlugin.error(err.message)
  }
}

defineExpose({
  onOrgEditClicked,
  onOrgNewClicked,
  paeseParentOrgTree,
  getOrgInfo
})



</script>

<style lang="less" scoped>
.info-block {
  column-count: 3;

  .info-item {
    padding: 10px 0;
    display: flex;
    color: var(--td-text-color-primary);

    h1 {
      width: 100px;
      font: var(--td-font-body-medium);
      color: var(--td-text-color-secondary);
      font-weight: normal;
      text-align: left;

      @media (max-width: @screen-sm-max) {
        width: 70px;
      }

      @media (min-width: @screen-md-min) and (max-width: @screen-md-max) {
        width: 70px;
      }
    }

    span {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      margin-left: 20px;
    }
  }
}
.t-switch.t-is-checked{
  background-color: #ff0000;
}
</style>
