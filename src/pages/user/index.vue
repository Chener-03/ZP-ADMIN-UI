<template>
<div>
  <t-row :gutter="[24, 24]">
    <t-col :flex="3">
      <div class="user-left-greeting">
        <div>
          Hi，{{(userExt.nameCn === '' || userExt.nameCn===undefined || userExt.nameCn===null)?userBase.username:userExt.nameCn}}
          <span class="regular"> {{timeStr}}好，今天是你加入的第 {{days}} 天</span>
        </div>
        <img src="@/assets/zplogo.png" style="height: 50px;width: 80px" class="logo" />
      </div>

      <t-card :hover-shadow="true" class="user-info-list" title="个人信息" :bordered="false">
        <template #actions>
          <t-button theme="default" shape="square" variant="text" @click="editClick">
            <t-icon name="edit" size="18" v-if="isEdit===false" />
            <t-icon name="save" size="18" v-else />
          </t-button>
        </template>
        <t-form v-model="userExt">
          <t-row class="content" justify="space-between" :gutter="20">
            <t-col  class="contract" :span="6">
              <div class="contract-title">
                {{ '名字' }}
              </div>
              <div class="contract-detail">
                <t-input v-model="userExt.nameCn" :disabled="isEdit===false" style="border-color:rgba(255,0,0,0);"></t-input>
              </div>
            </t-col>


            <t-col  class="contract" :span="6">
              <div class="contract-title">
                {{ '联系方式' }}
              </div>
              <div class="contract-detail">
                <t-input v-model="userExt.phone" :disabled="isEdit===false" style="border-color:rgba(255,0,0,0);"></t-input>
              </div>
            </t-col>

            <t-col  class="contract" :span="6">
              <div class="contract-title">
                {{ '邮箱' }}
              </div>
              <div class="contract-detail">
                <t-input v-model="userExt.email" :disabled="isEdit===false" style="border-color:rgba(255,0,0,0);"></t-input>
              </div>
            </t-col>

            <t-col  class="contract" :span="6">
              <div class="contract-title">
                {{ '职务' }}
              </div>
              <div class="contract-detail">
                <t-input v-model="userExt.post" :disabled="isEdit===false" style="border-color:rgba(255,0,0,0);"></t-input>
              </div>
            </t-col>

            <t-col  class="contract" :span="12">
              <div class="contract-title">
                {{ '签名' }}
              </div>
              <div class="contract-detail">
                <t-input v-model="userExt.autograph" :disabled="isEdit===false" style="border-color:rgba(255,0,0,0);"></t-input>
              </div>
            </t-col>

            <t-col  class="contract" :span="12"  style="height: 150px;">
              <div class="contract-title">
                {{ '简介' }}
              </div>
              <div class="contract-detail">
                <!--                <t-input v-model="userExt.introduce" :disabled="isEdit===false" style="border-color:rgba(255,0,0,0);"></t-input>-->
                <t-textarea
                  :disabled="isEdit===false"
                  v-model="userExt.introduce"
                  placeholder="未填写"
                  name="introduce"
                  :autosize="{ minRows: 3, maxRows: 5 }"
                />
              </div>
            </t-col>


          </t-row>
        </t-form>

      </t-card>

      <t-card :hover-shadow="true" class="user-info-list" title="安全设置" :bordered="false">
        <div style="margin-bottom: 10px;font-size: 15px;">修改密码 :</div>
        <t-form ref="pwdForm" :label-width="0" :data="pwd" :rules="pwdRule">
          <t-row :gutter="15" style="margin-bottom: 30px">
            <t-col :span="3">
              <t-form-item name="oldPwd">
                <t-input class="tinput2" type="password" v-model="pwd.oldPwd" placeholder="原密码"></t-input>
              </t-form-item>
            </t-col>
            <t-col :span="3">
              <t-form-item name="newPwd">
                <t-input class="tinput2" type="password"  v-model="pwd.newPwd" placeholder="新密码"></t-input>
              </t-form-item>
            </t-col>
            <t-col :span="3">
              <t-form-item name="confirmPwd">
                <t-input class="tinput2" type="password" v-model="pwd.confirmPwd" placeholder="确认密码"></t-input>
              </t-form-item>
            </t-col>
            <t-col :span="3">
              <t-button theme="primary" @click="pwdSubmit">修改</t-button>
            </t-col>
          </t-row>
        </t-form>

        <div style="margin-bottom: 10px;font-size: 15px;">两步验证 :</div>
        <span style="display: block;margin-bottom: 5px;color: rgb(128,128,128);font-style: italic;">使用两步验证时，需要<a :href="getAppDownloadUrl()" target="_blank">第三方身份验证应用程序</a>才能登录或操作。</span>
        <t-button :theme="isOpen2Fa?'danger':'success'" style="margin-bottom: 10px"  @click="change2Fa">{{isOpen2Fa?'关闭两步验证':'开启两步验证'}} </t-button>
      </t-card>

    </t-col>

    <t-col :flex="1">
      <t-card class="user-intro"  :bordered="false">
        <t-upload
          :action="uploadUrl"
          :tips="''"
          method="PUT"
          accept="image/*"
          theme="custom"
          name="file"
          @fail="onUploadFail"
          :before-upload="beforeUpload"
          :request-method="uploadRequest"
          :format-response="beforeResp"
          @success="onUploadSuccess">
          <t-avatar size="90px" v-if="userExt.avatarId === undefined || userExt.avatarId === null || userExt.avatarId === ''"
          >{{userBase.username}}</t-avatar>
          <t-avatar size="90px" v-else
                    :image="`${host}/v2/file/api/web/storage-v2/redirect/file?uid=${userExt.avatarId}`"
                    :hideOnLoadFailed="true">{{userBase.username}}</t-avatar>
        </t-upload>
        <div class="name">{{userBase.username}}</div>
        <div class="position">{{userExt.nameCn}}</div>
      </t-card>

      <t-card title="其它信息" class="user-team" :bordered="false">
        <t-list :split="true">
          <t-list-item>
            <t-list-item-meta title="所属部门" :description="userOtherInfo.orgName===null?'您不是组织用户':userOtherInfo.orgName" />
          </t-list-item>
          <t-list-item>
            <t-list-item-meta title="所属角色" :description="userOtherInfo.roleName" />
          </t-list-item>
          <t-list-item>
            <t-list-item-meta title="创建时间" :description="userBase.createTime" />
          </t-list-item>
          <t-list-item>
            <t-list-item-meta title="过期时间" :description="userBase.expireTime" />
            <template #action>
                <span>
                  <t-link theme="primary" hover="color" style="margin-left: 16px" @click="onRenewalClick">续期</t-link>
                </span>
            </template>
          </t-list-item>
        </t-list>
      </t-card>
    </t-col>
  </t-row>

  <t-dialog v-model:visible="auth2faDialogVisiable" :cancel-btn="null"
            :confirm-btn="null"
            :close-on-overlay-click="false"
            width="600px" header="开启2FA" :destroy-on-close="true">
    <div style="height: 300px;overflow-x: hidden;">
      <t-row :class="{'slide-in':auth2faMsg.concurrentStep===0,'hidden':auth2faMsg.concurrentStep!==0}">
        <t-col span="6">
          <t-loading :loading="auth2faMsg.requestLoading" >
            <qrcode-vue :value="auth2faMsg.url" :size="200" level="H" />
          </t-loading>
        </t-col>
        <t-col span="6">
          身份验证器应用程序和浏览器扩展程序（如
          <a href="https://support.1password.com/one-time-passwords/" target="_blank">1Password</a>、
          <a href="https://authy.com/guides/github/" target="_blank">Authy</a>、
          <a href="https://www.microsoft.com/en-us/security/mobile-authenticator-app" target="_blank">Microsoft</a>
          身份验证器等）会生成一次性密码，这些密码用作在登录或操作期间出现提示时验证身份的第二个因素。
          <br><br>
          无法扫描? 您可以使用设置密钥 <span class="underline" @click="copyKey2JTB">手动配置</span> 身份验证器应用。
        </t-col>
      </t-row>
      <t-row :class="{'slide-in':auth2faMsg.concurrentStep===1,'hidden':auth2faMsg.concurrentStep!==1}">
        <div style="text-align: center">
          <div style="font-size: 20px;margin-bottom: 30px;width: 100%;margin-left: 40px">输入6位验证码</div>
          <VerifyCodeBox style="margin-left: 100px"  v-model="auth2faMsg.verifyCode" @complete="onVerifyCodeComplate"></VerifyCodeBox>
        </div>
      </t-row>
      <t-row :class="{'slide-in':auth2faMsg.concurrentStep===2,'hidden':auth2faMsg.concurrentStep!==2}">
        <div style="text-align: center">
          <svg style="margin-left: 160px" t="1691916573869" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2130" width="200" height="200"><path d="M512 5.1C232.1 5.1 5.1 232.1 5.1 512S232 1018.9 512 1018.9c279.9 0 506.9-226.9 506.9-506.9 0-279.9-227-506.9-506.9-506.9z m305.3 365.2L466.6 728.6c-1.2 1.8-2.5 3.5-4.1 5.1-13.7 14-36 14-49.8 0L238.5 556.8c-13.7-14-13.7-36.6 0-50.5 13.7-14 36-14 49.8 0l148.7 151 330.5-337.6c13.8-14 36-14 49.8 0 13.7 14 13.7 36.6 0 50.6z m0 0" fill="#079848" p-id="2131"></path></svg>
        </div>
      </t-row>
      <div style="margin-top: 10px;position: absolute;bottom: 112px;right: 47px" v-if="auth2faMsg.concurrentStep !== 2" :class="{'animation-btnSlideRight':auth2faMsg.concurrentStep === 1}">
        <t-button theme="primary" :disabled="auth2faMsg.nextBtnDisable"  @click="onBindNextBtnClick" :loading="fa2VerifyCodeLoading">{{auth2faMsg.concurrentStep===0?'已扫描,下一步':'验证并绑定'}}</t-button>
      </div>
    </div>

    <t-steps :current="auth2faMsg.concurrentStep">
      <t-step-item title="绑定" content="" >
        <template #icon>
          <LinkIcon />
        </template>
      </t-step-item>
      <t-step-item title="验证" content="">
        <template #icon>
          <TipsIcon />
        </template>
      </t-step-item>
      <t-step-item title="完成" content="" status="finish">
        <template #icon>
          <CheckCircleIcon />
        </template>
      </t-step-item>
    </t-steps>

  </t-dialog>

