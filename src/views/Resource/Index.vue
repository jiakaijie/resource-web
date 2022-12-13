<template>
  <div class="app-container">
    <el-form ref="queryFormRef" :model="queryParams" :inline="true">
      <el-form-item label="资源ID：">
        <el-input
          v-model="queryParams._id"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="资源名称：">
        <el-input
          v-model="queryParams.name"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="创建人：">
        <el-select 
          v-model="queryParams.create_user_id" 
          >
          <el-option 
            v-for="item in allUserList" 
            :key="item._id"
            :label="`${item.name}（${item.workcode}）`" 
            :value="item._id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="修改人：">
        <el-select 
          v-model="queryParams.update_user_id" 
          >
          <el-option 
            v-for="item in allUserList" 
            :key="item._id"
            :label="`${item.name}（${item.workcode}）`" 
            :value="item._id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleQuery">搜索</el-button>
        <el-button @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="loading" :data="list" border>
      <el-table-column prop="_id" align="center" label="资源ID" />
      <el-table-column prop="name" align="center" label="资源名称" />
      <el-table-column prop="desc" align="center" label="资源描述" />
      <el-table-column prop="create_time" align="center" label="创建时间">
        <template #default="scope">
          {{ getTime(scope.row.create_time) }}
        </template>
      </el-table-column>
      <el-table-column prop="create_user" align="center" label="创建人" />
      <el-table-column prop="update_time" align="center" label="修改时间">
        <template #default="scope">
          {{ getTime(scope.row.update_time) }}
        </template>
      </el-table-column>
      <el-table-column prop="update_user" align="center" label="修改人" />
      <el-table-column prop="version_id" align="center" label="当前版本">
        <template #default="scope">
          {{ getVersion(scope.row) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="资源链接">
        <template #default="scope">
          {{ getUrltext(scope.row) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="180">
        <template #default="scope">
          <el-button
            type="primary"
            link
            plain
            @click.stop="onClickDetail(scope.row)"
            >编辑</el-button
          >
          <el-button
            type="primary"
            link
            plain
            @click.stop="onClickDetail(scope.row)"
            >发布</el-button
          >
          <el-button
            type="primary"
            link
            plain
            @click.stop="onClickDetail(scope.row)"
            >回滚</el-button
          >
          <el-button
            type="primary"
            link
            plain
            @click.stop="onClickDetail(scope.row)"
            >版本</el-button
          >
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
  </div>
</template>

<script setup>
import { reactive, onMounted, toRefs, computed } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { getResourceList } from '../../api/resource';
import { getyyyymmdd, getyyyymmddMMss } from '../../utils/time';

const router = useRouter();
const store = useStore();

const state = reactive({
  loading: false,
  total: 0,
  queryParams: {
    page: 1,
    page_size: 10,
  },
  list: [],
});
const user = computed(() => store.state.user);
const allUserList = computed(() => store.state.allUserList);
const { loading, total, queryParams, list } = toRefs(state);

const getVersion = (item) => {
  return item.version_id ? item.version : '暂未发布版本'
}
const getTime = (time) => {
  return getyyyymmddMMss(time)
}
const getUrltext = (item) => {
  return item.url ? item.url : '暂未发布版本';
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
      (await getResourceList(data)) || {};
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

const onClickDetail = (item) => {
  router.push({
    path: `/resource/edit`,
    query: {
      id: item._id
    }
  });
};

onMounted(() => {
  handleQuery();
});
</script>
<style lang="less" scoped>
.app-container {
}
.title {
  margin-bottom: 20px;
}
.right-button {
  float: right;
}
.pagination {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>
