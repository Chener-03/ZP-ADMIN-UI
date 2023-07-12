<template>
<div id="switchSettingDiv">

  <t-form
    :data="obj"
    label-width="calc(2em + 24px)"
    scroll-to-first-error="smooth"  >
    <t-form-item label="ID" name="id">
      <span class="text">{{obj.id}}</span>
    </t-form-item>

    <t-form-item label="类型" >
      <span class="text">选择器</span>
    </t-form-item>

    <t-form-item label="标签" name="label">
      <t-input v-model="obj.label"></t-input>
    </t-form-item>

    <t-form-item label="分支数" name="pointNumber">
      <t-input-number style="width: 100%" :min="2" :max="10" v-model="obj.data.pointNumber" theme="column"></t-input-number>
    </t-form-item>

    <t-form-item label="条件" name="label">
      <t-space direction="vertical" style="width: 100%">
        <t-select v-model="obj.data.switchType">
          <t-option key="condition" label="表达式" value="condition" />
          <t-option key="script" label="脚本" value="script" />
        </t-select>

        <t-input v-if="obj.data.switchType === 'script'" v-model="obj.data.switchScript" placeholder="JavaScript" >
          <template #suffixIcon>
            <FullscreenIcon :style="{ cursor: 'pointer' }"  @click="fullScreenEditJs" />
          </template>
        </t-input>

      </t-space>


    </t-form-item>

  </t-form>

  <t-dialog v-model:visible="visible"  attach="#app" width="900px">
    <codemirror
      v-model="obj.data.switchScript"
      placeholder="这里编辑Js代码"
      :style="{ height: '400px' }"
      :autofocus="true"
      :indent-with-tab="true"
      :tab-size="2"
      :extensions="extensions"
    />
  </t-dialog>



</div>
</template>

<script lang="ts" setup>


import {FullscreenIcon, SearchIcon} from "tdesign-icons-vue-next";
import {Codemirror} from "vue-codemirror";
import {javascript} from "@codemirror/lang-javascript";
import {ref} from "vue";
import {DialogPlugin} from "tdesign-vue-next";

const prop = defineProps({
  obj:{
    type:Object,
    default:()=>({})
  }
})


const extensions = [javascript()]
const visible = ref(false)
const fullScreenEditJs = ()=>{
  visible.value = true

}


</script>

<style scoped>
.text{
  font-size: 14px;
  color: #666;
}
</style>
