<template>
  <t-row>
    <t-col :span="8">
      <t-card class="card-normal " :title="'公告'" :bordered="false" :hover-shadow="true">
        <t-list :split="true" style="height: 400px;">
          <t-list-item v-for="item in announcement">
            {{item.content}}
            <template v-if="item.jmpLinkText!==null" #action>
              <t-link theme="primary" hover="color" style="margin-left: 16px" @click="jmpClick(item.jmpLink)"> {{item.jmpLinkText}} </t-link>
            </template>
          </t-list-item>
        </t-list>
      </t-card>
    </t-col>
    <t-col :span="4">
      <t-card class="card-normal" :title="'更新记录'" :bordered="false" :hover-shadow="true" style="min-height: 500px">
        <t-list v-if="false" :split="true" >
          <t-list-item >
            <t-list-item-meta title="v1.0.1 (2023.03.27)" description="" />
            <t-collapse>
              <t-collapse-panel value="0" header="这是一个折叠标题">

              </t-collapse-panel>
            </t-collapse>
          </t-list-item>
          <t-list-item >
            <t-list-item-meta title="v1.0.0 (2023.03.26)" description="项目发布" />
          </t-list-item>
        </t-list>

        <t-collapse v-model="currentItem" :borderless="true">
          <t-collapse-panel value="1" header="v1.0.1 (2023.03.27)">
            添加index_template<br>
            启用缓存<br>
            日志推送双引号失败问题<br>
          </t-collapse-panel>
          <t-collapse-panel value="0" header="v1.0.0 (2023.03.26)">
            项目发布
          </t-collapse-panel>
        </t-collapse>


      </t-card>
    </t-col>
    <t-col :span="6">
      <t-card class="card-normal " :bordered="false" :title="'简介'" :hover-shadow="true" >
        <span style="font-style:italic;color: #7e7e7e">
          zp-admin 是我在工作之余开发的，是一款基于 Spring Cloud 和 Vue3 开发的后台管理系统，与若依类似。
          它为企业提供了可定制的、高效的管理系统模板，帮助开发者专注处理业务，并提高了工作效率。
          不仅如此，zp-admin 还具备灵活的权限控制、数据统计等功能，可满足不同的需求。
          后期还将增加更多功能，如数据共享、数据可视化、任务流、审批流等 (ps:不会太久) <br/>
          另外，zp-admin 采用了前后端分离的架构模式，前端使用 Vue3&TDesign 开发，具有良好的交互性和响应式设计。
          安卓端(flutter)和小程序端正在完善，不久将发布。
          后端使用 Spring Cloud 技术栈，支持服务注册与发现、负载均衡、断路器等功能，具备高可用性和可扩展性。
          此外，zp-admin 还提供了丰富的文档和教程，便于二次开发和维护。<br/>
          无论您是开发者、还是学生，都可以轻松地在 zp-admin 基础上进行开发。<br/>
          最后，zp-admin 是一个开源项目，并承诺永久免费，欢迎大家参与到开发中来，一起完善它。
        </span>
        <br>
        <div style="margin-top: 20px;line-height: 40px">
          技术选型: <br>
          前端: Vue3、TypeScript、<a href="https://tdesign.tencent.com/" target="_blank">TDesign</a>、
          axios、pinia ... <br>
          后端: Spring Boot、Spring Cloud、Spring Security、Mybatis Plus、
          Redis、MySQL、ElasticSearch、Nacos、Sentinel、OpenFeign、SkyWalking ... <br>
        </div>
      </t-card>
    </t-col>
    <t-col v-if="false" :span="6">
      <t-card class="card-normal " :title="'捐赠'" :bordered="false" :hover-shadow="true" >
        <t-row>
          <t-col :span="6">
            <t-image
              :src="donate1"
              :style="{ width: '160px', height: '160px' }"
              fit="cover"
              shape="round"
            />
          </t-col>
          <t-col :span="6">
            <t-image
              :src="donate2"
              :style="{ width: '160px', height: '160px' }"
              fit="cover"
              shape="round"
            />
          </t-col>
        </t-row>
      </t-card>
    </t-col>
  </t-row>

</template>

<script lang="ts">
export default {
  name: 'HomeBase',
};
</script>

<script setup lang="ts">

import {onMounted, ref, watch} from "vue";
import {request} from "@/utils/request";
import {MessagePlugin} from "tdesign-vue-next";
import router from "@/router";
import donate1 from '../../../assets/donate/img.png'
import donate2 from '../../../assets/donate/img_1.png'
import {useRoute} from "vue-router";
import VerifyCodeBox from "@/components/public/VerifyCodeBox.vue";

const announcement = ref([])
const currentItem = ref('')
const getAnnouncement = async () => {
  try {
    announcement.value = await request.get({
      url: '/v1/user/api/web/getHomeAnnouncement'
    })
  }catch (err){
    MessagePlugin.error(err.message)
  }
}
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

onMounted(()=>{

  getAnnouncement()
})


</script>

<style lang="less" scoped>
.card-normal{
  margin: 20px;
}
</style>
