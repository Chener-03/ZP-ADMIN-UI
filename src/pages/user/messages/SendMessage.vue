<template>
  <t-card :bordered="false" style="min-height: 800px;">
    <div class="headcontiner">
      <div style="margin-bottom: 20px">
        <div  style="display: inline-block">
          <t-button shape="circle" theme="default" @click="goBack">
            <template #icon><ArrowLeftIcon /></template>
          </t-button>
        </div>

        <div style="display: inline-block;float: right;margin-left: 20px">
          <t-button shape="round" @click="sendClick" theme="success" >发送</t-button>
        </div>
      </div>

      <t-form :data="form" :label-width="80" label-align="left" :colon="true">
        <t-row :gutter="25" >
          <t-col :span="12">
            <t-form-item name="title" label="主题">
              <t-input v-model="form.title"></t-input>
            </t-form-item>
          </t-col>
        </t-row>
        <t-divider />

        <t-row :gutter="25">
          <t-col :span="12">
            <t-form-item name="users" label="接收人" style="width: 100%">
              <t-select
                v-model="form.users"
                multiple
                filterable
                placeholder="搜索用户"
                :options="formUsersOptions"
                :loading="formUsersSelectLoading"
                reserve-keyword
                @search="formUsersRemoteMethod"
              />
            </t-form-item>
          </t-col>
        </t-row>
        <t-divider />

        <t-row :gutter="25" >
          <t-col :span="12">
            <t-form-item name="jmpLinkText" label="链接标题">
              <t-input v-model="form.jmpLinkText"></t-input>
            </t-form-item>
          </t-col>
        </t-row>
        <t-divider />

        <t-row :gutter="25" >
          <t-col :span="12">
            <t-form-item name="jmpLink" label="链接地址">
              <t-input v-model="form.jmpLink"></t-input>
            </t-form-item>
          </t-col>
        </t-row>
        <t-divider/>
        <t-row :gutter="25" >
          <t-col :span="12">
            <t-form-item name="title" label="等级">
              <t-radio-group default-value="1" v-model="form.imp" >
                <t-radio value="0">普通</t-radio>
                <t-radio value="1">重要</t-radio>
                <t-radio value="2">非常重要</t-radio>
              </t-radio-group>
            </t-form-item>
          </t-col>
        </t-row>

        <t-divider v-if="form.refMessageId !== undefined && form.refMessageId !== null"/>
        <t-row :gutter="25" v-if="form.refMessageId !== undefined && form.refMessageId !== null">
          <t-col :span="2">
            <span class="span1">引用</span>
          </t-col>
          <t-col :span="10">
            <t-link style="display: inline" theme="primary" underline @click="jmpOtherMessage(form.refMessageId)">
              <link-icon slot="prefix-icon"></link-icon>
              {{`${form.refMessageTitle}(${form.refMessageDate})`}}
            </t-link>
          </t-col>
        </t-row>
      </t-form>


    </div>

    <t-loading :loading="loadingMessage">
      <tiny @input="onEditInput"
            ref="editor"
            :disabled="disabled" ></tiny>
    </t-loading>

  </t-card>
</template>

<script lang="ts">
export default {
  name: "SendMessage"
}
</script>

<script lang="ts" setup>
import {useRoute, useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import {ArrowLeftIcon} from "tdesign-icons-vue-next";
import Tiny from "@/utils/tinymce/Tiny.vue";
import {request} from "@/utils/request";
import {MessagePlugin} from "tdesign-vue-next";

const route = useRoute()
const router = useRouter()
const content = ref('')
const disabled = ref(false)
const editor = ref(null)
const form = ref({})
const loadingMessage = ref(false)
const onEditInput = (e: any) => {
  content.value = e
}
const goBack = () => {
  router.push('/user/messages/index')
}
onMounted(async ()=>{
  let type = route.query.type  // new redirect reply
  let id = route.query.id
  let time = route.query.time
  let title = route.query.title
  switch (type){
    case 'new':
      form.value = {
        imp: '1',
        title: '',
        users: [],
        refMessageId: null,
        refMessageTitle: null,
        refMessageDate: null,
      }
      break
    case 'redirect':
      loadingMessage.value = true
      try {
        let res = await request.get({
          url: '/v1/user/api/web/getUserMessageById',
          params: {
            messageId: id
          }
        })
        loadingMessage.value = false
        form.value = {
          imp: res.imp,
          title: `转发[${res.title}] 来自(${res.sendUserName})的消息:`,
          users: [],
          refMessageId: res.refMessageId,
          refMessageTitle: res.refMessageTitle,
          refMessageDate: res.refMessageDate,
          jmpLink: res.jmpLink,
          jmpLinkText: res.jmpLinkText,
        }
        editor.value.setTextContent(res.content)
      }catch (err){
        loadingMessage.value = false
      }
      break
    case 'reply':
      form.value = {
        imp:'1',
        title: `回复[${title}]:`,
        users: [],
        refMessageId: id,
        refMessageTitle: title,
        refMessageDate: time,
      }
      formUsersOptions.value.push({
        label: route.query.username,
        value: route.query.userId
      })
      form.value.users.push(route.query.userId)
      break
  }
})



const formUsersOptions = ref([])
const formUsersSelectLoading = ref(false)
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
const jmpOtherMessage = (id)=>{
  router.push({
    path: '/user/messages/lookupMessage',
    query: {
      id: id
    }
  })
}
const sendBtnLoading = ref(false)
const sendClick = ()=>{
  form.value.content = content.value
  form.value.userIds = form.value.users.join(',')
  sendBtnLoading.value = true
  request.post({
    url: '/v1/user/api/web/sendUsersMessage',
    params:{
      ...form.value
    }
  }).then(res=>{
    MessagePlugin.success('发送成功')
    goBack()
  }).catch(err=>{
    MessagePlugin.error(err.message)
  }).finally(()=>{
    sendBtnLoading.value = false
  })
}

</script>

<style lang="less" scoped>

.headcontiner{
  margin: 10px 10px 20px;
}

/deep/.t-form__label {
  color: rgb(156 156 156);
}

/deep/.t-row{
  margin-bottom: 10px;
  margin-top: 10px;
}

/deep/.t-divider{
  margin : 0 ;
}
/deep/.t-input{
  border-color: #ddd0;
}

.span1{
  color: #999999;
}

.editorClass{
  height: 400px;
}
</style>
