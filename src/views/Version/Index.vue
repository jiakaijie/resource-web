<template>
  <div class="app-container">
    <el-form :model="queryParams" :inline="true">
      <el-form-item label="资源ID：">
        <el-input
          :disabled="isQuery"
          v-model="queryParams.resource_id"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="是否线上版本：">
        <el-select v-model="queryParams.is_online_version">
          <el-option label="是" :value="1"></el-option>
          <el-option label="否" :value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleQuery">搜索</el-button>
        <el-button @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="loading" :data="list" border>
      <el-table-column prop="_id" align="center" label="版本ID" />
      <el-table-column prop="resource_id" align="center" label="资源ID" />
      <el-table-column prop="num" align="center" label="版本号">
        <template #default="scope">
          <el-tag type="success">{{ scope.row.num }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="desc" align="center" label="版本描述" />
      <el-table-column prop="is_online_version" align="center" label="是否线上版本">
        <template #default="scope">
          <el-tag type="success" v-if="scope.row.is_online_version === 1">是</el-tag>
          <el-tag type="danger" v-else>否</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="create_time" align="center" label="创建时间">
        <template #default="scope">
          {{ getTime(scope.row.create_time) }}
        </template>
      </el-table-column>
      <el-table-column prop="create_user" align="center" label="创建人" />
      <el-table-column label="操作" align="center" width="180">
        <template #default="scope">
          <el-tooltip content="该版本数据" placement="top">
            <el-button
              type="primary"
              link
              @click.stop="onClickWatchData(scope.row)"
              >数据</el-button
            >
          </el-tooltip>
          <el-tooltip content="将该版本数据上线" placement="top" v-if="scope.row.is_online_version == 0">
            <el-button
              :disabled="isCanClick(scope.row)"
              type="primary"
              link
              @click.stop="onClickPublish(scope.row)"
              >上线</el-button
            >
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页工具条 -->
    <div class="pagination">
      <el-pagination
        v-model:currentPage="queryParams.page"
        v-model:page-size="queryParams.page_size"
        :page-sizes="[5, 10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleQuery"
        @current-change="handleQuery"
      />
    </div>

    <JsonViewDialog 
      :json-data="jsonData" 
      :is-show="isShowJson"
      :close="()=> (isShowJson = false)"
    />
  </div>
</template>

<script setup>
import { reactive, onMounted, toRefs, computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";

import JsonViewDialog from '../../components/JsonViewDialog.vue';
import { ElMessage, ElMessageBox, FormInstance, FormRules } from "element-plus";
import { getVersionList, rollbackVersion } from '../../api/version';
import { getyyyymmddMMss } from '../../utils/time';

const route = useRoute();
const store = useStore();

const isShowJson = ref(false);
const jsonData = ref({});

const state = reactive({
  isQuery: false,
  loading: false,
  total: 0,
  queryParams: {
    page: 1,
    page_size: 10,
  },
  list: [],
});

const user = computed(() => store.state.user);
const { loading, total, queryParams, list, isQuery } = toRefs(state);

const isCanClick = (item) => {
  return !(user.value.role === 1 || item.create_user_id === user.value._id);
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
      (await getVersionList(data)) || {};
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

  if (state.isQuery) {
    state.queryParams.resource_id = route.query.resource_id;
  }
  
  handleQuery();
}

const onClickUser = (item) => {
  state.dialogFormVisible = true;
  state.dialogForm = {
    ...item,
    role: item.role
  };
};

const onClickPublish = (item) => {
  ElMessageBox.confirm(
    '确定上线，此版本将上线，线上版本将下线',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async () => {
      const res = await rollbackVersion({
        version_id: item._id,
      })
      if (res.isSuccess) {
        ElMessage({
          type: 'success',
          message: '上线成功',
        })
        handleQuery();
      } else {
        ElMessage({
          type: 'success',
          message: '上线失败',
        })
      }
    })
    .catch(() => {
      console.log();
    })
}

const onClickWatchData = (item) => {
  jsonData.value = item.data;
  isShowJson.value = true;
}

onMounted(() => {
  const querRsourceId = route.query.resource_id;
  if (querRsourceId) {
    state.isQuery = true;
    state.queryParams.resource_id = querRsourceId;
  }
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
