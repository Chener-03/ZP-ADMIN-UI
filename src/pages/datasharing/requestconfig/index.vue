<template>
  <t-card :bordered="false" :hover-shadow="true">
    <t-alert theme="error" v-if="!isOrgUser" style="margin-bottom: 20px">
      您不是组织用户,看到这个界面是因为您的管理员配置了相关权限,但无法使用此功能.
    </t-alert>

    <t-form :disabled="!isOrgUser">
      <t-space>
        <t-button @click="getData" :loading="dataLoading">查询</t-button>
        <t-dropdown :options="options" @click="downClickHandler">
          <t-space>
            <t-button>
              文档
              <template #suffix> <t-icon name="chevron-down" size="16" /></template>
            </t-button>
          </t-space>
        </t-dropdown>
        <t-button theme="success" @click="addClick" >新增</t-button>
      </t-space>
    </t-form>

    <t-table
      :loading="dataLoading"
      :disabled="!isOrgUser"
      style="margin-top: 20px"
      row-key="id"
      :data="data"
      :columns="columns"
      :bordered="false"
      :hover="true"
      :table-layout="'auto'"
      :pagination="pagination"
      @page-change="rehandlePageChange"
      cell-empty-content="-"
      v-model:selected-row-keys="selectedRowKeys"
      resizable >

      <template #requestUid="{row}">
        <t-popup :content="`http://ip:port/v1/datasharing/api/web/datasharing/out/${row.requestUid}`">
          {{row.requestUid}}
        </t-popup>
      </template>

      <template #dayLimit="{row}">
          {{row.dayLimit === 0 ? '无限制' : `${row.dayLimit}次`}}
      </template>

      <template #byteReqLimit="{row}">
        {{row.byteReqLimit === '0' ? '无限制' : `${row.byteReqLimit}字节`}}
      </template>

      <template #byteReturnLimie="{row}">
        {{row.byteReturnLimie === '0' ? '无限制' : `${row.byteReturnLimie}字节`}}
      </template>

      <template #enable="{row}">
        <t-tag theme="success" v-if="row.enable===true">启用</t-tag>
        <t-tag theme="danger" v-else>禁用</t-tag>
      </template>



      <template #op="{row}">
        <t-button size="small" @click="handleEdit(row)">编辑</t-button>
        <t-popconfirm theme="danger" content="确认删除?" @confirm="handleDelete(row)">
          <t-button theme="danger" size="small" >删除</t-button>
        </t-popconfirm>
      </template>

    </t-table>


  </t-card>
</template>

<script lang="ts">
export default {
  name: "index"
}
</script>

<script lang="ts" setup>
import {onMounted, ref} from "vue";
import {request} from "@/utils/request";
import {useRouter} from "vue-router";
import {MessagePlugin} from "tdesign-vue-next";
import axios from "axios";
import proxy from "@/config/proxy";
import {TOKEN_NAME} from "@/config/global";

const options = [
  { content: '导出选中', value: 1 },
  { content: '导出全部', value: 2 }
];


const env = import.meta.env.MODE || 'development';
const host = env === 'mock' || !proxy.isRequestProxy ? '' : proxy[env].host;
const headers = {
  'Authorization': localStorage.getItem(TOKEN_NAME)
}

const downClickHandler = (val)=>{
  if (val.value === 1 && selectedRowKeys.value.length === 0) {
    MessagePlugin.error('请先选择要导出的数据')
    return
  }
  if (val.value === 1) {
    axios({
      url: `${host}/v1/datasharing/api/web/requestConfig/getDocumentMDsFile?id=${selectedRowKeys.value.join(',')}`,
      method: 'GET',
      headers: headers,
      responseType: 'blob'
    }).then(response=>{
      const contentDisposition = response.headers['content-disposition'];
      const regex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
      const matches = regex.exec(contentDisposition);
      const fileName = (matches != null && matches[1]) ? matches[1].replace(/['"]/g, '') : 'example.txt';
      const decodeFileName = decodeURI(fileName)
      const link = document.createElement('a');
      link.href = URL.createObjectURL(response.data);
      link.download = decodeFileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    })
  } else {
    MessagePlugin.info('待完善')
  }


}

const isOrgUser = ref(true)

const dataLoading = ref(false)
const data = ref([])
const router = useRouter()
const pagination = ref({
  pageSize: 10,
  total: 0,
  current: 1,
});
const selectedRowKeys = ref([])
const columns = [
  {
    colKey: 'id',
    type: 'multiple',
    width: 50,
  },
  { colKey: 'requestName', title: '名称', ellipsis: true },
  { colKey: 'requestUid', title: '地址', ellipsis: true },
  { colKey: 'orgName', title: '所属', ellipsis: true },
  { colKey: 'createUserName', title: '创建人', ellipsis: true },
  { colKey: 'dayLimit', title: '日调用', ellipsis: true },
  { colKey: 'byteReqLimit', title: '请求限制', ellipsis: true },
  { colKey: 'byteReturnLimie', title: '响应限制', ellipsis: true },
  { colKey: 'enable', title: '状态', ellipsis: true },
  { colKey: 'requestMethod', title: '方法', ellipsis: true },
  { colKey: 'paramType', title: '参数类型', ellipsis: true },
  { colKey: 'dayCount', title: '今日调用', ellipsis: true },
  { colKey: 'op', title: '操作', ellipsis: true,fixed: 'right' },
]

const searchForm = ref({})
const getData = ()=>{

  dataLoading.value = true
  request.get({
    url:'/v1/datasharing/api/web/requestConfig/list',
    params: {
      size: pagination.value.pageSize,
      page: pagination.value.current,
      ...searchForm.value
    }
  }).then(res=>{
    pagination.value.total = res.total
    data.value = res.list
  }).catch(err=>{
    MessagePlugin.error(err.message)
  }).finally(()=>{
    dataLoading.value = false
  })

}


const handleEdit = (row)=>{
  router.push({
    path: '/datasharing/editRequest',
    query: {
      id: row.id,
      type: 'edit'
    }
  })
}

const rehandlePageChange = (curr, pageInfo) =>{
  pagination.value.pageSize = curr.pageSize
  pagination.value.current = curr.current
  getData()
}


const addClick = ()=>{
  router.push({
    path: '/datasharing/editRequest'
  })
}

const handleDelete = (row)=>{
  request.delete({
    url: `/v1/datasharing/api/web/requestConfig/delete/${row.id}`
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

onMounted(async ()=>{
  await getIsOrgUser()
  getData()
})

</script>

<style scoped>

</style>
