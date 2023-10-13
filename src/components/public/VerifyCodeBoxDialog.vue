
<template>
  <div v-if="show" :class="{'dialog-mask':true,'flex-center':true }">
    <div class="dialog-box" >

      <t-button shape="circle" variant="text" style=" ;margin: 10px">
        <icon-font name="close" @click="close(handleClose)"/>
      </t-button>

      <div style="text-align: center">
        <svg t="1692000957573" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5388" width="100" height="100"><path d="M165.101068 241.940821c0-41.997991 0.041274-83.996988-0.041274-125.994978-0.013087-6.892788 1.731502-12.959087 6.751852-17.800246 5.867981-5.65859 12.923852-8.233696 20.836415-5.842814 21.678006 6.551521 43.409366 4.858273 65.193074 1.064069 19.12706-3.332135 36.951467-10.003452 53.935289-19.593156 36.408862-20.560583 74.395204-37.555479 115.0392-48.089456 23.471923-6.083412 47.288133-9.540376 71.573459-9.234343 16.688863 0.209391 33.414974-0.02114 50.056523 1.033868 34.222337 2.170418 66.982964 10.978932 98.772138 23.587692 23.915872 9.485008 46.937805 20.854536 68.459775 34.908898 15.236213 9.949091 31.885816 15.050983 49.496805 17.920042 17.307976 2.820738 34.679373 4.189833 52.140366 1.489897 3.789171-0.586899 7.561229-1.451643 11.244698-2.519738 16.096931-4.672036 30.044585 5.635436 30.108006 22.449128 0.065435 17.468039 0.016107 34.937085 0.0151 52.406131 0 58.057674 0.276839 116.116355-0.069461 174.172016-0.497304 83.420156-20.017978 162.510549-57.012733 237.061789-61.743157 124.423539-154.694629 218.422973-278.11148 282.276146-8.485368 4.389157-16.420078 4.466672-24.895379 0.025167-143.877773-75.35961-244.476042-188.847504-300.434773-341.46131-16.337529-44.554976-26.363129-90.712599-29.513054-138.0561-1.915726-28.798306-1.677141-57.747614-2.136191-86.633502-0.281872-17.718704-0.052348-35.445462-0.052348-53.1692C166.005073 241.940821 165.552064 241.940821 165.101068 241.940821zM510.502553 440.273333c0-116.146556 0-231.804868 0-347.344391-0.46207-0.238585-0.678507-0.439922-0.905012-0.454016-1.280506-0.076508-2.565039-0.146976-3.846552-0.147983-45.083487-0.026174-88.295543 8.532682-128.741221 28.910048-35.241105 17.754945-71.116423 33.740134-109.617181 43.201989-8.662545 2.129144-17.137846 5.018337-25.830591 7.59747 0 1.778817 0.008053 3.183145-0.001007 4.585461-0.16107 23.247432-0.447976 46.494863-0.461063 69.742295-0.028187 50.71691-1.163731 101.487174 5.814626 151.929258 2.017401 14.58388 4.475732 29.108365 6.78608 44.007339C339.637505 441.624308 424.97842 440.949827 510.502553 440.273333zM511.404544 440.230046c0.621126 115.703613 1.239232 230.897843 1.860358 346.427299 1.748616-0.745955 3.048249-1.267419 4.319696-1.848278 29.47178-13.490617 55.328545-32.309631 79.262537-53.926229 31.201268-28.17718 58.274112-60.054942 83.203718-93.775949 18.532108-25.066516 37.458837-49.928674 51.350116-78.041425 6.692458-13.546992 14.060403-26.929894 19.029411-41.119152 8.126987-23.212197 14.697636-46.98512 18.648884-71.360041 0.970447-5.988783 0.578845-6.354211-5.425038-6.354211-82.443669-0.001007-164.886332-0.001007-247.330001-0.001007C514.802114 440.230046 513.276983 440.230046 511.404544 440.230046z" fill="#2c2c2c" p-id="5389"></path></svg>
      </div>

      <div style="text-align: center;margin-bottom: 5px">
        <span style="font-size: 10px">要完成请求，请输入身份验证应用中的双重身份验证代码。</span>
      </div>
      <div style="margin: 0 30px 0 30px">
        <VerifyCodeBox v-model="code.value" @complete="onCodeInputComplate" @keyup.enter.native="onEnter"></VerifyCodeBox>
      </div>
      <div style="display: flex;justify-content: center;margin-top: 10px">
        <t-button style="width: 200px" theme="success" :disabled="submitBtnDisable"
                  variant="outline"
                  @click="close(handleClose)">确认</t-button>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">

import VerifyCodeBox from "@/components/public/VerifyCodeBox.vue";
import {ref} from "vue";
import {IconFont} from "tdesign-icons-vue-next";


const prop = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  close: {
    type: Function,
    default: (fun: () => any) => fun()
  },
  code:{
    type: ref,
    default: ''
  }
})
const emit = defineEmits(['update:show'])

const submitBtnDisable = ref(true)

const onCodeInputComplate = (end)=>{
  submitBtnDisable.value = !end;
}

const handleClose = () => {
  emit('update:show', false)
}

const onEnter = () => {
  debugger
  if (prop.code.value.length === 6) {
    prop.close(handleClose)
  }
}


</script>


<style scoped lang="less">

.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
}

@keyframes backgroundGary {
  0% {
    background-color: rgba(0, 0, 0, 0);
  }
  100% {
    background-color: rgba(0, 0, 0, 0.7);
  }
}


.dialog-mask {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1000;
  animation: backgroundGary 1s forwards ;
}

.dialog-box {
  background: #fff;
  height: 335px;
  border-radius: 20px;
  overflow: hidden;
}

.block-layout {
  display: block !important;
}


/deep/.t-card--bordered{
  border: none;
}


</style>
