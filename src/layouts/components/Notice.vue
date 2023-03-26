<template>
  <t-popup expand-animation placement="bottom-right" trigger="click">
    <template #content>
      <div class="header-msg">
        <div class="header-msg-top">
          <t-link theme="default" @click="goDetail">
            <link-icon slot="prefix-icon"></link-icon>
            <p style="font-size: 16px">未读消息</p>
          </t-link>

          <t-button
            v-if="unReadMsg !== undefined && unReadMsg.length > 0"
            class="clear-btn"
            variant="text"
            theme="primary"
            @click="setRead"
            >全部清空</t-button
          >
        </div>
        <t-list v-if="unReadMsg !== undefined && unReadMsg.length > 0" class="narrow-scrollbar" :split="true">
          <t-list-item v-for="(item, index) in unReadMsg" :key="index">
            <div>
              <p class="msg-content">{{ item.title }}</p>
              <p class="msg-type">{{ item.imp === '0' ? '普通' : item.imp === '1' ? '重要' : '非常重要' }}</p>
            </div>
            <p class="msg-time">{{ item.createTime }}</p>
            <template #action>
              <t-button size="small" variant="outline" @click="jmpToLookUp(item.id)"> 查看 </t-button>
            </template>
          </t-list-item>
        </t-list>

        <div v-else class="empty-list">
          <img src="@/assets/nothing.png" alt="空" />
          <p>暂无消息</p>
        </div>
        <div class="header-msg-bottom">
          <t-button
            v-if="unReadMsg !== undefined && unReadMsg.length > 0"
            class="header-msg-bottom-link"
            variant="text"
            theme="primary"
            @click="goDetail"
            >查看全部</t-button
          >
        </div>
      </div>
    </template>
    <t-badge :count="unReadMsg !== undefined && unReadMsg.length" :offset="[12, 8]">
      <t-button theme="default" shape="square" variant="text">
        <t-icon name="mail" />
      </t-button>
    </t-badge>
  </t-popup>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useNotificationStore } from '@/store';
import type { NotificationItem } from '@/types/interface';

const router = useRouter();
const store = useNotificationStore();
const { unReadMsg } = storeToRefs(store);

import { LinkIcon, JumpIcon } from 'tdesign-icons-vue-next';
import { onMounted, ref } from 'vue';
import { request } from '@/utils/request';
//const unReadMsg = ref([]);
const setRead = () => {
  for (let item of unReadMsg.value) {
    //@ts-ignore
    request.get({
      url: '/v1/user/api/web/getUserMessageById',
      params: {
        messageId: item.id,
        isReceive: true,
        queryFields: 'id',
      },
    });
  }
  store.requestMsgData();
};
const jmpToLookUp = (id: number) => {
  router.push({
    path: '/user/messages/lookupMessage',
    query: {
      id: id,
    },
  });
};
const goDetail = () => {
  router.push('/user/messages');
};
onMounted(async () => {
  await store.requestMsgData();
  //unReadMsg.value = store.unReadMsg
});
</script>

<style lang="less" scoped>
.header-msg {
  width: 400px;
  height: 500px;

  .empty-list {
    height: calc(100% - 104px);
    text-align: center;
    padding-top: 135px;
    font-size: 14px;
    color: var(--td-text-color-secondary);

    img {
      width: 63px;
    }

    p {
      margin-top: 30px;
    }
  }

  &-top {
    position: relative;
    height: 56px;
    font-size: 16px;
    color: var(--td-text-color-primary);
    text-align: center;
    line-height: 56px;
    border-bottom: 1px solid var(--td-component-border);

    .clear-btn {
      position: absolute;
      top: 12px;
      right: 24px;
    }
  }

  &-bottom {
    height: 48px;
    align-items: center;
    display: flex;
    justify-content: center;

    &-link {
      text-decoration: none;
      font-size: 14px;
      color: var(--td-brand-color);
      line-height: 48px;
      cursor: pointer;
    }
  }

  .t-list {
    height: calc(100% - 104px);
  }

  .t-list-item {
    overflow: hidden;
    width: 100%;
    padding: 16px 24px;
    border-radius: var(--td-radius-default);
    font-size: 14px;
    color: var(--td-text-color-primary);
    line-height: 22px;
    cursor: pointer;

    &:hover {
      transition: background 0.2s ease;
      background: var(--td-bg-color-container-hover);

      .msg-content {
        color: var(--td-brand-color);
      }

      .t-list-item__action {
        button {
          bottom: 16px;
          opacity: 1;
        }
      }

      .msg-time {
        bottom: -6px;
        opacity: 0;
      }
    }

    .msg-content {
      margin-bottom: 16px;
    }

    .msg-type {
      color: var(--td-text-color-secondary);
    }

    .t-list-item__action {
      button {
        opacity: 0;
        position: absolute;
        right: 24px;
        bottom: -6px;
      }
    }

    .msg-time {
      transition: all 0.2s ease;
      opacity: 1;
      position: absolute;
      right: 24px;
      bottom: 16px;
      color: var(--td-text-color-secondary);
    }
  }
}

.t-button {
  margin: 0 8px;

  .t-icon {
    font-size: 20px;
    &.general {
      margin-right: 16px;
    }
  }
}
</style>
