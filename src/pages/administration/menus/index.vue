<template>
  <div class="table-tree-container">
    <div class="list-tree-wrapper">
      <div class="list-tree-operator">
        <t-row :gutter="15">
          <t-col :span="8">
            <t-input v-model="filterText" placeholder="关键词过滤" clearable @input="onInput">
              <template #suffix-icon>
                <search-icon size="20px" />
              </template>
            </t-input>
          </t-col>
          <t-col :span="4">
            <t-button theme="primary" @click="concurrentNode.id = -1">新增</t-button>
          </t-col>
        </t-row>
        <t-loading size="small" :loading="treeLoading" show-overlay>
          <t-tree
            :data="items"
            :filter="filterByText"
            :expand-mutex="true"
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
      </div>
      <div class="list-tree-content">
        <SingleMenu @list-change="onListChange" :node="concurrentNode"></SingleMenu>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'AdministrationMenus',
};
</script>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { request } from '@/utils/request';
import { MessagePlugin } from 'tdesign-vue-next';
import SingleMenu from '@/pages/administration/menus/singleMenu.vue';
import { SearchIcon } from 'tdesign-icons-vue-next';

const items = ref([]);

const concurrentNode = ref({
  id: null,
});

const treeLoading = ref(false);

const getTree = () => {
  treeLoading.value = true;
  //@ts-ignore
  request
    .get({
      url: '/v1/user/api/web/getAllMenusName',
    })
    .then((res) => {
      items.value = res;
      treeLoading.value = false;
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
