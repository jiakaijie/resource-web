<template>
  <div class="sidebar">
    <div class="web-icon">
      <span class="system-name">资源管理平台</span>
    </div>
    <div class="menu-bar">
      <el-menu
        class="sidebar-el-menu"
        unique-opened
        router
        :default="onRoutes"
        :default-active="route.path"
      >
        <template v-for="item in menuList" :key="item.index">
          <!-- 无子菜单 -->
          <el-menu-item :index="item.index" v-if="item.show && !item.subMenu">
            <i class="menu-icon" :class="item.icon" />
            <template #title>{{ item.name }}</template>
          </el-menu-item>

          <!-- 有子菜单 -->
          <el-sub-menu
            v-if="item.show && item.subMenu"
            :index="item.subMenu[0].index"
          >
            <template #title>
              <i class="menu-icon" :class="item.icon" />
              {{ item.name }}
            </template>
            <el-menu-item
              v-for="subItem in item.subMenu"
              :index="subItem.index"
              :key="subItem.index"
            >
              <span style="margin-left: 6px">{{ subItem.name }}</span>
            </el-menu-item>
          </el-sub-menu>
        </template>
      </el-menu>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, computed, onMounted, reactive } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
// import { getUserInfo } from "@/api/login";
import { ElMessage } from "element-plus";

const showDataBoard = ref(false);
const store = useStore();
const route = useRoute();
const onRoutes = computed(() => {
  return route.path;
});
const menuList = reactive([
  {
    icon: "product",
    name: "资源管理",
    show: true,
    subMenu: [
      {
        index: "/resource/list",
        name: "资源列表",
      },
      {
        index: "/version/list",
        name: "版本列表",
      },
      {
        index: "/resource/edit",
        name: "新建资源",
      },
    ],
  },
  {
    icon: "product",
    name: "用户管理",
    show: true,
    subMenu: [
      {
        index: "/user/list",
        name: "用户列表",
      },
    ],
  },
  {
    icon: "product",
    name: "其他",
    show: true,
    index: "/other",
  },
]);

onMounted(async () => {
  // await getUserDetail();
  // const { is_campus_admin: isCampusAdmin, is_school_admin: isSchoolAdmin } =
  //   store.state.userDetail;
  // showDataBoard.value = isCampusAdmin || isSchoolAdmin;
});

// const getUserDetail = async () => {
//   try {
//     const {
//       data: { data, errcode, errmsg },
//     } = await getUserInfo({});

//     store.commit("setUserDetail", data);
//     if (errcode) {
//       throw Error(errmsg);
//     }
//   } catch (error: any) {
//     ElMessage({
//       message: error,
//       type: "error",
//       center: true,
//     });
//   }
// };
</script>
<style lang="less" scoped>
.sidebar {
  width: 260px;
  height: 100%;
  background: #04143c;
  .web-icon {
    width: 100%;
    height: 70px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .system-name {
      display: inline-block;
      font-size: 18px;
      color: #ffffff;
    }
  }
  .menu-bar {
    height: calc(100vh - 70px);
    overflow-y: scroll;
  }
  .sidebar-el-menu {
    --el-menu-text-color: #fff;
    --el-menu-bg-color: #04143c !important;
    --el-menu-active-color: rgba(45, 91, 255, 0.5);
    --el-menu-hover-bg-color: rgba(45, 91, 255, 0.3);

    font-size: 14px;
    border: none;

    :deep(.el-menu-item:hover) {
      background-color: rgba(45, 91, 255, 0.3) !important;
      color: #ffffff;
    }
    :deep(.el-menu-item.is-active) {
      background-color: rgba(45, 91, 255, 0.5) !important;
      color: #ffffff;
    }

    :deep(.el-sub-menu .el-menu-item) {
    }
  }
  .menu-icon {
    display: inline-block;
    width: 16px;
    height: 16px;
    margin-right: 9px;
  }
  .product {
    background: url("../assets/img/sidebar/product.png") no-repeat
      center/cover;
  }
  .student {
    background: url("../assets/img/sidebar/student.png") no-repeat
      center/cover;
  }
  :deep(.el-menu-item) {
    min-width: auto;

    &:hover {
      .student {
        background: url("../assets/img/sidebar/student_hover.png") no-repeat
          center/cover;
      }
      .product {
        background: url("../assets/img/sidebar/product_hover.png") no-repeat
          center/cover;
      }
    }
  }

  :deep(.el-menu-item.is-active) {
    .product {
      background: url("../assets/img/sidebar/product_hover.png") no-repeat
        center/cover;
    }
    .student {
      background: url("../assets/img/sidebar/student_hover.png") no-repeat
        center/cover;
    }
  }

}
</style>
