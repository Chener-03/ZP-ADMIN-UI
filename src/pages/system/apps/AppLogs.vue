<template>
  <t-card :bordered="false">
    <t-form
      ref="form"
      :data="searchData"
      :style="{ marginBottom: '8px', marginTop: '10px' }"
      @reset="reset"
      :label-width="0"
      @submit="getData"
    >
      <t-row>
        <t-col :span="10">
          <t-row :gutter="[10]">
            <t-col :sm="2" :span="2">
              <t-input
                v-model="searchData.sId"
                class="form-item-content"
                placeholder="服务名"
                :style="{ maxWidth: '160px' }"
                type="search"
                clearable
              >
                <template #prefix-icon>
                  <SearchIcon />
                </template>
              </t-input>
            </t-col>
            <t-col :sm="2" :span="2">
              <t-input
                v-model="searchData.iId"
                class="form-item-content"
                placeholder="服务ID"
                :style="{ maxWidth: '160px' }"
                type="search"
                clearable
              >
                <template #prefix-icon>
                  <SearchIcon />
                </template>
              </t-input>
            </t-col>
            <t-col :sm="2" :span="2">
              <t-input
                v-model="searchData.tid"
                class="form-item-content"
                placeholder="链路ID"
                :style="{ maxWidth: '160px' }"
                type="search"
                clearable
              >
                <template #prefix-icon>
                  <SearchIcon />
                </template>
              </t-input>
            </t-col>
            <t-col :sm="2" :span="2">
              <t-select
                v-model="searchData.level"
                clearable
                class="form-item-content"
                :style="{ maxWidth: '160px' }"
                placeholder="日志级别"
              >
                <t-option value="INFO">INFO</t-option>
                <t-option value="WARN">WARN</t-option>
                <t-option value="ERROR">ERROR</t-option>
              </t-select>
            </t-col>
            <t-col :sm="3" :span="3">
              <t-date-range-picker
                v-model="timeRange"
                :presets="presets"
                :placeholder="['开始时间', '结束时间']"
                clearable
                @change="rdpChange"
                class="form-item-content"
                :style="{ maxWidth: '250px' }"
              />
            </t-col>
          </t-row>
        </t-col>

        <t-col :span="2" class="operation-container">
          <t-button type="reset" variant="base" theme="default"> 重置 </t-button>
          <t-button theme="primary" type="submit" :loading="dataLoading" :style="{ marginLeft: '8px' }">
            查询
          </t-button>
        </t-col>
      </t-row>
    </t-form>

    <t-table
      row-key="id"
      :data="data"
      :loading="dataLoading"
      :pagination="pagination"
      :expanded-row="true"
      :expand-on-row-click="true"
      @page-change="rehandlePageChange"
      :columns="columns"
    >
      <template #level="{ row }">
        <div v-if="row.level === 'INFO'">
          <t-tag theme="success">INFO</t-tag>
        </div>
        <div v-if="row.level === 'WARN'">
          <t-tag theme="warning">WARN</t-tag>
        </div>
        <div v-if="row.level === 'ERROR'">
          <t-tag theme="danger">ERROR</t-tag>
        </div>
      </template>
      <template #expandedRow="{ row }">
        <div class="more-detail">
          <p class="title"><b>Logger:</b></p>
          <p class="content">{{ row.logger }}</p>
          <br />
          <p class="title"><b>Thread:</b></p>
          <p class="content">{{ row.thread }}</p>
          <br />
          <p class="title"><b>Message:</b></p>
          <p class="content">{{ row.message }}</p>
        </div>
      </template>
    </t-table>
  </t-card>
</template>

<script lang="ts">
export default {
  name: 'AppLogs',
};
</script>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import dayjs from 'dayjs';
import { request } from '@/utils/request';
import { MessagePlugin } from 'tdesign-vue-next';
import { SearchIcon } from 'tdesign-icons-vue-next';
const rehandlePageChange = (curr, pageInfo) => {
  pagination.value.pageSize = curr.pageSize;
  pagination.value.current = curr.current;
  getData();
};
const columns = [
  {
    title: '时间',
    colKey: 'time',
    ellipsis: true,
  },
  {
    title: '链路ID',
    colKey: 'tid',
    ellipsis: true,
  },
  {
    title: '服务',
    colKey: 'sId',
    ellipsis: true,
  },
  {
    title: '服务ID',
    colKey: 'iId',
    ellipsis: true,
  },
  {
    title: '等级',
    colKey: 'level',
    ellipsis: true,
  },
];
const data = ref([]);
const timeRange = ref([]);
const searchData = ref({
  level: '',
  sId: '',
  iId: '',
  message: '',
  tid: '',
});
const reset = () => {
  // searchData.value.username = ''
  // searchData.value.startTime = ''
  // searchData.value.endTime = ''
  timeRange.value = [];
};
const pagination = ref({
  pageSize: 10,
  total: 100,
  current: 1,
});
const dataLoading = ref(false);
const getData = () => {
  console.log({ ...searchData.value });
  dataLoading.value = true;
  //@ts-ignore
  request
    .get({
      url: '/v1/system/api/web/getAppLogs',
      params: {
        ...searchData.value,
        size: pagination.value.pageSize,
        page: pagination.value.current,
      },
    })
    .then((res) => {
      dataLoading.value = false;
      data.value = res.list;
      pagination.value.total = res.total;
    })
    .catch((err) => {
      dataLoading.value = false;
      MessagePlugin.error(err.message);
    });
};
onMounted(() => {
  getData();
});
const rdpChange = (val) => {
  searchData.value.startTime = val[0] === undefined ? '' : val[0];
  searchData.value.endTime = val[1] === undefined ? '' : val[1];
};
const presets = ref({
  最近7天: [dayjs().subtract(6, 'day'), dayjs()],
  最近3天: [dayjs().subtract(2, 'day'), dayjs()],
  今天: [dayjs(), dayjs()],
});
</script>

<style lang="less" scoped>
.list-common-table {
  background-color: var(--td-bg-color-container);
  padding: 30px 32px;
  border-radius: var(--td-radius-default);

  .table-container {
    margin-top: 30px;
  }
}

.form-item-content {
  width: 100%;
}

.operation-container {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  .expand {
    .t-button__text {
      display: flex;
      align-items: center;
    }
    .t-icon {
      margin-left: 4px;
      transition: transform 0.3s ease;
    }
  }
}

.payment-col {
  display: flex;

  .trend-container {
    display: flex;
    align-items: center;
    margin-left: 8px;
  }
}
.link {
  cursor: pointer;
  margin-right: 15px;
}
.more-detail {
  line-height: 22px;
  > p {
    display: inline-block;
    margin: 4px 0;
  }
  > p.title {
    width: 120px;
  }
}
.content {
  width: 100%;
  word-break: break-all;
}
</style>
