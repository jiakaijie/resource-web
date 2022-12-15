<template>
  <el-dialog v-model="visible" title="查看JSON" @close="props.close">
    <json-viewer 
      :value="jsonData"  
      :expand-depth=5
      boxed
      sort
    >
    </json-viewer>
  </el-dialog>
</template>

<script lang="ts" setup>
import { defineProps, computed } from 'vue';
const props = defineProps({
  isShow: {
    type: Boolean,
    default: false
  },
  jsonData: {
    type: Object,
    // eslint-disable-next-line vue/require-valid-default-prop
    default: {}
  },
  close: {
    type: Function,
  }
})

const visible = computed(()=> props.isShow);
</script>

