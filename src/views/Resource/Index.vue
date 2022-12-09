<template>
  <div class="app-container">
    <el-form ref="queryFormRef" :model="queryParams" :inline="true">
      <el-form-item label="资源ID：">
        <el-input
          v-model="queryParams._id"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="资源名称：">
        <el-input
          v-model="queryParams.name"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="创建人：">
        <el-select 
          v-model="queryParams.create_user" 
          clearable
          remote>
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
          v-model="queryParams.update_user" 
          clearable
          remote>
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
      <el-table-column prop="create_time" align="center" label="创建时间" />
      <el-table-column prop="create_user" align="center" label="创建人" />
      <el-table-column prop="update_time" align="center" label="修改时间"/>
      <el-table-column prop="update_user" align="center" label="修改人" />
      <el-table-column prop="version_id" align="center" label="当前版本" />
      <el-table-column align="url" label="资源链接">
        <template #default="scope">
          {{ getUrltext(scope.row) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150">
        <template #default="scope">
          <el-button
            type="text"
            circle
            plain
            @click.stop="onClickDetail(scope.row)"
            >详情</el-button
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
  </div>
</template>

<script setup>
import { reactive, onMounted, toRefs, computed } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { getResourceList } from '../../api/resource'

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

const getUrltext = (item) => {
  return item.url || '';
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

const onClickDetail = (data) => {
  router.push({
    path: `/bu/stuDetails`,
    query: {
      id: data.id
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
