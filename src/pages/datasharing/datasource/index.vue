<template>
  <t-card :bordered="false" :hover-shadow="true">

    <t-alert theme="error" v-if="!isOrgUser" style="margin-bottom: 20px">
      您不是组织用户,看到这个界面是因为您的管理员配置了相关权限,但无法使用此功能.
    </t-alert>


    <t-form :disabled="!isOrgUser">
      <t-space>
        <t-button @click="getData" :loading="dataLoading">查询</t-button>
        <t-button @click="flushAll" >刷新数据源缓存池</t-button>
        <t-button theme="success" @click="addDataSourceClick" >新增</t-button>
      </t-space>
    </t-form>

    <t-table
      :loading="dataLoading"
      :disabled="!isOrgUser"
      style="margin-top: 20px"
      row-key="index"
      :data="data"
      :columns="columns"
      :bordered="false"
      :hover="true"
      :table-layout="'auto'"
      :pagination="pagination"
      @page-change="rehandlePageChange"
      cell-empty-content="-"
      resizable >

      <template #hostPort="{row}">
        <span>{{row.host}}:{{row.port}}</span>
      </template>

      <template #healthy="{row}">
        <t-tag theme="success" v-if="row.healthy===true">健康</t-tag>
        <t-popup content="该数据源连接异常,详细信息请去编辑中测试链接查看返回"  v-else>
          <t-tag theme="danger">异常</t-tag>
        </t-popup>
      </template>

      <template #op="{row}">
        <t-button size="small" @click="handleEdit(row)">编辑</t-button>
        <t-popconfirm theme="danger" content="删除会导致该数据源绑定的所有查询失效,继续?" @confirm="handleDelete(row)">
          <t-button theme="danger" size="small" >删除</t-button>
        </t-popconfirm>
      </template>

    </t-table>

  </t-card>
</template>

<script lang="ts">
export default {
  name: "DataSource"
}
</script>

<script lang="ts" setup>

import {onMounted, ref} from "vue";
import {request} from "@/utils/request";
import {DialogPlugin, MessagePlugin} from "tdesign-vue-next";
import {useRouter} from "vue-router";

const isOrgUser = ref(true)
const data = ref([])
const router = useRouter()
const pagination = ref({
  pageSize: 10,
  total: 0,
  current: 1,
});
const dataLoading = ref(false)
const columns = [
  { colKey: 'id', title: 'ID', ellipsis: true },
  { colKey: 'datasourceName', title: '名称', ellipsis: true },
  { colKey: 'hostPort', title: '地址', ellipsis: true },
  { colKey: 'orgSimpleName', title: '所属组织', ellipsis: true },
  { colKey: 'createTime', title: '创建时间', ellipsis: true },
  { colKey: 'type', title: '连接类型', ellipsis: true },
  { colKey: 'healthy', title: '状态', ellipsis: true },
  { colKey: 'op', title: '操作', ellipsis: true,fixed: 'right' },
]
const formSearch = ref({
  datasourceName: ''
})
const getData = ()=>{
  if (!isOrgUser.value) return;
  dataLoading.value = true
  request.get({
    url: '/v1/datasharing/api/web/datasource/list',
    params: {
      ...formSearch.value,
      page: pagination.value.current,
      size: pagination.value.pageSize
    }
  }).then(res=>{
    data.value = res.list
    pagination.value.total = res.total
  }).catch(err=>{
    MessagePlugin.error(err.message)
  }).finally(()=>{
    dataLoading.value = false
  })
}

const handleEdit = (row)=>{
  router.push({
    path: '/datasharing/editDatasource',
    query: {
      id: row.id,
      type: 'edit'
    }
  })
}

const addDataSourceClick = ()=>{
  router.push({
    path: '/datasharing/editDatasource',
    query: {
      type: 'new'
    }
  })
}

const handleDelete = (id)=>{
  request.delete({
    url: '/v1/datasharing/api/web/datasource/delete',
    params: {
      id: id
    }
  }).then(res=>{
    MessagePlugin.success('删除成功')
    getData()
  }).catch(err=>{
    MessagePlugin.error(err.message)
  })
}

const getIsOrgUser = async ()=>{
  try {
    let res = await request.get({
      url:'/v1/user/api/web/getSelfOtherInfo'
    });
    isOrgUser.value = !(res.orgName === null || res.orgName === '');
  }catch (err) {
    isOrgUser.value = false
  }
}

const rehandlePageChange = (curr, pageInfo) =>{
  pagination.value.pageSize = curr.pageSize
  pagination.value.current = curr.current
  getData()
}


const flushAll = ()=>{
  let dialog = DialogPlugin.confirm({
    header: '提示',
    theme:"warning",
    body: "该操作会刷新所有链接池，包括正在进行查询的，可能会造成部分请求异常，继续?",
    onConfirm:(ctx)=>{
      request.post({
        url: '/v1/datasharing/api/web/datasource/flushAllDatasource'
      }).then(res=>{
        MessagePlugin.success('刷新成功')
        dialog.destroy()
      }).catch(err=>{
        MessagePlugin.error(err.message)
      })
    }
  })
}

onMounted(async ()=>{
  await getIsOrgUser()
  getData()
})

</script>

<style lang="less" scoped>

</style>
