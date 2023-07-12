<template>

  <t-card :bordered="false" :hover-shadow="true">
    <div style="margin-bottom: 20px">
      <t-button shape="circle" theme="default" @click="goBack">
        <template #icon><ArrowLeftIcon /></template>
      </t-button>
    </div>

    <t-loading :loading="loadingData">
      <t-form ref="fromRef"
              :data="formData"
              :label-align="'top'"
              :rules="formRules">
        <t-form-item v-if="formData.id" label="ID" name="id">
          <t-input disabled v-model="formData.id"></t-input>
        </t-form-item>
        <t-form-item label="所属组织" name="orgId">
          <t-select :loading="orgLoading" v-model="formData.orgId" :disabled="formData.id" :options="orgOptions" filterable></t-select>
        </t-form-item>
        <t-form-item label="数据源名称" name="datasourceName">
          <t-input v-model="formData.datasourceName" clearable></t-input>
        </t-form-item>
        <t-form-item label="数据源地址" name="host">
          <t-input v-model="formData.host" clearable></t-input>
        </t-form-item>
        <t-form-item label="数据源端口" name="port">
          <t-input v-model="formData.port" clearable></t-input>
        </t-form-item>
        <t-form-item label="用户名" name="username">
          <t-input v-model="formData.username" clearable></t-input>
        </t-form-item>
        <t-form-item label="密码" name="password">
          <t-input v-model="formData.password" clearable></t-input>
        </t-form-item>
        <t-form-item label="数据库" name="databaseName">
          <t-input v-model="formData.databaseName" clearable></t-input>
        </t-form-item>
        <t-form-item label="类型" name="type">
          <t-select v-model="formData.type">
            <t-option value="mysql" label="MySQL">MySQL</t-option>
            <t-option value="oracle" label="Oracle">Oracle</t-option>
            <t-option value="SQL Server" label="SQL Server">SQL Server</t-option>
            <t-option value="PostgreSQL" label="Postgre SQL">Postgre SQL</t-option>
            <t-option value="OceanDB" label="OceanDB">OceanDB</t-option>
            <t-option value="TiDB" label="TiDB">TiDB</t-option>
          </t-select>
        </t-form-item>
        <t-form-item label="参数" name="params" class="lasti">
          <div v-for="(item,index) in datasourceParams" style="margin-bottom: 10px">
            <t-row :gutter="20">
              <t-col :span="5">
                <t-select
                  v-model="item.key"
                  creatable
                  filterable
                  placeholder="参数名"
                  :options="paramOptions"
                  @create="createOptions"
                />
              </t-col>
              <t-col :span="6">
                <t-input v-model="item.value" clearable placeholder="值"></t-input>
              </t-col>
              <t-col :span="1">
                <t-button theme="danger" variant="text" @click="removeDatasourceParams(index)">移除</t-button>
              </t-col>
            </t-row>
          </div>
          <div style="text-align: center" >
            <t-button theme="primary" variant="text" @click="addDatasourceParams">
              <template #icon><add-icon /></template>
              添加参数
            </t-button>
          </div>



        </t-form-item>

        <t-form-item  class="btn">
          <div>
            <t-button theme="success" :loading="loadingTest" @click="onTestClick">测试连接</t-button>
            <t-button theme="primary" :loading="loadingSave" @click="onSaveClick">保存数据源</t-button>
          </div>
        </t-form-item>

      </t-form>
    </t-loading>

  </t-card>

</template>

<script lang="ts">
export default {
  name: "DataSourceEdit"
}
</script>

<script lang="ts" setup>
import {useRoute, useRouter} from "vue-router";
import {AddIcon, ArrowLeftIcon} from "tdesign-icons-vue-next";
import {onMounted, ref} from "vue";
import {request} from "@/utils/request";
import {MessagePlugin, NotifyPlugin} from "tdesign-vue-next";
import {Base64} from "js-base64";

const router = useRouter()
const route = useRoute()
const type = ref('')   // new edit

const loadingData = ref(false)
const loadingTest = ref(false)
const formRules = {
  datasourceName: [{ required: true, message: '数据源名称不可为空', type: 'error' }],
  orgId: [{ required: true, message: '所属组织不可为空', type: 'error' }],
  host: [{ required: true, message: '数据源地址不可为空', type: 'error' }],
  port: [{required: true, message: '数据源端口不可为空', type: 'error' }],
  databaseName: [{ required: true, message: '数据库不可为空', type: 'error' }],
  type: [{ required: true, message: '类型不可为空', type: 'error' }],
}

