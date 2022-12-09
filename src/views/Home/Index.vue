<template>
  <div class="main">
    <AppSidebar/>
    <div class="container">
      <AppHeader class="header"/>
      <div class="content-wrapper">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useStore } from 'vuex';
import AppHeader from "../../components/Header.vue";
import AppSidebar from "../../components/Sidebar.vue";

const store = useStore();

store.dispatch('GET_ALL_USER')
</script>
<style lang="less" scoped>
.main {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: space-between;
  .container {
    flex: 1;
    height: 100%;
    overflow-y: scroll;
    .content-wrapper {
      padding: 20px;
    }
  }
}
</style>