</div>
</template>
<script lang="ts">
// @ts-nocheck
export default {
  name: 'UserIndex',
};
</script>
<script setup lang="ts">
import {nextTick, onMounted, onUnmounted, watch, computed, ref, reactive} from 'vue';
import {request} from "@/utils/request";
import {MessagePlugin, NotifyPlugin, UploadFile} from "tdesign-vue-next";
import proxy from "@/config/proxy";
import {DS_KEY, TOKEN_NAME} from "@/config/global";
import {ToMd5Hex, ToMd5WithDsKey} from "@/utils/MD5";
import router from "@/router";
import {useUserStore} from "@/store";
import {CheckCircleIcon, LinkIcon, TipsIcon} from "tdesign-icons-vue-next";
import {Base64} from "js-base64";
import QrcodeVue from "qrcode.vue";
import VerifyCodeBox from "@/components/public/VerifyCodeBox.vue";
import {UploadRequest} from "@/utils/request/UploadRequest";

const env = import.meta.env.MODE || 'development';
const host = env === 'mock' || !proxy.isRequestProxy ? '' : proxy[env].host;


const userBase = ref({
})
const userExt = ref({
  nameCn: '',
  phone: '',
  email: '',
  post: '',
  autograph: '',
  introduce: '',
  avatarId:''
})
const userOtherInfo = ref({})
const days = ref(0)
const timeStr = ref('')
const processData = ()=>{
  // @ts-ignore
  let time = userBase.value.createTime;
  let date1 = new Date(time);
  let date2 = new Date();
  let date3 = date2.getTime() - date1.getTime();
  days.value = Math.floor(date3 / (24 * 3600 * 1000));

  let hours = date2.getHours();
  if (hours < 12) {
    timeStr.value = '上午';
  } else if (hours < 18) {
    timeStr.value  = '下午';
  } else {
    timeStr.value  = '晚上';
  }
}
const getUserInfo = async () => {
  try {
    let res =  await request.get({
      url: '/v1/user/api/web/getConcurrentUserInformation'
    });
    userBase.value = res.userBase;
    if (res.userExtend !== undefined && res.userExtend !== null){
      userExt.value =  res.userExtend ;
    }
    processData();
  }catch (ex) {

  }
}
const isEdit = ref(false)
const editClick = ()=>{
  if (isEdit.value === true){
    isEdit.value = false;
    saveInfo();
  }else {
    isEdit.value = true;
    MessagePlugin.info('启用编辑');
  }
}

