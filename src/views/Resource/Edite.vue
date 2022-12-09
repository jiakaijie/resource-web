<template>
  <div class="home">
    <div class="box">{{ title }}</div>
    <button @click="handleCreateResource">新建资源</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { createResource } from '../../api/resource'

export default defineComponent({
  name: "Home",
  components: {},
  setup() {
    const title = ref<string>("资源创建");
    const handleCreateResource = ()=> {
        createResource({
            resourceName: `大爽的${Date.now()}`,
            resourceDesc: "text 123344556",
            data: {
                a: {
                    b: 123
                },
                c: [1,2,3,4,5],
                d: 12345
            }
        });
    }

    return {
      title,
      handleCreateResource
    };
  },
});
</script>
<style lang="less" scoped>
</style>