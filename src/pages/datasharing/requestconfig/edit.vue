<template>
  <t-card :bordered="false" :hover-shadow="true">
    <div style="margin-bottom: 20px">
      <t-button shape="circle" theme="default" @click="goBack">
        <template #icon><ArrowLeftIcon /></template>
      </t-button>
    </div>

    <t-row>
      <t-col :span="2">
        <t-steps layout="vertical" :current="current"  >
          <t-step-item title="步骤1" content="基本信息配置" @click="current=0">
            <template v-if="current === 0" #extra>
              <t-button size="small" variant="base" @click.stop="current++"> 下一步 </t-button>
            </template>
          </t-step-item>
          <t-step-item title="步骤2" content="入参配置" @click="current=1">
            <template v-if="current === 1" #extra>
              <t-row>
                <t-col :span="12" :lg="6">
                  <t-button size="small" variant="text" @click.stop="current--"> 上一步 </t-button>
                </t-col>
                <t-col :span="12" :lg="6">
                  <t-button size="small" variant="base" @click.stop="current++"> 下一步 </t-button>
                </t-col>
              </t-row>
            </template>
          </t-step-item>
          <t-step-item title="步骤3" content="入参Js" @click="current=2">
            <template v-if="current === 2" #extra>
              <t-row>
                <t-col :span="12" :lg="6">
                  <t-button size="small" variant="text" @click.stop="current--"> 上一步 </t-button>
                </t-col>
                <t-col :span="12" :lg="6">
                  <t-button size="small" variant="base" @click.stop="current++"> 下一步 </t-button>
                </t-col>
              </t-row>
            </template>
          </t-step-item>
          <t-step-item title="步骤4" content="SQL编辑" @click="current=3">
            <template v-if="current === 3" #extra>
              <t-row>
                <t-col :span="12" :lg="6">
                  <t-button size="small" variant="text" @click.stop="current--"> 上一步 </t-button>
                </t-col>
                <t-col :span="12" :lg="6">
                  <t-button size="small" variant="base" @click.stop="current++"> 下一步 </t-button>
                </t-col>
              </t-row>
            </template>
          </t-step-item>
          <t-step-item title="步骤5" content="出参配置" @click="current=4">
            <template v-if="current === 4" #extra>
              <t-row>
                <t-col :span="12" :lg="6">
                  <t-button size="small" variant="text" @click.stop="current--"> 上一步 </t-button>
                </t-col>
                <t-col :span="12" :lg="6">
                  <t-button size="small" variant="base" @click.stop="current++"> 下一步 </t-button>
                </t-col>
              </t-row>
            </template>
          </t-step-item>
          <t-step-item title="步骤6" content="出参Js" @click="current=5">
            <template v-if="current === 5" #extra>
              <t-row>
                <t-col :span="12" :lg="6">
                  <t-button size="small" variant="text" @click.stop="current--"> 上一步 </t-button>
                </t-col>
                <t-col :span="12" :lg="6">
                  <t-button size="small" variant="base" @click.stop="current++"> 下一步 </t-button>
                </t-col>
              </t-row>
            </template>
          </t-step-item>
          <t-step-item title="步骤7" content="保存测试" @click="current=6">
            <template v-if="current === 6" #extra>
              <t-button size="small" @click.stop="current--"> 上一步 </t-button>
            </template>
          </t-step-item>
        </t-steps>
      </t-col>
      <t-col :span="10">
        <t-loading :loading="detailLoading">
          <keep-alive>
          <div v-if="current===0">
            <t-divider>基本信息</t-divider>
            <BaseInfoConfig :form-data="baseFormData" :form-ref="baseFormRef"></BaseInfoConfig>
          </div>
        </keep-alive>
          <div v-if="current===1">
            <t-divider>权限</t-divider>
            <AuthConfig :data="authData"></AuthConfig>
            <t-divider>参数映射</t-divider>
            <InConfig :data="inData"></InConfig>
          </div>
          <div v-if="current===2">
            <t-divider>参数自定义处理</t-divider>
            <JavaScriptConfig :data="inJsView" :help-text="inJsHelp"></JavaScriptConfig>
          </div>
          <div v-if="current===3">
            <t-divider>SQL编辑</t-divider>
            <SqlConfig :data="sqlEditData"></SqlConfig>
          </div>
          <div v-if="current===4">
            <t-divider>出参配置</t-divider>
            <OutConfig :data="outData" :sql-data="sqlEditData"></OutConfig>
          </div>
          <div v-if="current===5">
            <t-divider>出参自定义处理</t-divider>
            <JavaScriptConfig :data="outJsView" :help-text="outJsHelp"></JavaScriptConfig>
          </div>
          <div v-if="current===6">
            <t-divider>保存</t-divider>

            <t-row  :gutter="15">
              <t-col :span="5"><t-select v-model="resType" clearable :options="[
              {label: 'JSON', value: 'json'},
              {label: 'EXCEL', value: 'excel'},
              {label: 'PDF', value: 'pdf'},
            ]" placeholder="返回类型"></t-select></t-col>
              <t-col :span="7">
                <div style="float: right">
                  <t-button @click="save(false)" :loading="saving">保存配置</t-button>
                  <t-button @click="save(true)" theme="success" :loading="saving">保存并测试</t-button>
                </div>
              </t-col>
            </t-row>

            <t-divider>文档</t-divider>
            <Document :data="documentData"></Document>

            <t-sticky-tool
              :style="{ position: 'relative', overflow: 'hidden',width: '65px','z-index':'99999' }"
              :offset="['-95%','170px']" @click="item=>{
                if(item.item.label==='Test'){
                  postman=true;
                }
                if (item.item.label === 'CURL'){
                  buildCURL();
                }
              }" >
              <t-sticky-item label="Test" popup="在线测试工具">
                <template #icon>
                  <LinkIcon />
                </template>
              </t-sticky-item>
              <t-sticky-item label="CURL" popup="导出CURL">
                <template #icon>
                  <JumpIcon />
                </template>
              </t-sticky-item>
            </t-sticky-tool>

          </div>
        </t-loading>
      </t-col>
    </t-row>

    <t-drawer
      v-model:visible="postman"
      :show-overlay="false"
      header="接口测试"
      :size="'50%'"
      :sizeDraggable="true"
      :close-btn="true"
      :cancel-btn="null"
      :confirm-btn="null">
      <Postman></Postman>
    </t-drawer>

  </t-card>

