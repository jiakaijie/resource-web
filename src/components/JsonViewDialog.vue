<template>
  <el-dialog v-model="visible" width="1000px" title="查看JSON数据" @close="props.close">
    <json-viewer 
      :value="jsonData"  
      :expand-depth=10
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

const visible = computed(() => props.isShow);
const jsonData = computed(() => props.jsonData);
</script>

