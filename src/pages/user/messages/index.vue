<template>
  <t-card :bordered="false">
    <t-button style="margin: 10px" theme="primary" size="small" @click="onNewClick">新建</t-button>
    <t-tabs :defaultValue="1" v-model="a">
      <t-tab-panel :value="1" label="收件箱" :destroy-on-hide="false">
        <XyzTransition xyz="fade right-5">
          <div v-if="a === 1">
            <ReceiveMessage></ReceiveMessage>
          </div>
        </XyzTransition>
      </t-tab-panel>
      <t-tab-panel :value="2" label="发件箱" :destroy-on-hide="false">
        <XyzTransition xyz="fade left-5">
          <div v-if="a === 2">
            <SendMessageList></SendMessageList>
          </div>
        </XyzTransition>
      </t-tab-panel>
    </t-tabs>
  </t-card>
</template>

<script lang="ts">
export default {
  name: 'UserMessages',
};
</script>
<script lang="ts" setup>
import { ref } from 'vue';
import ReceiveMessage from '@/pages/user/messages/ReceiveMessage.vue';
import SendMessage from '@/pages/user/messages/SendMessage.vue';
import SendMessageList from '@/pages/user/messages/SendMessageList.vue';
import { useRouter } from 'vue-router';
const router = useRouter();
const a = ref(1);
const onNewClick = () => {
  router.push({
    path: '/user/messages/sendMessage',
    query: {
      type: 'new',
    },
  });
};
</script>
<style scoped></style>
