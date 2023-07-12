<template>
  <t-button theme="primary"
            style="margin: 10px"
            @click="onAddClicked">新增</t-button>

  <t-button theme="primary"
            style="margin: 10px"
            @click="flushUiRoles"  :loading="flushUiRoleBtnLoading">重载界面权限列表</t-button>

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
      <span>{{row.roleName}}</span>
      <t-popup v-if="row.id < 1000">
        <t-tag style="margin-left: 3px"  theme="primary" size="small" variant="outline">默</t-tag>
        <template #content>
          <div>看到此标签时,说明此角色为默认角色,不可改变</div>
        </template>
      </t-popup>
    </template>

    <template #permissionEnNameList="{row}">
      <t-select :value="transformPermissionList(row.permissionEnNameList)"
                :options="selectOp"
                :min-collapsed-num="3"
                @click="selectOpClick"
                @change="selectOpClick"
                class="hiddenSvg"
                placeholder="无权限" multiple >
      </t-select>
    </template>

    <template #op="{row}">
      <t-button theme="primary" size="small" @click="onEditClicked(row)">编辑</t-button>
      <t-button theme="danger" size="small" @click="onDeleteBtnClick(row)">删除</t-button>
    </template>

  </t-base-table>


  <t-dialog
    v-model:visible="dialogVisible"
    :header="false"
    :close-btn="true"
    :destroy-on-close="true"
    :confirm-on-enter="true"
    :close-on-overlay-click="false"
    width="700px"
    height="1000px"
    :cancel-btn="null"
    :confirm-btn="null" >
    <t-form :data="dialogForm"
            ref="dialigFormRefdialigFormRef"
            :labelAlign="'top'"
            :rules="dialogFormRules"
            @submit="dialogFormSubmit">
      <t-form-item name="roleName" label="角色名">
        <t-input v-model="dialogForm.roleName" clearable placeholder="请输入"></t-input>
      </t-form-item>

      <t-form-item name="permissionEnNameList" label="角色权限">
        <t-transfer :data="selectOp"
                    v-model:value="dialogForm.permissionEnNameList"
                    :operation="['移除', '添加']"
                    :search="true"
                    style="width: 100%;">
          <template #title="props">
            <div>{{ props.type === 'target' ? '用户权限' : '所有权限' }}</div>
          </template>
          <template #footer="props">
            <div style="padding: 12px; border-top: 1px solid #e7e7e7">
              <span v-if="props.type === 'source'">选中并加入</span>
              <span v-else>选中并移除</span>
            </div>
          </template>
        </t-transfer>
      </t-form-item>
      <t-form-item  style="float: right">
        <t-button type="submit" :loading="dialogSubmitBtnLoading">提交</t-button>
      </t-form-item>
    </t-form>
  </t-dialog>

</template>

<script lang="ts">
export default {
  name: "RoleLists"
}
</script>

