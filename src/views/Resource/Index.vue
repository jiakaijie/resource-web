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
        <el-button type="primary" @click="onClickCreate">新建</el-button>
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
          <el-tooltip content="查看当前资源数据" placement="top">
            <el-button
              type="primary"
              link
              plain
              @click.stop="onClickWatchData(scope.row)"
              >数据</el-button
            >
          </el-tooltip>
          <el-tooltip content="资源对应的所有版本" placement="top">
            <el-button
              type="primary"
              link
              plain
              @click.stop="onClickToVersion(scope.row)"
              >版本</el-button
            >
          </el-tooltip>
          <el-button
            :disabled="isCanClick(scope.row)"
            type="primary"
            link
            plain
            @click.stop="onClickDetail(scope.row)"
            >编辑</el-button
          >
          <el-button
            :disabled="isCanClick(scope.row)"
            type="primary"
            link
            plain
            @click.stop="onClickPublish(scope.row)"
            >发布</el-button
          >
          <el-button
            :disabled="isCanClick(scope.row)"
            type="primary"
            link
            plain
            @click.stop="onClickDetail(scope.row)"
            >回滚</el-button
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
  <JsonViewDialog 
    :json-data="jsonData" 
    :is-show="isShowJson"
    :close="()=> (isShowJson = false)"
  />
  <PublishDialog 
    :is-show="isPublishShow"
    :resource_id="publishResourceId"
    :data="publishData"
    :cancel="() => {isPublishShow = false}" 
    :confirm="() => {isPublishShow = false}"
  />
</template>

<script setup>
import { reactive, onMounted, toRefs, computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { getResourceList } from '../../api/resource';
import JsonViewDialog from '../../components/JsonViewDialog.vue';
import PublishDialog from '../../components/PublishDialog.vue';
import { ElMessage, ElMessageBox, FormInstance, FormRules } from "element-plus";
import { getyyyymmdd, getyyyymmddMMss } from '../../utils/time';

const router = useRouter();
const store = useStore();

const isShowJson = ref(false);
const jsonData = ref({});

const isPublishShow = ref(false);
const publishData = ref({});
const publishResourceId = ref('')


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

const isCanClick = (item) => {
  return !(user.value.role === 1 || item.create_user_id === user.value._id);
}

const getVersion = (item) => {
  return item.version_id ? item.num : '暂未发布版本'
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

const onClickToVersion = (item) => {
  router.push({
    path: `/version/list`,
    query: {
      resource_id: item._id
    }
  });
}

const onClickCreate = () => {
  router.push({
    path: `/resource/edit`,
  });
}

const onClickWatchData = (item) => {
  jsonData.value = item.data;
  isShowJson.value = true;
}

const onClickPublish = (item) => {
  isPublishShow.value = true;
  publishResourceId.value = item._id;
  publishData.value = item.data;
}

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
