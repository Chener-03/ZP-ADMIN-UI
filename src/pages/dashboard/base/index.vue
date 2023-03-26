<template>
  <t-row>
    <t-col :span="8">
      <t-card class="card-normal" :title="'公告'" :bordered="false" :hover-shadow="true">
        <t-list :split="true" style="height: 400px">
          <t-list-item v-for="item in announcement">
            {{ item.content }}
            <template v-if="item.jmpLinkText !== null" #action>
              <t-link theme="primary" hover="color" style="margin-left: 16px" @click="jmpClick(item.jmpLink)">
                {{ item.jmpLinkText }}
              </t-link>
            </template>
          </t-list-item>
        </t-list>
      </t-card>
    </t-col>
    <t-col :span="4">
      <t-card class="card-normal" :title="'更新记录'" :bordered="false" :hover-shadow="true" style="min-height: 500px">
        无
      </t-card>
    </t-col>
    <t-col v-if="false" :span="6">
      <t-card class="card-normal" :title="'捐赠'" :bordered="false" :hover-shadow="true">
        <t-row>
          <t-col :span="6">
            <t-image :src="donate1" :style="{ width: '160px', height: '160px' }" fit="cover" shape="round" />
          </t-col>
          <t-col :span="6">
            <t-image :src="donate2" :style="{ width: '160px', height: '160px' }" fit="cover" shape="round" />
          </t-col>
        </t-row>
      </t-card>
    </t-col>
    <t-col v-if="false" :span="6">
      <t-card class="card-normal" :bordered="false" :hover-shadow="true"> 123 </t-card>
    </t-col>
  </t-row>
</template>

<script lang="ts">
export default {
  name: 'HomeBase',
};
</script>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { request } from '@/utils/request';
import { MessagePlugin } from 'tdesign-vue-next';
import router from '@/router';
import donate1 from '../../../assets/donate/img.png';
import donate2 from '../../../assets/donate/img_1.png';
import { useRoute } from 'vue-router';

const announcement = ref([]);

const getAnnouncement = async () => {
  try {
    announcement.value = await request.get({
      url: '/v1/user/api/web/getHomeAnnouncement',
    });
  } catch (err) {
    MessagePlugin.error(err.message);
  }
};
const jmpClick = (url) => {
  if (url === null) return;
  if (url.indexOf('http://') !== -1 || url.indexOf('https://') !== -1) {
    window.open(url);
  } else {
    router.push(url);
  }
};

onMounted(() => {
  getAnnouncement();
});
</script>

<style lang="less" scoped>
.card-normal {
  margin: 20px;
}
</style>