const saveInfo = ()=>{
  request.post({
    url: '/v1/user/api/web/saveSelfExtendInfo',
    data: {
      ...userExt.value
    }
  }).then(res=>{
    MessagePlugin.success('保存成功');
  }).catch(ex=>{
    MessagePlugin.error('保存失败');
  })
}

const onUploadSuccess = (a) => {
  debugger
  request.post({
    url:'/v2/file/api/web/storage-v2/confirmUpload',
    params:{
      ...concurrentUploadData.value
    }
  }).then(res=>{
    userExt.value.avatarId = concurrentUploadData.value.fileUID;
    saveInfo();
  }).catch(err=>{
    MessagePlugin.error('上传失败:'+err.message);
  })
}

const onUploadFail = (a) => {
  debugger
  MessagePlugin.error('上传失败');
}

const uploadUrl = ref('')
const concurrentUploadData = ref({})

const beforeResp = (res: any) => {
  debugger
  return { }
}

const beforeUpload = async (file: UploadFile):boolean => {
  try {

    let uploadurl = await request.get({
      url: `/v2/file/api/web/storage-v2/getUploadUrl?path=${file.name}`,
    })

    if (uploadurl.success !== true){
      MessagePlugin.error('获取上传链接失败..')
      return false
    }
    concurrentUploadData.value = uploadurl
    uploadUrl.value = uploadurl.url
    return true

  }catch (err){
    MessagePlugin.error(err.message);
    return false
  }
}

