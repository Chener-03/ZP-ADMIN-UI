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
