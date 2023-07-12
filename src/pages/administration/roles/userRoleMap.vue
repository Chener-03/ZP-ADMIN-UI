<template>
<div style="margin-left: 10px;margin-right: 10px;margin-bottom: 10px">

  <t-row justify="end">
    <t-col :span="3" style="margin-top: 10px">
      <t-select
        v-model="formData.users"
        multiple
        filterable
        placeholder="搜索用户"
        :options="formUsersOptions"
        :loading="formUsersSelectLoading"
        reserve-keyword
        style="width: 90%; display: inline-block"
        @search="formUsersRemoteMethod"
      />
    </t-col>
    <t-col :span="3" style="margin-top: 10px">
      <t-select
        v-model="formData.role"
        filterable
        placeholder="角色"
        clearable
        :options="formRolesOptions"
        style="width: 90%; display: inline-block"
      />
    </t-col>
    <t-col :lg="2" :md="3" :sm="12" style="margin-top: 10px">
      <div style="float: right;margin-right: 20px">
        <t-button theme="primary" @click="setUsersRole" >授权</t-button>
        <t-button theme="success" @click="getData(pagination.current,pagination.pageSize)">查询</t-button>
      </div>
    </t-col>
  </t-row>
  <t-base-table
    style="margin-top: 10px"
    row-key="id"
    :data="data"
    :loading="dataLoading"
    :pagination="pagination"
    @page-change="rehandlePageChange"
    :hover="true"
    :columns="columns" >

    <template #roleName="{row}">
      <t-tag theme="success" variant="outline">{{row.roleName}}</t-tag>
    </template>

    <template #op="{row}">
      <t-popconfirm theme="danger" content="移除后该用户将无法正常使用" @confirm="onDeleteBtnClick(row)">
        <t-button theme="danger" size="small" >移除权限</t-button>
      </t-popconfirm>
    </template>

  </t-base-table>



</div>
</template>

<script lang="ts">
export default {
  name: "UserRoleMap"
}
</script>

<script lang="ts" setup>
import {onMounted, ref} from "vue";
import {request} from "@/utils/request";
import {DialogPlugin, MessagePlugin, NotifyPlugin} from "tdesign-vue-next";
const dataLoading = ref(false)
const columns = ref([
  {
    title: '用户名',
    align: 'left',
    width: 150,
    colKey: 'username',
  },
  {
    title: '别名',
    colKey: 'nameCn',
    width: 200,
  },
  {
    title: '联系方式',
    ellipsis: true,
    colKey: 'phone',
  },
  {
    title:'角色',
    colKey: 'roleName'
  },
  {
    title: '操作',
    colKey: 'op',
    width: 120,
    fixed: 'right'
  },
]);
const pagination = ref({
  pageSize: 10,
  total: 100,
  current: 1,
});
const data = ref([
])
const formData = ref({
  users:[],
  role:''
})
const formUsersRemoteMethod = async (val)=>{
  if (val){
    formUsersSelectLoading.value = true
    try {
      //@ts-ignore
      const res = await request.get({
        url: '/v1/user/api/web/getUserAllInfo',
        params: {
          page: 1,
          size: 100,
          username:val,
          isLike:true,
          queryFields:'id,username'
        }
      })
      formUsersOptions.value = res.list.map(item=>{
        return {
          label: item.username,
          value: item.id
        }
      })
    }catch (err){
      MessagePlugin.error(err.message)
    }
    finally {
      formUsersSelectLoading.value = false
    }
  }
}
const formUsersOptions = ref([])
const formRolesOptions = ref([])
const formUsersSelectLoading = ref(false)
const setUsersRole = async ()=>{
  console.log(formData.value.users.length)
  if (formData.value.users.length === 0 || (formData.value.role === '' || formData.value.role === null)){
    MessagePlugin.error('请选择用户和角色')
    return
  }
  let dialog = DialogPlugin.confirm({
    header:'警告',
    body: '此操作可能会替换用户原有角色,继续？',
    theme:"warning",
    onConfirm: async () => {
      formData.value.users.forEach(item=>{
        doSaveRole(item,formData.value.role)
      })
      dialog.destroy()
    },
  });
}
const doSaveRole = async (userId,roleId)=>{
  try {
    //@ts-ignore
    await request.post({
      url: '/v1/user/api/web/setUserRole',
      data: {
        id: userId,
        roleId: roleId
      }
    })
    NotifyPlugin.info({ title: '授权成功',content:'用户ID:'+userId ,closeBtn: true  });
    formData.value.users=[]
    getData(pagination.value.current,pagination.value.pageSize)
  }catch (err){
    NotifyPlugin.error({ title: '授权失败',content:err.message,closeBtn: true });
  }
}
const getRoles = async ()=>{
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
    formRolesOptions.value = res.list.map(item=>{
      return {
        label: item.roleName,
        value: item.id
      }
    })
  }catch (err){
    MessagePlugin.error(err.message)
  }
}
const rehandlePageChange = (curr, pageInfo) =>{
  pagination.value.pageSize = curr.pageSize
  pagination.value.current = curr.current
  getData(pagination.value.current,pagination.value.pageSize)
}
const getData = (page,size)=>{
  dataLoading.value = true
  let u = null
  if (formData.value.users.length>0){
    u = formData.value.users[0]
  }
  //@ts-ignore
  request.get({
    url: '/v1/user/api/web/getUserAllInfo',
    params: {
      page: page,
      size: size,
      roleNotNull:true,
      id:u,
      roleId:formData.value.role,
    }
  }).then(res=>{
    dataLoading.value = false
    data.value = res.list
    pagination.value.total = res.total
  }).catch(err=>{
    dataLoading.value = false
    MessagePlugin.error(err)
  })
}
const onDeleteBtnClick = (row)=>{
  //@ts-ignore
  request.post({
    url: '/v1/user/api/web/setUserRole',
    data: {
      id: row.id
    }
  }).then(res=>{
    MessagePlugin.success('移除成功')
    getData(pagination.value.current,pagination.value.pageSize)
  }).catch(err=>{
    MessagePlugin.error(err.message)
  })
}
onMounted(()=>{
  getData(pagination.value.current,pagination.value.pageSize)
  getRoles()
})

</script>

<style scoped>

</style>
