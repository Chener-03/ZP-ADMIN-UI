<!--
data.pointNumber
data.metadata
data.switchScript
data.condition
data.switchType script or condition


-->

<template>
  <NodeResizer min-width="50" min-height="50"/>
  <Handle type="target" :position="Position.Left" />
  <div style="padding: 10px">{{text}}</div>
  <Handle v-for="(item,index) of pointNumber" :id="`${id}-source-${index}`" type="source" :position="Position.Right"
          :style="sourceHandlePos(index + 1)"/>

</template>

<script lang="ts">
export default {
  name: "SwitchGateway"
}
</script>

<script lang="ts" setup>
import {Handle, Position} from "@vue-flow/core";
import {NodeResizer} from "@vue-flow/node-resizer";
import {computed, onMounted} from "vue";


const prop = defineProps({
  pointNumber: {
    type: Number,
    default: 2
  },
  text: {
    type: String,
    default: 'SwitchGateway'
  },
  id: {
    type: String
  },
  dimensions:{
    type: Object
  }
})

const sourceHandlePos = (index = 1)=>{
  let ps = ((prop.dimensions.height - 10) / (prop.pointNumber)) * index
  return {
    filter: 'invert(100%)', top: `${ps}px`
  }
}

</script>

<style scoped>

</style>