</template>

<script lang="ts">
export default {
  name: "edit"
}
</script>

<script lang="ts" setup>
import {onMounted, ref} from "vue";
import BaseInfoConfig from "@/pages/datasharing/requestconfig/step/BaseInfoConfig.vue";
import AuthConfig from "@/pages/datasharing/requestconfig/step/AuthConfig.vue";
import InConfig from "@/pages/datasharing/requestconfig/step/InConfig.vue";
import JavaScriptConfig from "@/pages/datasharing/requestconfig/step/JavaScriptConfig.vue";
import SqlConfig from "@/pages/datasharing/requestconfig/step/SqlConfig.vue";
import OutConfig from "@/pages/datasharing/requestconfig/step/OutConfig.vue";
import {MessagePlugin} from "tdesign-vue-next";
import {hasText} from "@/utils/StringUtils";
import {DsRequestConfigAllDto} from "@/pages/datasharing/requestconfig/entity/DsRequestConfigAllDto";
import {AuthPe} from "@/pages/datasharing/requestconfig/entity/AnthPe";
import {InItem, InPe} from "@/pages/datasharing/requestconfig/entity/InPe";
import {request} from "@/utils/request";
import {useRoute, useRouter} from "vue-router";
import {ArrowLeftIcon, ChatIcon, JumpIcon, LinkIcon} from "tdesign-icons-vue-next";
import Postman from "@/pages/datasharing/requestconfig/Postman.vue";
import Document from "@/pages/datasharing/requestconfig/Document.vue";


const postman = ref(false)

const router = useRouter()
const goBack = ()=>{
  router.back()
}

const current = ref(0)

const baseFormRef = ref(null)
const baseFormData = ref({})

const authData = ref([])

const inData = ref([])

const inJsView = ref({
  code:''
})
const inJsHelp = ref(`全局对象：global_params , 类型为参数Json字符串，可通过JSON.parse(global_params)转换为Json对象<br/>
全局对象：global_error , 类型为字符串`)


const sqlEditData = ref({})

const outData = ref([])

const outJsView = ref({
  code:''
})
const outJsHelp = ref(``)

const resType = ref('')

const saving = ref(false)
const save = (istest) => {

  let dto  = new DsRequestConfigAllDto();
  dto.dsRequestConfigDto = baseFormData.value

  try {
    processAuth(dto)
  }catch (e){
    MessagePlugin.error(`权限配置错误：${e.message}`)
    current.value = 1
    return
  }

  try {
    processIn(dto)
  }catch (e){
    MessagePlugin.error(`入参配置错误：${e.message}`)
    current.value = 1
    return
  }

  processInjs(dto)

  try {
    processSql(dto)
  }catch (e){
    MessagePlugin.error(`SQL配置错误：${e.message}`)
    current.value = 3
    return
  }

  try {
    processOut(dto)
  }catch (e){
    MessagePlugin.error(`出参配置错误：${e.message}`)
    current.value = 4
    return
  }

  processOutjs(dto)

  try {
    processRt(dto)
  }catch (e){
    MessagePlugin.error(`${e.message}`)
    current.value = 6
    return
  }

  saving.value = true
  request.post({
    url:'/v1/datasharing/api/web/requestConfig/save',
    params:dto,
    headers:{
      'Content-Type':'application/json'
    }
  }).then(res=>{
    if (res){
      MessagePlugin.success('保存成功')
      getDocument(res)
      /*if (!istest){
        router.back()
      }else {
        postman.value = true
      }*/
    }else {
      MessagePlugin.error('保存失败')
    }

  }).catch(err=>{
    MessagePlugin.error(err.message)
  }).finally(()=>{
    saving.value = false
  })

}

