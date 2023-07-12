<template>

  <t-space direction="vertical" style="width: 100%">
    <div style="float: right">
      <t-button shape="circle" theme="default" @click="helpDialog=true">
        <template #icon><HelpIcon /></template>
      </t-button>
    </div>
    <div>
      <codemirror
        v-model="data.code"
        placeholder="这里编辑Js代码"
        :style="{ height: '600px' }"
        :autofocus="true"
        :indent-with-tab="true"
        :tab-size="2"
        :extensions="extensions"
        @ready="handleReady"
      />
    </div>
  </t-space>

  <t-dialog v-model:visible="helpDialog"
            :confirm-btn="null"
            :cancel-btn="null"
            header="帮助"
            width="500px">
    <p v-html='helpText'></p>
  </t-dialog>

</template>

<script lang="ts">
export default {
  name: "JavaScriptConfig"
}
</script>

<script lang="ts" setup>

import {Codemirror} from "vue-codemirror";
import {ref, shallowRef} from "vue";
import { javascript } from '@codemirror/lang-javascript'
import { HelpIcon} from "tdesign-icons-vue-next";

const props = defineProps({
  helpText: {
    type: String,
    default: () => {
      return ''
    }
  },
  data: {
    type: Object,
    default: () => {
      return {
        code: ''
      }
    }
  }
})

const extensions = [javascript()]
const view = shallowRef()
const helpDialog = ref(false)

const handleReady = (payload) => {
  view.value = payload.view
}

</script>

<style scoped>

</style>
