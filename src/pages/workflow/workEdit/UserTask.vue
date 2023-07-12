<template>
  <NodeResizer min-width="100" min-height="30" />

  <Handle type="target" :position="Position.Left" />
  <div style="padding: 10px">123</div>
  <Handle id="a" type="source" :position="Position.Right" :style="sourceHandlePos(10)"/>
  <Handle id="b" type="source" :position="Position.Right" :style="sourceHandlePos(20)"/>
  <Handle id="c" type="source" :position="Position.Right" :style="sourceHandlePos(30)"/>

</template>

<script lang="ts">
export default {
  name: "UserTask"
}
</script>

<script lang="ts" setup>
import { Handle, Position } from '@vue-flow/core'
import { NodeResizer } from '@vue-flow/node-resizer'
import {computed} from "vue";

defineProps({

})

const sourceHandlePos = (index)=>{
  if (!index){
    index = 10
  }
  return {
    filter: 'invert(100%)', top: `${index}px`
  }
}


</script>

<style scoped>

</style>
