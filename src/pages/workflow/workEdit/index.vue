<template>
  <t-card :hover-shadow="true" :bordered="false" >
    <t-drawer
      v-model:visible="drawerVisible"
      header="属性"
      :cancel-btn="null"
      :confirm-btn="null"
      :close-btn="true"
      show-in-attached-element >

      <SwitchSetting v-if="concurrentNodeType === 'SwitchGateway'" :obj="concurrentNode"/>


    </t-drawer>

    <VueFlow v-model="elements" class="continer"
             @edgeDoubleClick="edgeClick"
             @nodeDoubleClick="nodeClick">
      <MiniMap />

      <Background :variant="BackgroundVariant.Lines" />

      <Panel :position="'top-left'">
        <Sidebar></Sidebar>
        <div>
          <button  @click="logInfo">logInfo</button>
        </div>
      </Panel>

      <Controls />

      <template #node-SwitchGateway="{ label,pointNumber,id,data,dimensions }">
        <SwitchGateway :pointNumber="data.pointNumber" :id="id" :text="label" :dimensions="dimensions" />
      </template>

      <template #connection-line="{ sourceX, sourceY, targetX, targetY }">
        <CustomConnectionLine :source-x="sourceX" :source-y="sourceY" :target-x="targetX" :target-y="targetY" />
      </template>

    </VueFlow>

  </t-card>
</template>

<script lang="ts">
export default {
  name: "WorkEdit"
}
</script>

<script lang="ts" setup>
import {onMounted, ref,nextTick,watch} from "vue";
import '@vue-flow/core/dist/style.css';
import '@vue-flow/core/dist/theme-default.css';
import '@vue-flow/controls/dist/style.css';
import '@vue-flow/minimap/dist/style.css';
import '@vue-flow/node-resizer/dist/style.css';

import { Panel, VueFlow, useVueFlow,getConnectedEdges } from '@vue-flow/core'
import { Background, BackgroundVariant } from '@vue-flow/background'
import { MiniMap } from '@vue-flow/minimap'
import { Controls } from '@vue-flow/controls'
import { NodeResizer } from '@vue-flow/node-resizer'
import { NodeToolbar } from '@vue-flow/node-toolbar'
import Sidebar from './Sidebar.vue'
import UserTask from './UserTask.vue'
import SwitchGateway from './SwitchGateway.vue'
import CustomConnectionLine from './ConnectLine.vue'
import * as UUID from '@/utils/UUID';
import {EdgeMouseEvent} from "@vue-flow/core/dist/types";
import SwitchSetting from './setting/switchSetting.vue'

const { nodes, addNodes, addEdges, onConnect, dimensions,project, vueFlowRef,findNode,updateEdge  } = useVueFlow()

onConnect((params) => addEdges(params))

const elements = ref([
  { id: '1', type: 'input', label: 'Node 1', position: { x: 250, y: 5 } },

  { id: '2',type:'SwitchGateway', label: 'Node 2', position: { x: 100, y: 100 },data:{ pointNumber:3 } }
])



const drawerVisible = ref(false)
const concurrentNode = ref({})
const concurrentNodeType = ref('')

const edgeClick = (ev : EdgeMouseEvent)=>{
  console.log(ev)
  drawerVisible.value = true
  ev.edge.animated = true
}
const nodeClick = (ev)=>{
  console.log(ev)
  concurrentNode.value = {}
  concurrentNodeType.value = ''
  drawerVisible.value = true
  if (ev.node.type === 'SwitchGateway'){
    concurrentNode.value = ev.node
    concurrentNodeType.value = 'SwitchGateway'
  }
}


const logInfo =()=>{
  console.log(JSON.stringify(elements.value))
}


</script>

<style lang="less"  scoped >

.continer {
  height: 85vh;
}

</style>