const processAuth = (dto:DsRequestConfigAllDto)=>{
  for (let valueElement of authData.value) {
    if (!valueElement.authType)
      continue;

    let paramKeys = []
    let md5Slat = ""
    let md5ParamKey = ""
    let ips = []
    let heads = ""

    if (valueElement.authType === AuthPe.AUTH_TYPE.MD5) {
      const [md5Field, salt, ...params] = valueElement.value.split(/:|,/);
      md5Slat = salt
      md5ParamKey = md5Field
      paramKeys = params
    }else if (valueElement.authType === AuthPe.AUTH_TYPE.IP) {
      ips = valueElement.value.split(",")
    }else if (valueElement.authType === AuthPe.AUTH_TYPE.HEAD) {
      heads = valueElement.value
    }

    dto.authPe.authItems.push({
      authType: valueElement.authType,
      paramKeys: paramKeys,
      md5Slat: md5Slat,
      md5ParamKey: md5ParamKey,
      ips: ips,
      heads: heads
    })
  }
}

const processIn = (dto:DsRequestConfigAllDto)=>{
  inData.value.forEach(ec=>{
    let i : InItem = new InItem();
    i.must = ec.must
    i.defaultValue = ec.defaultValue
    i.paramKey = ec.paramKey
    i.verifyTypes = ec.verifyTypes
    i.transformTypes = ec.transformTypes
    if (ec.verifyTypes === InPe.VERIFY_TYPE.REGULAR){
      i.verifyTypes = ec.verifyTypes+ec.reg
    }
    dto.inPe.inItems.push(i)
  })
}

const processInjs = (dto:DsRequestConfigAllDto)=>{
  if (hasText(inJsView.value.code)){
    dto.inJsPe.js = inJsView.value.code
  }
}

const processSql = (dto:DsRequestConfigAllDto)=>{
  if (!hasText(sqlEditData.value.sql) || !hasText(sqlEditData.value.datasourceId)){
    throw new Error("sql或数据源不能为空")
  }
  sqlEditData.value.sql.split(/;/).forEach(ec=>{
    if (!hasText(ec))
      return;
    // @ts-ignore
    dto.sqlPe.sqls.push({
      sql:ec
    })
  })
  dto.sqlPe.dataSourceId = sqlEditData.value.datasourceId
}

const processOut = (dto:DsRequestConfigAllDto)=>{
  outData.value.forEach(ec=>{
    if (!hasText(ec.paramKey))
      return;
    dto.outPe.outItems.push({
      paramKey:ec.paramKey,
      showKey:ec.showKey,
      defaultValue:ec.defaultValue,
      fomatterType:ec.fomatterType,
      fomatterExp:ec.fomatterExp,
      transformTypes:ec.transformTypes,
      value:null,
    })
  })
}

const processOutjs = (dto:DsRequestConfigAllDto)=>{
  if (hasText(outJsView.value.code)){
    dto.outJsPe.js = outJsView.value.code
  }
}

const processRt = (dto:DsRequestConfigAllDto)=>{
  if (!hasText(resType.value))
    throw new Error("请选择返回类型")
  dto.outDataPe.type = resType.value
}