const uploadRequest = async  (file: UploadFile):any =>{
  let res = await UploadRequest.uploadMinio(uploadUrl.value,file.raw)
  if (res){
    return { status: 'success'}
  }
  return { status: 'fail', error: '上传失败' }
}


const pwdForm = ref(null)
const pwd = ref({
  oldPwd: '',
  newPwd: '',
  confirmPwd: ''
})
const pwdRule = {
  oldPwd: [
    { required: true, message: '请输入旧密码', type: 'error', trigger: 'blur' },
    { required: true, message: '请输入旧密码', type: 'error', trigger: 'change' },
  ],
  newPwd: [
    {required: true, message: '请输入新密码', trigger: 'blur'},
    {min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur'}
  ],
  confirmPwd: [
    { validator : (res)=>{
        return new Promise((resolve) => {
          if (pwd.value.newPwd === pwd.value.confirmPwd) {
            return resolve({ result: true, message: '', type: 'success', trigger: 'blur' })
          }
          return resolve({ result: false, message: '两次输入不一致', type: 'error', trigger: 'blur' })
        })
      }}
  ]
}
const pwdSubmitBtnLoading = ref(false)
const pwdSubmit = ()=>{
  pwdForm.value.validate().then((valid) => {
    if (valid === true) {
      let param = {
        oldPassword: pwd.value.oldPwd,
        newPassword: pwd.value.newPwd,
        ds: ToMd5Hex(pwd.value.oldPwd+pwd.value.newPwd+DS_KEY)
      }
      pwdSubmitBtnLoading.value = true;
      request.post({
        url: '/v1/user/api/web/resetSelfPassword',
        data: {
          ...param
        }
      }).then(res=>{
        pwdSubmitBtnLoading.value = false;
        if (res.success === true){
          MessagePlugin.success('修改成功,即将重新登录....');
          pwd.value.oldPwd = '';
          pwd.value.newPwd = '';
          pwd.value.confirmPwd = '';
          pwdForm.value.clearValidate();

          setTimeout(()=>{
            router.push({
              path: '/login',
              query: { redirect: encodeURIComponent(router.currentRoute.value.fullPath) },
            });
          },1000)

        }else {
          MessagePlugin.error(res.message);
        }
      }).catch(ex=>{
        pwdSubmitBtnLoading.value = false;
        MessagePlugin.error(ex.message);
      })
    } else {
      return false;
    }
  })
  // pwdForm.value.clearValidate();
}

const getUserOtherInfo = ()=>{
  // @ts-ignore
  request.get({
    url: '/v1/user/api/web/getSelfOtherInfo'
  }).then(res=>{
    userOtherInfo.value = res;
  }).catch(ex=>{
    MessagePlugin.error(ex.message);
  })
}

const onRenewalClick = ()=>{
  MessagePlugin.info('请联系管理员');
}
const userStore = useUserStore()
onMounted(() => {
  getUserInfo();
  getUserOtherInfo();
  check2FaState();
});

onUnmounted(() => {

});


const isOpen2Fa = ref(false)

const getAppDownloadUrl = ()=>{
  // 检测是否为 iOS/Mac 浏览器环境
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  const isMac = /Macintosh/.test(navigator.userAgent);

  if (isIOS || isMac){
    return "https://apps.apple.com/cn/app/microsoft-authenticator/id983156458";
  }else {
    return "https://play.google.com/store/apps/details?id=com.azure.authenticator"
  }

}

const check2FaState = ()=>{
  request.get({
    url: '/v1/user/api/web/2fa/checkStatus'
  }).then(res=>{
    isOpen2Fa.value = res;
  }).catch(ex=>{
    MessagePlugin.error(ex.message);
  })
}


const disable2fa = ()=>{
  request.post({
    url: '/v1/user/api/web/2fa/disable'
  }).then(res=>{
    if (res === true){
      isOpen2Fa.value = false;
      MessagePlugin.success('已关闭');
    }else {
      MessagePlugin.error('关闭失败');
    }
  }).catch(ex=>{
    MessagePlugin.error(ex.message);
  })
}

const change2Fa = ()=>{
  // isOpen2Fa.value = !isOpen2Fa.value
  if (isOpen2Fa.value === false){
    auth2faMsg.value = {
      url:'',
      key:'',
      requestLoading: true,
      concurrentStep: 0,
      verifyCode: '',
      nextBtnDisable: false
    }
    enable2fa();
  }

  if (isOpen2Fa.value === true){
    disable2fa();
  }
}

const copyKey2JTB = ()=>{

  const textarea = document.createElement('textarea');
  textarea.value = auth2faMsg.value.key;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);

  NotifyPlugin.success({
    closeBtn: true,
    title: '复制成功',
    content: `现在您可以打开 APP 手动输入密钥进行绑定`,
    duration: 5000,
  });
}

