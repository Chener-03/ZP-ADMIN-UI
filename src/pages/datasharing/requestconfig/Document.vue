<template>

  <t-loading :loading="data.loading" >
    <mavon-editor v-model="data.text"
                  :toolbars="{
                  navigation: true,readmodel: true,htmlcode: true,
                }"
                  :subfield="false"
                  placeholder="保存后自动生成..."
                  style="height: 587px"
                  :default-open="'preview'"/>
  </t-loading>

</template>

<script lang="ts">
export default {
  name: "Document"
}
</script>
<script lang="ts" setup>

import Tiny from "@/utils/tinymce/Tiny.vue";
import {ref} from "vue";

const props = defineProps({
  data: {
    type: Object,
    default: () => {
      return {
        text: '',loading: false
      }
    }
  }
})


</script>
<style scoped>
/deep/ul, /deep/dl, /deep/li, dd, dt {
  list-style: disc;
}
</style>
