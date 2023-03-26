<template>
  <t-row :gutter="20">
    <t-col :span="3">
      <t-card :bordered="false" :hover-shadow="true" style="border-radius: 10px; min-height: 790px">
        <t-row :gutter="15">
          <t-col :span="12">
            <t-input
              v-model="filterText"
              placeholder="关键词过滤"
              style="margin-top: 5px"
              clearable
              size="small"
              @input="onInput"
            >
              <template #suffix-icon>
                <search-icon size="20px" />
              </template>
            </t-input>
          </t-col>
          <t-col :span="6" :md="3">
            <t-button
              theme="primary"
              style="margin-top: 5px; width: 100%"
              size="small"
              @click="orgSetRef.onOrgNewClicked()"
              >新增</t-button
            >
          </t-col>
          <t-col :span="6" :md="3">
            <t-button
              theme="primary"
              style="margin-top: 5px; width: 100%"
              size="small"
              @click="orgSetRef.onOrgEditClicked()"
              >编辑</t-button
            >
          </t-col>
          <t-col :span="6" :md="3">
            <t-button theme="danger" style="margin-top: 5px; width: 100%" size="small" @click="onDeleteClick"
              >删除</t-button
            >
          </t-col>
          <t-col :span="6" :md="3">
            <t-button theme="danger" style="margin-top: 5px; width: 100%" size="small" @click="onDisableClick"
              >启|禁用</t-button
            >
          </t-col>
        </t-row>
        <div style="margin-top: 5px; margin-bottom: 5px"></div>
        <t-divider> </t-divider>
        <t-loading size="small" :loading="treeLoading" show-overlay>
          <t-tree
            :data="items"
            :filter="filterByText"
            :expand-mutex="true"
            :expand-all="true"
            activable
            :expand-on-click-node="true"
            @click="onTreeNodeClick"
            hover
            line
            transition
          >
            <template #label="{ node }">
              <span>{{ node.label }}</span>
            </template>
          </t-tree>
        </t-loading>
      </t-card>
    </t-col>
    <t-col :span="9">
      <OrgSetting
        ref="orgSetRef"
        v-model:drawer-visible="drawerVisible"
        @drawer-close="drawerVisible = false"
        @org-tree-flush="getTree"
        :concurrent-node="concurrentNode"
      ></OrgSetting>
    </t-col>
  </t-row>
</template>

<script lang="ts">
export default {
  name: 'index',
};
</script>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { request } from '@/utils/request';
import { DialogPlugin, MessagePlugin } from 'tdesign-vue-next';
import { SearchIcon } from 'tdesign-icons-vue-next';
import OrgSetting from '@/pages/administration/org/orgSetting.vue';

const orgSetRef = ref(null);

const items = ref([]);

const drawerVisible = ref(false);

const concurrentNode = ref({
  id: null,
});
const onDeleteClick = () => {
  let dlg = DialogPlugin.confirm({
    header: '提示',
    body: '将会删除该组织和其所有子组织？',
    theme: 'danger',
    onConfirm: () => {
      //@ts-ignore
      request
        .post({
          url: '/v1/user/api/web/deleteOrg',
          data: {
            id: concurrentNode.value.id,
          },
        })
        .then((res) => {
          MessagePlugin.success('删除成功');
          dlg.destroy();
          getTree();
        })
        .catch((err) => {
          MessagePlugin.error(err.message);
        });
    },
  });
};
const onDisableClick = () => {
  //@ts-ignore
  request
    .get({
      url: '/v1/user/api/web/getOrgBaseInfo',
      params: {
        id: concurrentNode.value.id,
        fields: 'disable',
      },
    })
    .then((res) => {
      let dlg = DialogPlugin.confirm({
        header: '提示',
        body: res.disable ? '确定启用该组织？' : '确定禁用该组织？',
        theme: 'warning',
        onConfirm: () => {
          //@ts-ignore
          request
            .post({
              url: '/v1/user/api/web/disableOrg',
              data: {
                id: concurrentNode.value.id,
                disable: !res.disable,
              },
            })
            .then((res) => {
              MessagePlugin.success('成功');
              dlg.destroy();
            })
            .catch((err) => {
              MessagePlugin.error(err.message);
            });
        },
      });
    })
    .catch((err) => {
      MessagePlugin.error(err.message);
    });
};
const treeLoading = ref(false);

const getTree = () => {
  treeLoading.value = true;
  //@ts-ignore
  request
    .get({
      url: '/v1/user/api/web/getAllOrgTree',
    })
    .then((res) => {
      items.value = res;
      treeLoading.value = false;
      orgSetRef.value.paeseParentOrgTree(res);
      if (res.length > 0) {
        concurrentNode.value.id = res[0].id;
      }
    })
    .catch((err) => {
      MessagePlugin.error(err.message);
      treeLoading.value = false;
    });
};

const onTreeNodeClick = (node) => {
  concurrentNode.value.id = node.node.data.id;
};

const onListChange = () => {
  getTree();
};

const filterByText = ref();
const filterText = ref();
const onInput = () => {
  filterByText.value = (node) => {
    const rs = node.label.indexOf(filterText.value) >= 0;
    return rs;
  };
};

onMounted(() => {
  getTree();
});
</script>

<style lang="less" scoped>
.table-tree-container {
  background-color: var(--td-bg-color-container);
  border-radius: var(--td-radius-medium);

  .t-tree {
    margin-top: 24px;
  }
}

.list-tree-wrapper {
  overflow-y: hidden;
}

.list-tree-operator {
  width: 25%;
  float: left;
  padding: 30px 32px;
  border-right: 1px solid var(--td-border-level-1-color);
}

.list-tree-content {
  border-left: 1px solid var(--td-border-level-1-color);
  overflow: auto;
  min-height: calc(80vh);
}
</style>
