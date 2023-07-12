<template>

    <t-space direction="vertical">
      <t-button style="width: 80px" @click="startClick">Start</t-button>
      <t-button style="width: 80px" @click="endClick">End</t-button>
      <t-button style="width: 80px" @click="emit('clickBtn','UserTask')">UserTask</t-button>
      <t-button style="width: 80px" @click="switchClick">Switch</t-button>
    </t-space>

</template>

<script lang="ts">
export default {
  name: "Sidebar"
}
</script>

<script lang="ts" setup>
import {useVueFlow} from "@vue-flow/core";
import * as UUID from '@/utils/UUID';


const { nodes, addNodes, addEdges, onConnect, dimensions,project, vueFlowRef,findNode } = useVueFlow()

const emit = defineEmits(['clickBtn'])

const startClick = ()=>{
  emit('clickBtn','Start')
  const nodeId = UUID.getUuid()
  const newNode = {
    id: nodeId,
    label: `开始`,
    position: { x: 50,y:50 },
    type: 'input'
  }
  addNodes([newNode])
}

const endClick = ()=>{
  emit('clickBtn','End')
  const nodeId = UUID.getUuid()
  const newNode = {
    id: nodeId,
    label: `结束`,
    position: { x: 55,y:55 },
    type: 'output'
  }
  addNodes([newNode])
}

const switchClick = ()=>{
  emit('clickBtn','Switch')
  const nodeId = UUID.getUuid()
  const newNode = {
    id: nodeId,
    label: `选择`,
    position: { x: 60,y:60 },
    type: 'SwitchGateway',
    data:{ pointNumber:2 }
  }
  addNodes([newNode])
}


</script>

