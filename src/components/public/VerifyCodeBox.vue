<template>
  <t-card :bordered="true" :hover-shadow="true">
    <div class="two-factor-code-input">
      <div
        v-for="(digit, index) in codeDigits"
        :key="index"
        class="digit-container"
      >
        <input
          v-model="inputValues[index]"
          ref="inputRefs"
          class="digit-input"
          maxlength="1"
          @input="handleInput(index, $event)"
          @keydown="handleKeyDown(index, $event)"
        />
      </div>
      <div class="code-border" :style="{ transform: `translateX(${activeIndex * 45}px)` }"></div>
    </div>
  </t-card>
</template>

<script setup lang="ts">
import {ref, onMounted, toRefs, watch} from 'vue';

const { codeDigits, inputValues, activeIndex, inputRefs } = toRefs(setupData());

const emit = defineEmits(["update:modelValue","complete"])

watch(
  inputValues.value,
  ()=>{
    let c : String = ''
    inputValues.value.forEach(e=>{
      c += String(e)
    })
    emit('update:modelValue', c);
    if (c.length === 6){
      emit('complete',true)
    }else {
      emit('complete', false)
    }
  }
)

function setupData() {
  const codeDigits = 6;
  const inputValues = ref(Array(6).fill(''));
  const activeIndex = ref(0);
  const inputRefs = ref([]);

  return {
    codeDigits,
    inputValues,
    activeIndex,
    inputRefs,
  };
}

const handleInput = (index, event) => {
  const inputValue = event.target.value;
  if (inputValue.length > 1) {
    inputValues.value[index] = inputValue.charAt(inputValue.length - 1);
  }

  if (index < codeDigits.value - 1 && inputValues.value[index]) {
    activeIndex.value = index + 1;
    inputRefs.value[activeIndex.value].focus();
  }
};

const handleKeyDown = (index, event) => {
  if (event.key === 'Backspace' && index > 0) {
    inputValues.value[index] = '';
    activeIndex.value = index - 1;
    inputRefs.value[activeIndex.value].focus();
  }
};

onMounted(() => {
  inputRefs.value[0].focus();
});

</script>
<style scoped>
.two-factor-code-input {
  display: flex;
  align-items: center;
}

.digit-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: 1px solid #ccc;
  margin-right: 5px;
}

.digit-input {
  width: 100%;
  height: 100%;
  font-size: 16px;
  text-align: center;
  border: none;
  outline: none;
}

.code-border {
  position: absolute;
  bottom: 15px;
  left: 24px;
  width: 40px;
  height: 3px;
  background-color: #007bff;
  transition: transform 0.3s ease-in-out;
}
</style>