const auth2faMsg = ref({
  url:'',
  key:'',
  requestLoading: true,
  concurrentStep: 0,
  verifyCode: '',
  nextBtnDisable: false
})

const enable2fa = ()=>{
  auth2faMsg.value.requestLoading = true;
  auth2faDialogVisiable.value = true;
  request.post({
    url:'/v1/user/api/web/2fa/enable'
  }).then(res=>{
    auth2faMsg.value.key = Base64.decode(res.key);
    auth2faMsg.value.url = Base64.decode(res.url);
    console.log(auth2faMsg.value);
  }).catch(err=>{
    auth2faDialogVisiable.value = false;
    MessagePlugin.error(err.message);
  }).finally(()=>{
    auth2faMsg.value.requestLoading = false;
  })
}

const auth2faDialogVisiable = ref(false)

const onBindNextBtnClick = ()=>{
  if (auth2faMsg.value.concurrentStep === 0) {
    auth2faMsg.value.concurrentStep = 1;
    auth2faMsg.value.nextBtnDisable = true;
    return;
  }

  if (auth2faMsg.value.concurrentStep === 1) {
    fa2VerifyCodeLoading.value = true;
    request.post({
      url:'/v1/user/api/web/2fa/confirmEnable',
      params:{
        code: Base64.encode(auth2faMsg.value.verifyCode),
        key: Base64.encode(auth2faMsg.value.key),
        ds:ToMd5WithDsKey(auth2faMsg.value.key,auth2faMsg.value.verifyCode )
      }
    }).then(res=>{
      auth2faMsg.value.concurrentStep = 2;
      MessagePlugin.success('绑定成功');
      check2FaState();
    }).catch(err=>{
      MessagePlugin.error(err.message);
    }).finally(()=>{
      fa2VerifyCodeLoading.value = false;
    })
    return;
  }
}

