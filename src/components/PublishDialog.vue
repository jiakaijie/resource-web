<template>
  <el-dialog v-model="visible" title="发布版本" @close="props.cancel">
    <el-form :model="myDialogForm">
      <el-form-item>
        <div class="title">发布后此版本将上线，线上版本将下线，确定发布</div>
      </el-form-item>
      <el-form-item label="当前线上使用版本：">
        <div class="one">{{ resourceData.currentVersion.num || '无' }}</div>
      </el-form-item>
      <el-form-item label="当前线上使用版本描述：">
        <div class="one">{{ resourceData.currentVersion.desc || '无' }}</div>
      </el-form-item>
      <el-form-item label="发过最高版本：">
        <div class="two">{{ resourceData.highVersion.num || '无' }}</div>
      </el-form-item>
      <el-form-item label="发过最高版本描述：">
        <div class="two">{{ resourceData.highVersion.desc || '无' }}</div>
      </el-form-item>
      <el-form-item label="将要发布版本：">
        <div class="three">{{ resourceData.highVersion.num  ? resourceData.highVersion.num + 1 : 1 }}</div>
      </el-form-item>
      <el-form-item label="将要发布版本描述：">
        <el-input width="100px" v-model="myDialogForm.desc" placeholder=""></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="props.cancel">取 消</el-button>
        <el-button type="primary" @click="onClickConfrim">
          确 定
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { computed, defineProps, ref, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { getVersionDetail } from '../api/resource';
import { createVersion } from '../api/version';


const props: any = defineProps({
  isShow: {
    type: Boolean,
    default: false,
  },
  cancel: {
    type: Function,
  },
  confirm: {
    type: Function,
  },
  resource_id: {
    type: String,
    default: ''
  },
  data: {
    type: Object
  }
})

const visible = computed(() => props.isShow);

const myDialogForm = ref({
  desc: ''
});

const resourceData: any = ref({
  currentVersion: {
    num: '',
    desc: ''
  },
  highVersion: {
    num: '',
    desc: '',
  },
});

const myResourceId = computed(() => props.resource_id);
const myData = computed(() => props.data);

const onClickConfrim = async () => {
  const createData = {
    desc: myDialogForm.value.desc,
    resource_id: myResourceId.value,
    data: JSON.parse(JSON.stringify(myData.value)),
  }

  const res: any = await createVersion(createData);

  if (res.isSuccess) {
    ElMessage.success('版本发布成功');
  } else {
    ElMessage.success('版本发布失败');
  }

  console.error(createData);
  props.confirm();
}

watch(myResourceId, async (newVal) => {
  const res = await getVersionDetail(newVal);
  resourceData.value = res;
})

</script>
<style lang="less" scoped>
.title {
  color: #f56c6c;
  font-weight: 500;
  font-size: 20px;
}
.one {
  font-weight: 500;
  font-size: 20px;
  color: #67c23a;
}
.two {
  font-weight: 500;
  font-size: 20px;
  color: #409eff;
}

.three {
  font-weight: 500;
  font-size: 20px;
  color: #e6a23c;
}
</style>
