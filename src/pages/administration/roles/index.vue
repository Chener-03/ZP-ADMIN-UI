<template>
  <t-card :bordered="false">
    <t-tabs :defaultValue="1" v-model="a">
      <t-tab-panel :value="1" label="角色管理" :destroy-on-hide="false">
        <XyzTransition xyz="fade right-5">
          <div v-if="a === 1">
            <RoleLists></RoleLists>
          </div>
        </XyzTransition>
      </t-tab-panel>
      <t-tab-panel :value="2" label="用户角色" :destroy-on-hide="false">
        <XyzTransition xyz="fade left-5">
          <div v-if="a === 2">
            <UserRoleMap></UserRoleMap>
          </div>
        </XyzTransition>
      </t-tab-panel>
    </t-tabs>
  </t-card>
</template>

<script lang="ts">
export default {
  name: 'AdministrationRoles',
};
</script>

<script lang="ts" setup>
import { ref } from 'vue';
import RoleLists from '@/pages/administration/roles/roleList.vue';
import UserRoleMap from '@/pages/administration/roles/userRoleMap.vue';

const a = ref(1);
</script>

<style lang="less" scoped></style>