const route = useRoute()
const detailLoading = ref(false)
const getDetail = async (id)=>{
  if (!id){
    MessagePlugin.warning("id为空,类型改为新增")
    return
  }

  detailLoading.value = true
  try {
    let res = await request.get({
      url:'/v1/datasharing/api/web/requestConfig/getDetail',
      params:{
        id:id
      }
    });
    baseFormData.value = res.dsRequestConfigDto
    if (hasText(res.authPe)){
      for (let item of res.authPe.authItems) {
        if (hasText(item.authType)){
          switch (item.authType){
            case AuthPe.AUTH_TYPE.HEAD:{
              authData.value.push({
                authType:item.authType,
                value:item.heads
              })
              break;
            }
            case AuthPe.AUTH_TYPE.IP:{
              authData.value.push({
                authType:item.authType,
                value:item.ips.join(",")
              })
              break;
            }
            case AuthPe.AUTH_TYPE.MD5:{
              authData.value.push({
                authType:item.authType,
                value:`${item.md5ParamKey}:${item.md5Slat}:${item.paramKeys.join(",")}`
              })
              break;
            }
          }
        }
      }
    }
    if (hasText(res.inPe)){
      for (let item of res.inPe.inItems) {
        inData.value.push({
          must:item.must,
          defaultValue:item.defaultValue,
          paramKey:item.paramKey,
          verifyTypes:item.verifyTypes,
          transformTypes:item.transformTypes,
          reg:(()=>{
            if (String(item.verifyTypes).indexOf(InPe.VERIFY_TYPE.REGULAR) === 0){
              return String(item.verifyTypes).replace(InPe.VERIFY_TYPE.REGULAR,"")
            }
            return ''
          })()
        })
      }
    }
    if (hasText(res.inJsPe)){
      inJsView.value.code = res.inJsPe.js
    }
    if (hasText(res.sqlPe)){
      sqlEditData.value.datasourceId = res.sqlPe.dataSourceId
      sqlEditData.value.sql = res.sqlPe.sqls.map(ec=>ec.sql).join(";")
    }
    if (hasText(res.outPe)){
      for (let item of res.outPe.outItems) {
        outData.value.push({
          paramKey:item.paramKey,
          showKey:item.showKey,
          defaultValue:item.defaultValue,
          fomatterType:item.fomatterType,
          fomatterExp:item.fomatterExp,
          transformTypes:item.transformTypes,
        })
      }
    }
    if (hasText(res.outJsPe)){
      outJsView.value.code = res.outJsPe.js
    }
    if (hasText(res.outDataPe)){
      resType.value = res.outDataPe.type
    }
    getDocument(id)
  }catch (err){
    MessagePlugin.error(err.message)
  }finally {
    detailLoading.value = false
  }
}

onMounted(async () => {
  route.query.type === 'edit' && await getDetail(route.query.id)
})



const buildCURL = ()=>{
  let curl = `curl -X ${baseFormData.value.requestMethod}`
  if (baseFormData.value.paramType === 'JSON'){
    curl += ` -H 'Content-Type:application/json'`
  }else if (baseFormData.value.paramType === 'FORM'){
    curl += ` -H 'Content-Type:application/x-www-form-urlencoded'`
  }

  for (let item of authData.value) {
    if (item.authType === AuthPe.AUTH_TYPE.HEAD){
      item.value.split('&').forEach(ec=>{
        if (hasText(ec))
        {
          curl += ` -H '${String(ec).replace('=',':')}'`
        }
      })
    }
  }

  let u = `http://ip:port/v1/datasharing/api/web/datasharing/out/${baseFormData.value.requestUid}`
  if (baseFormData.value.requestMethod === 'GET'){
    let params = []
    inData.value.forEach(ec=>{
      if (hasText(ec.paramKey)){
        params.push(`${ec.paramKey}=${ec.defaultValue}`)
      }
    })
    u += `?${params.join("&")}`
  }
  curl += ` '${u}'`
  if (baseFormData.value.requestMethod === 'POST'){
    if (baseFormData.value.paramType === 'JSON'){
      let params = {}
      inData.value.forEach(ec=>{
        if (hasText(ec.paramKey)){
          params[ec.paramKey] = ec.defaultValue
        }
      })
      curl += ` -d '${JSON.stringify(params)}'`
    }else if (baseFormData.value.paramType === 'FORM'){
      let params = []
      inData.value.forEach(ec=>{
        if (hasText(ec.paramKey)){
          params.push(`${ec.paramKey}=${ec.defaultValue}`)
        }
      })
      curl += ` -d '${params.join("&")}'`
    }
  }
  copyToClipboard(curl)
}


function copyToClipboard(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  navigator.clipboard.writeText(text)
    .then(() => {
      MessagePlugin.success('复制成功')
    })
    .catch((error) => {
      MessagePlugin.error('复制失败')
    })
    .finally(() => {
      document.body.removeChild(textarea);
    });
}


const documentData = ref({
  text: '*保存后自动生成...*',
  loading: false
})
const getDocument = (id)=>{
  documentData.value.loading = true
  request.get({
    url:'/v1/datasharing/api/web/requestConfig/getDocumentMD',
    params:{
      id:id
    }
  }).then(res=>{
    documentData.value.text = res
  }).catch(err=>{
    MessagePlugin.error(err.message)
  }).finally(()=>{
    documentData.value.loading = false
  })
}


</script>

<style lang="less" scoped>

/deep/.t-steps .t-steps-item__inner {
  height: 100px;
}

/deep/.t-divider {
  height: 0px;
  margin: 0;
  padding: 0;
  list-style: none;
  font: var(--td-font-body-medium);
  margin: var(--td-comp-margin-xxl) 0;
  border-top: 1px solid var(--td-border-level-1-color);
  color: var(--td-text-color-primary);
  box-sizing: border-box;
}

/deep/.t-steps .t-steps-item__inner {
  height: 80px;
}

</style>
