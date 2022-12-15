<template>
  <el-form ref="formRef" :model="resourceData" :inline="true">
    <el-form-item label="资源名称：" prop="name" :rules="[
        {
          required: true,
          message: '资源名称未填',
          trigger: ['change'],
        },
      ]">
      <el-input v-model="resourceData.name" clearable />
    </el-form-item>
    <el-form-item label="资源描述：">
      <el-input v-model="resourceData.desc" clearable />
    </el-form-item>
  </el-form>

  <div class="data-control">
    <el-row :gutter="20">
        <el-col :span="6">
            <el-input value="root" disabled></el-input>
        </el-col>
        <el-col :span="6">
            <el-select 
                v-model="root.type"
                @change="handleChange"
                style="width: 100%"
            >
                <el-option
                    v-for="item in dataType"
                    :key="item"
                    :label="item"
                    :value="item"
                ></el-option>
            </el-select>
        </el-col>
        
        <el-col :span="6">
            <el-input
                v-model="root.value"
                placeholder="值"
                v-if="root.type === 'img'"
            >
                <template #append>
                    <el-upload
                        :show-file-list="false"
                        :action="`${host}/api/upload/files`"
                        :limit="1"
                        @success="uploadSucess"
                    >
                        <el-button > <el-icon><UploadFilled /></el-icon> </el-button>
                    </el-upload>
                </template>
            </el-input>
            <el-input 
                v-else
                v-model="root.value" 
                :disabled="root.type === 'array' || root.type === 'object'" 
                placeholder="值"></el-input>
        </el-col>
        <el-col :span="4">
            <el-input v-model="root.desc" placeholder="描述"></el-input>
        </el-col>
        <el-col :span="2">
            <el-icon v-if="root.type === 'object' || root.type === 'array'" @click="handlePlus"><Plus /></el-icon>
        </el-col>
    </el-row>
    
    <z-tree 
      :data="root.children"
      :root-type="root.type"
    ></z-tree>

  </div>
  <div class="btn-area">
    <el-button type="primary" @click="handleSubmit(formRef)"
      >确 定</el-button
    >
    <el-button @click="cancel">取 消</el-button>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch, reactive, nextTick, onMounted } from "vue";
import { useRoute } from 'vue-router';
import { ElMessage, FormInstance, UploadUserFile } from "element-plus";
import ZTree from "./ZTree.vue";

import { getResourceList, createResource, getResourceDetail, updateResource } from '../../api/resource'
import {formatSubmateData} from "./formatSubmitdata.js";
import {formatGetData} from "./formatGetdata.js";
import {utils} from "./utils";
import {apiHostConfig} from "@/config/host";
import {env} from "@/config/env";

    const host = ref<string>(apiHostConfig[env]);

    const route = useRoute();
    const isEdit = ref(false);
    const fileList = ref<UploadUserFile[]>([])

    const formRef = ref<FormInstance>()
    const dataTypeConfig = [
       "array","object",
    ];
    const dataType = reactive(dataTypeConfig);

    const tableData = reactive({});
  
    const resourceData = reactive({
        name: "",
        desc: ""
    });
    const typeConfig = reactive({});
    const root = reactive<any>( {
        type: "",
        desc: "",
        value: "",
        children: []
    });

    const handleSubmit = async (formEl: FormInstance | undefined) => {
        if (!formEl) return
        formEl.validate(async (valid) => {
          if (valid) {
            const data = formatSubmateData(root);
            console.log('root', data);

            const bodyData: any = {
              resourceName: resourceData.name,
              resourceDesc: resourceData.desc,
              data
            }
            try {
              if (isEdit.value) {
                bodyData._id = route.query.id;
                const res = await updateResource(bodyData);
                ElMessage.success('编辑成功');
              } else {
                // debugger
                const res = await createResource(bodyData);
                ElMessage.success('创建成功');
              }
            } catch (err) {
              ElMessage.error('创建异常');
            }
          } else {
            console.log('error submit!')
            return false
          }
        })
    };

    const cancel = ()=> {
        console.log('cancel')
    }
    const handlePlus = () => {
        root.children.push({
            id: Date.now()
        });
    }

    const handleChange = ()=> {
        if (utils.isSimpleType(root.type)) {
            root.children = [];
        }
    }

    const uploadSucess = (response: any)=> {
        console.log('upload', response);
        const {url} = response.data;
        root.value = url;
    }

    const myGetResourceDetail = async (id: any) => {
      const data: any = await getResourceDetail(id);
      const { name, desc, data: resData } = data || {};

      const res = formatGetData(resData);
      Object.assign(root, res);

      console.log('res', res, root);

      resourceData.name = name;
      resourceData.desc = desc;
    }

    onMounted(async () => {
      if (route && route.query && route.query.id) {
        isEdit.value = true;

        myGetResourceDetail(route.query.id);
      } else {
        console.log(123);
      }

    })

</script>
<style lang="less" scoped>
.data-control {
    margin-top: 20px;
}
.btn-area {
    margin-top: 20px;
}
:deep.el-table td.el-table__cell div {
  display: flex;
}
</style>