<script lang="ts" setup>
import {onMounted, ref} from "vue";
import {request} from "@/utils/request";
import {DialogPlugin, MessagePlugin} from "tdesign-vue-next";
const data = ref([
])
const dialogFormRules = {
  roleName: [
    {required: true, message: '请输入', type: 'error' ,trigger: 'blur'},
    {min:3, message: '请输入3-20位', type: 'error',trigger: 'blur'},
  ],
}
const columns = [
  {
    title: "角色名称",
    colKey: 'roleName',
    width: 200,
  },
  {
    title: "角色权限",
    ellipsis: true,
    colKey: 'permissionEnNameList',
  },
  {
    title: "操作",
    colKey: 'op',
    width: 200,
    fixed: "right",
  }
]
const permissionListConst = ref([])
const selectOp = ref([])
const pagination = ref({
  pageSize: 10,
  total: 100,
  current: 1,
});
const dataLoading = ref(false)
const getPermissionList = () => {
  //@ts-ignore
  request.get({
    url: '/v1/user/api/web/getPermissionListConst'
  }).then(res=>{
    permissionListConst.value = res
    selectOp.value = res.map(item=>{
      return {
        label: item.permissionChName,
        value: item.permissionEnName
      }
    })
  }).catch(err=>{
    MessagePlugin.error(err)
  })
}
const selectOpClick = ()=>{
  MessagePlugin.info('请到编辑中修改')
}
const rehandlePageChange = (curr, pageInfo) =>{
  pagination.value.pageSize = curr.pageSize
  pagination.value.current = curr.current
  getData(pagination.value.current,pagination.value.pageSize)
}
const getData = (page,size)=>{
  dataLoading.value = true
  //@ts-ignore
  request.get({
    url: '/v1/user/api/web/getRoleList',
    params: {
      page: page,
      size: size
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
const dialogForm = ref({
  id: null,
  roleName: '',
  permissionEnNameList: []
})
const dialigFormRef = ref(null)
const dialogFormSubmit = ()=>{
  dialogSubmitBtnLoading.value = true
  let roleListFormat = ''

  if (dialogForm.value.permissionEnNameList !== null && dialogForm.value.permissionEnNameList !== undefined && dialogForm.value.permissionEnNameList.length > 0) {
    dialogForm.value.permissionEnNameList.forEach(item=>{
      roleListFormat += item+','
    })
    roleListFormat = roleListFormat.substring(0,roleListFormat.length-1)
  }

  //@ts-ignore
  request.post({
    url:'/v1/user/api/web/saveRole',
    params: {
      id: dialogForm.value.id,
      roleName: dialogForm.value.roleName,
      roleList: roleListFormat
    }
  }).then(res=>{
    dialogSubmitBtnLoading.value = false
    if (res!==null && res !== undefined){
      MessagePlugin.success('保存成功')
      dialogVisible.value = false
      getData(pagination.value.current,pagination.value.pageSize)
    }else {
      MessagePlugin.error('保存失败')
    }
  }).catch(err=>{
    dialogSubmitBtnLoading.value = false
    MessagePlugin.error(err.message)
  })

}
const resetDialogForm = ()=>{
  dialogForm.value.id = null
  dialogForm.value.roleName = ''
  dialogForm.value.permissionEnNameList = []
}

const getBindUserCount = async (id)=>{
  try {
    //@ts-ignore
    return await request.get({
      url:'/v1/user/api/web/getRoleUserCount?id='+id,
    })
  }catch (err){
    return 0
  }
}

const onDeleteBtnClick = async (row)=>{
  let count = await getBindUserCount(row.id)
  let dialogBodyStr = ''
  if(count>0){
    dialogBodyStr = '该角色已绑定'+count+'个用户，删除后这些用户将无法登录，是否继续删除？'
  }else {
    dialogBodyStr = '是否确认删除？'
  }
  let dialog = DialogPlugin.confirm({
    header: '提示',
    theme:"warning",
    body:dialogBodyStr,
    onConfirm:(ctx)=>{
      //@ts-ignore
      request.post({
        url:'/v1/user/api/web/deleteRole',
        params: {
          id: row.id
        }
      }).then(()=>{
        MessagePlugin.success('删除成功')
        getData(pagination.value.current,pagination.value.pageSize)
      }).catch(err=>{
        MessagePlugin.error(err.message)
      })

      dialog.destroy()
    }
  })
  console.log(count)
}

const dialogVisible = ref(false);
const dialogSubmitBtnLoading = ref(false)
const onEditClicked = (row)=>{
  dialogVisible.value = true
  resetDialogForm()
  dialogForm.value.roleName = row.roleName
  dialogForm.value.id = row.id
  dialogForm.value.permissionEnNameList = transformPermissionList(row.permissionEnNameList)
}
const onAddClicked = ()=>{
  resetDialogForm()
  dialogVisible.value = true
}

const transformPermissionList = (d)=>{
  if (d!==null && d!== undefined)
  {
    return d.split(',')
  }
  return []
}

onMounted(()=>{
  getPermissionList()
  getData(pagination.value.current,pagination.value.pageSize)

})

const flushUiRoleBtnLoading = ref(false)
const flushUiRoles = ()=>{
  flushUiRoleBtnLoading.value = true
  //@ts-ignore
  request.post({
    url: '/v1/user/api/web/flushUiRouting'
  }).then(res=>{
    MessagePlugin.success('刷新成功')
    flushUiRoleBtnLoading.value = false
  }).catch(err=>{
    MessagePlugin.error(err)
    flushUiRoleBtnLoading.value = false
  })
}

</script>

<style lang="less">
.t-transfer__operations{
  width: 12%;
}
.t-transfer__search.t-transfer__footer .t-transfer__list{
  width: 43%;
}

.hiddenSvg{
  svg{
    display: none;
  }
}

</style>