const onVerifyCodeComplate = (v)=>{
  if (auth2faMsg.value.concurrentStep === 1){
    auth2faMsg.value.nextBtnDisable = !v;
  }
}

const fa2VerifyCodeLoading = ref(false)



</script>

<style lang="less" scoped>
@import url('./index.less');


@keyframes slideInRight {
  0% {
    transform: translateX(100%);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideOutLeft {
  0% {
    transform: translateX(0);
    opacity: 1;
  }
  100% {
    transform: translateX(-100%);
    opacity: 0;
  }
}

.slide-in {
  animation: slideInRight 0.5s forwards;
}

.slide-out {
  animation: slideOutLeft 0.5s forwards;
}

.hidden {
  display: none;
}


@keyframes btnSlideRight {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-195px);
  }
}

.animation-btnSlideRight {
  animation: btnSlideRight 0.5s forwards;
}



.underline {
  text-decoration: underline;
  cursor: pointer;
}

.underline-hand-cursor {
  font-family: Arial, sans-serif;
}


/deep/.t-input.t-is-disabled {
  color: rgba(0, 0, 0, 0);
  background-color: #eee0;
  border-color: rgba(255, 255, 255, 0.0);
}

/deep/.t-input.t-is-disabled .t-input__inner {
  cursor: not-allowed;
  color: rgb(0 0 0 / 95%);
}

.t-avatar {
  cursor: pointer;
}

/deep/.t-textarea .t-is-disabled {
  background-color: #eee0;
  cursor: not-allowed;
  border-color: #f5deb300;
  color: rgb(0 0 0 / 95%);
}
/*
/deep/.narrow-scrollbar {
  border-color: rgba(0, 0, 0, 0.00);
  scrollbar-color: var(--td-scrollbar-color) transparent;
  scrollbar-width: thin;
}
/deep/.t-textarea{
  border-color: #f5deb300;
}

/deep/.t-input {
  border-color: rgba(255, 255, 255, 0.0);
}*/

.tinput2 &.t-input{
  border-color: var(--td-border-level-2-color);
  background-color: var(--td-bg-color-specialcomponent);
}

</style>
