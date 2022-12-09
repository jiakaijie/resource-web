<template>
  <div class="header">
    <div class="user-info">
      <img width="30" height="30" class="user-avatar" />
      <span class="user-name">{{ user.name }}</span>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted, computed } from "vue";
import { useStore } from "vuex";

const store = useStore();

const user = computed(() => store.state.user);

onMounted(() => {
  store.dispatch('GET_USER');
})

</script>
<style lang="less" scoped>
.header {
  height: 70px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: end;
  padding: 0 30px;
  box-sizing: border-box;
  box-shadow: 0px 2px 20px 0px rgba(32, 36, 40, 0.06);
  .user-info {
    display: flex;
    flex-direction: row;
    align-items: center;
    .user-avatar {
      background: #a1b1e3;
      border-radius: 15px;
    }
    .user-name {
      display: inline-block;
      font-size: 15px;
      font-weight: bold;
      color: #202428;
      margin-left: 10px;
    }
  }
}
</style>
