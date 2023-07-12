<template>
<t-card :bordered="false">
  <div class="headcontiner">
    <div style="margin-bottom: 20px">
      <div  style="display: inline-block">
        <t-button shape="circle" theme="default" @click="goBack">
          <template #icon><ArrowLeftIcon /></template>
        </t-button>
      </div>
      <div style="display: inline-block;float: right;margin-left: 20px">
        <t-button shape="round"  @click="goBack" theme="danger" >删除</t-button>
      </div>
      <div style="display: inline-block;float: right;margin-left: 20px">
        <t-button shape="round" @click="onRedirectClick" theme="primary" >转发</t-button>
      </div>
      <div style="display: inline-block;float: right;margin-left: 20px">
        <t-button shape="round" @click="onReplaceClick" theme="primary" >回复</t-button>
      </div>
    </div>

    <t-row :gutter="25" >
      <t-col :span="2">
        <span class="span1">主题</span>
      </t-col>
      <t-col :span="10">
        <span>{{messages.title}}</span>
      </t-col>
    </t-row>
    <t-divider />

    <t-row :gutter="25">
      <t-col :span="2">
        <span class="span1">时间</span>
      </t-col>
      <t-col :span="10">
        <span>{{messages.createTime}}</span>
      </t-col>
    </t-row>
    <t-divider />

    <t-row :gutter="25">
      <t-col :span="2">
        <span class="span1">发送人</span>
      </t-col>
      <t-col :span="10">
        <span>{{messages.sendUserName}}</span>
      </t-col>
    </t-row>
    <t-divider />
    <t-row :gutter="25">
      <t-col :span="2">
        <span class="span1">接收人</span>
      </t-col>
      <t-col :span="10">
        <span>{{messages.username}}</span>
      </t-col>
    </t-row>

    <t-divider v-if="messages.refMessageId !== undefined && messages.refMessageId !== null"/>
    <t-row :gutter="25" v-if="messages.refMessageId !== undefined && messages.refMessageId !== null">
      <t-col :span="2">
        <span class="span1">引用</span>
      </t-col>
      <t-col :span="10">
        <t-link style="display: inline" theme="primary" underline @click="jmpOtherMessage(messages.refMessageId)">
          <link-icon slot="prefix-icon"></link-icon>
          {{`${messages.refMessageTitle}(${messages.refMessageDate})`}}
        </t-link>
      </t-col>
    </t-row>
  </div>
  <t-loading :loading="loadingMessage">
    <tiny @input="onEditInput"
          :toolbar="false"
          ref="editor"
          :disabled="disabled" ></tiny>
  </t-loading>

  <t-row :gutter="10"  style="color: #848486">
    <t-col :span="9">
      <span style="float: right">首次查看时间</span>
    </t-col>
    <t-col :span="3" >
      <span style="float: right">{{messages.readTime}}</span>
    </t-col>
  </t-row>

  <t-row :gutter="10"  style="color: #848486" v-if="messages.jmpLink!==undefined&&messages.jmpLink!==null">
    <t-col :span="9">
      <span style="float: right">引用链接</span>
    </t-col>
    <t-col :span="3" >
      <t-link theme="primary" hover="color" style="float: right" @click="jmpClick(messages.jmpLink)">
        {{messages.jmpLinkText}}
      </t-link>
    </t-col>
  </t-row>

</t-card>
</template>

<script lang="ts">
export default {
  name: "LookUpMessage"
}
</script>
<script lang="ts" setup>


import {onMounted, ref, watch} from "vue";
import {MessagePlugin} from "tdesign-vue-next";
import {useRoute, useRouter} from "vue-router";
import Tiny from "@/utils/tinymce/Tiny.vue";
import {request} from "@/utils/request";
import {ArrowLeftIcon, DiscountIcon} from "tdesign-icons-vue-next";


const route = useRoute()
const router = useRouter()
const content = ref('')
const disabled = ref(true)
const editor = ref(null)
const messages = ref({})
const loadingMessage = ref(false)
const onEditInput = (e: any) => {
  content.value = e
}
const goBack = () => {
  router.push('/user/messages/index')
}
onMounted(() => {
  route.query.id && getMessage(route.query.id)
})
watch(() => route.query.id, (id) => {
  id && getMessage(id)
})
const jmpClick = (url) => {
  if (url === null)
    return
  if (url.indexOf('http://')!==-1 || url.indexOf('https://')!== -1){
    window.open(url)
  }
  else{
    router.push(url)
  }
}
const getMessage = (id)=>{
  messages.value = {}
  editor.value.setTextContent('')
  loadingMessage.value = true
  let isReceive = (route.query.isReceive===undefined || route.query.isReceive === null)?true:route.query.isReceive
  request.get({
    url: '/v1/user/api/web/getUserMessageById',
    params: {
      messageId: id,
      isReceive: isReceive
    }
  }).then((res)=>{
    loadingMessage.value = false
    messages.value = res
    if (res.type === 'text'){
      editor.value.setTextContent(`<p>${res.content}</p>`)
    }else {
      editor.value.setTextContent(res.content)
    }
  }).catch((err)=>{
    loadingMessage.value = false
    MessagePlugin.error(err.message)
    router.back()
  })
}

const jmpOtherMessage = (id)=>{
  router.push({
    path: '/user/messages/lookupMessage',
    query: {
      id: id
    }
  })
}
const onReplaceClick = ()=>{
  router.push({
    path: '/user/messages/sendMessage',
    query: {
      id: messages.value.id,
      type:'reply',
      title: messages.value.title,
      time: messages.value.createTime,
      userId: messages.value.sendUserId,
      username: messages.value.sendUserName
    }
  })
}
const onRedirectClick = ()=>{
  router.push({
    path: '/user/messages/sendMessage',
    query: {
      id: messages.value.id,
      type:'redirect'
    }
  })
}

</script>
<style lang="less" scoped>

.headcontiner{
  margin: 10px 10px 20px;
}

/deep/.t-row{
  margin-bottom: 10px;
  margin-top: 10px;
}

/deep/.t-divider{
  margin : 0 ;
}

.span1{
  color: #999999;
}

.editorClass{
  height: 400px;
}

</style>