const formData = ref({})
const fromRef = ref(null)
const paramOptions = ref([
  { label: 'useUnicode', value: 'useUnicode' },
  { label: 'characterEncoding', value: 'characterEncoding' },
  { label: 'useSSL', value: 'useSSL' },
  { label: 'autoReconnect', value: 'autoReconnect' },
  { label: 'connectTimeout', value: 'connectTimeout' },
  { label: 'socketTimeout', value: 'socketTimeout' },
  { label: 'cachePrepStmts', value: 'cachePrepStmts' },
  { label: 'prepStmtCacheSize', value: 'prepStmtCacheSize' },
  { label: 'prepStmtCacheSqlLimit', value: 'prepStmtCacheSqlLimit' },
  { label: 'useJDBCCompliantTimezoneShift', value: 'useJDBCCompliantTimezoneShift' },
  { label: 'serverTimezone', value: 'serverTimezone' },
  { label: 'rewriteBatchedStatements', value: 'rewriteBatchedStatements' },
  { label: 'cacheResultSetMetadata', value: 'cacheResultSetMetadata' },
  { label: 'useCompression', value: 'useCompression' }
])
const orgOptions = ref([])
const orgLoading = ref(false)
const getOrgOptions = async ()=>{
  try {
    orgLoading.value = true
    let res = await request.get({
      url: '/v1/user/api/web/getUserOrgsByConcurrentUser'
    })
    orgOptions.value = res.map(item=>{
      return {label: item.orgChSimpleName, value: item.id}
    })
  }catch (err){
    MessagePlugin.error(err.message)
  }finally {
    orgLoading.value = false
  }
}
const createOptions = (val) => {
  paramOptions.value.push({
    label: `${val}`,
    value: val,
  });
};
const datasourceParams = ref([ ])
const encodeParams = ()=>{
  let params = ''
  datasourceParams.value.forEach(item=>{
    if (item.key && item.value){
      params += item.key + '=' + item.value + '&'
    }
  })
  return params
}

const decodeParams = (params)=>{
  let paramsArr = params.split('&')
  let result = []
  paramsArr.forEach(item=>{
    let arr = item.split('=')
    result.push({key: arr[0], value: arr[1]})
  })
  return result
}


const addDatasourceParams  =()=>{
  datasourceParams.value.push({key: '', value: ''})
}
const removeDatasourceParams = (index)=>{
  datasourceParams.value.splice(index, 1)
}

const goBack = ()=>{
  router.back()
}

const getData = async (id)=>{
  if (type.value === 'new') {
    await getOrgOptions();
  }
  if (id === null || id === undefined || id === '')
    return;
  if (type.value === 'edit') {
    loadingData.value = true
    await getOrgOptions();
    request.get({
      url: '/v1/datasharing/api/web/datasource/list',
      params: {
        id: id
      }
    }).then(res=>{
      if (res.list.length === 0) {
        MessagePlugin.error('数据源不存在')
        return
      }
      formData.value = res.list[0]
      datasourceParams.value = decodeParams(formData.value.paramUrl)
    }).catch(err=>{
      MessagePlugin.error(err.message)
    }).finally(()=>{
      loadingData.value = false
    })
  }
}

const onTestClick = ()=>{
  fromRef.value.validate().then(res=>{
    if (res === true){
      let pm = {...formData.value};
      if (pm.username){
        pm.username = Base64.encode(pm.username)
      }
      if (pm.password){
        pm.password = Base64.encode(pm.password)
      }
      pm.paramUrl = encodeParams()
      loadingTest.value = true
      request.post({
        url:'/v1/datasharing/api/web/datasource/testConnection',
        params: {
          ...pm
        }
      }).then(res=>{
        if (res.success === true){
          NotifyPlugin.success({
            closeBtn: true,
            title: '测试连接成功',
            content: `${pm.host}:${pm.port}`
          })
        }else {
          NotifyPlugin.error({
            closeBtn: true,
            title: '测试连接失败',
            content: `${res.message}`
          })
        }
      }).catch(err=>{
        MessagePlugin.error(err.message)
      }).finally(()=>{
        loadingTest.value = false
      })

    }
  })
}

const loadingSave = ref(false)
const onSaveClick = ()=>{
fromRef.value.validate().then(res=>{
    if (res === true){
      let pm = {...formData.value};
      if (pm.username){
        pm.username = Base64.encode(pm.username)
      }
      if (pm.password){
        pm.password = Base64.encode(pm.password)
      }
      pm.paramUrl = encodeParams()
      request.post({
        url: '/v1/datasharing/api/web/datasource/save',
        params: {
          ...pm
        }
      }).then(res=>{
        if (res !== null){
          NotifyPlugin.success({
            closeBtn: true,
            title: '保存成功',
            content: `${res.datasourceName}`
          })
          goBack()
        }else {
          NotifyPlugin.error({
            closeBtn: true,
            title: '保存失败'
          })
        }
      }).catch(err=>{
        MessagePlugin.error(err.message)
      })
    }
  })
}

onMounted(async ()=>{
  // @ts-ignored
  type.value = route.query.type
  let id = route.query.id
  await getData(id)
})

</script>

<style lang="less"  >

.lasti .t-form__controls-content {
  display: block;
}

.btn .t-form__controls-content{
  display: inline-block;
  float: right;
}

</style>
