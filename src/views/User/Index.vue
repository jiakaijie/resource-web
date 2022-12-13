<template>
  <div class="app-container">
    <el-form :model="queryParams" :inline="true">
      <el-form-item label="姓名：">
        <el-input
          v-model="queryParams.name"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="工号：">
        <el-input
          v-model="queryParams.name"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleQuery">搜索</el-button>
        <el-button @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="loading" :data="list" border>
      <el-table-column prop="_id" align="center" label="用户ID" />
      <el-table-column prop="name" align="center" label="姓名" />
      <el-table-column prop="email" align="center" label="邮箱" />
      <el-table-column prop="workcode" align="center" label="工号" />
      <el-table-column prop="role" align="center" label="角色">
        <template #default="scope">
          {{ getRole(scope.row.role) }}
        </template>
      </el-table-column>
      <el-table-column prop="create_time" align="center" label="创建时间">
        <template #default="scope">
          {{ getTime(scope.row.create_time) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="180">
        <template #default="scope">
          <el-button
            :disabled="user.role ===0"
            type="text"
            plain
            @click.stop="onClickUser(scope.row)"
            >编辑角色</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页工具条 -->
    <div class="pagination">
      <el-pagination
        v-model:currentPage="queryParams.page"
        v-model:page-size="queryParams.page_size"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleQuery"
        @current-change="handleQuery"
      />
    </div>

    <el-dialog v-model="dialogFormVisible" title="编辑角色">
      <el-form :model="dialogForm">
        <el-form-item label="角色">
          <el-select v-model="dialogForm.role">
            <el-option label="普通用户" :value="0" />
            <el-option label="超级管理员" :value="1" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="onClickDialogConfirm">
            确 定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { reactive, onMounted, toRefs, computed } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

import { ElMessage, FormInstance, FormRules } from "element-plus";
import { getUsersList, updateUserRole } from '../../api/login';
import { getyyyymmdd, getyyyymmddMMss } from '../../utils/time';

const router = useRouter();
const store = useStore();

const state = reactive({
  dialogFormVisible: false,
  loading: false,
  total: 0,
  queryParams: {
    page: 1,
    page_size: 10,
  },
  list: [],
  dialogForm: {
    role: 0,
  }
});

const user = computed(() => store.state.user);
const { loading, total, queryParams, list, dialogFormVisible, dialogForm } = toRefs(state);

const getRole = (role) => {
  return role === 0 ? '普通用户' : '超级管理员'
}

const getTime = (time) => {
  return getyyyymmddMMss(time)
}

async function handleQuery() {
  state.loading = true;

  const data = {};
  Object.keys(state.queryParams).forEach(key => {
    if (state.queryParams[key] !== undefined && state.queryParams[key] !== '') {
      data[key] = state.queryParams[key];
    }
  })
  
  try {
    const { list = [], total = 0 } =
      (await getUsersList(data)) || {};
    state.list = list;
    state.total = total;
    state.loading = false;
  } catch (err) {
    state.loading = false;
    console.error(err);
  }
}

function resetQuery() {
  state.queryParams = {
    page: 1,
    page_size: 10,
  };
  handleQuery();
}

const onClickUser = (item) => {
  state.dialogFormVisible = true;
  state.dialogForm = {
    ...item,
    role: item.role
  };
};

const onClickDialogConfirm = async () => {
  try {
    const resData = await updateUserRole({
      _id: state.dialogForm._id,
      role: state.dialogForm.role
    })

    if (resData.isSuccess) {
      ElMessage.success('角色修改成功');
    } else {
      ElMessage.success('角色修改失败');
    }

    handleQuery();
    state.dialogFormVisible = false;
  } catch (err) {
    ElMessage.error(err);
  }
  
}

onMounted(() => {
  handleQuery();
});
</script>
<style lang="less" scoped>
.app-container {
}
.pagination {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>
