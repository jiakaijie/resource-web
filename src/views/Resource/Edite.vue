<template>
  <el-form ref="ruleFormRef" :rules="rules" :model="formData" :inline="true">
    <el-form-item label="资源名称：" prop="name">
      <el-input v-model="formData.name" clearable />
    </el-form-item>
    <el-form-item label="资源描述：">
      <el-input v-model="formData.desc" clearable />
    </el-form-item>
  </el-form>
  <div>
    数据类型：
    <el-select v-model="tableData.type">
      <el-option
        v-for="item in tableTypeArr"
        :key="item.key"
        :label="item.value"
        :value="item.key"
      ></el-option>
    </el-select>
    <el-button type="primary" @click="onClickFirstAddData">添加数据</el-button>
  </div>

  <el-table
    :data="tableData.table"
    style="width: 100%; margin-bottom: 20px"
    border
    row-key="id"
  >
    <el-table-column label="key">
      <template #default="scope">
        <div class="data-one">
          <div class="type">
            <el-select v-model="scope.row.keyType" @change="onChangeKeyType(scope.row)">
              <el-option
                v-for="item in keyTypeArr"
                :key="item.key"
                :label="item.value"
                :value="item.key"
              ></el-option>
            </el-select>
          </div>
          <el-input width="100px" v-model="scope.row.key" clearable />
        </div>
      </template>
    </el-table-column>
    <el-table-column label="value">
      <template #default="scope">
        <div class="data-one" v-if="scope.row.keyType === typeConfig.string">
          <div class="type">
            <el-select v-model="scope.row.valueType">
              <el-option
                v-for="item in valueTypeArr"
                :key="item.key"
                :label="item.value"
                :value="item.key"
              ></el-option>
            </el-select>
          </div>
          <el-input width="100px" v-model="scope.row.value" clearable />
        </div>
      </template>
    </el-table-column>
    <el-table-column label="操作">
      <template #default="scope">
        <el-button type="danger" @click="handleSubmit(ruleFormRef)"
          >删除</el-button
        >
        <el-button type="primary" @click="handleSubmit(ruleFormRef)"
          >新增</el-button
        >
        <el-button
          type="success"
          @click="handleSubmit(ruleFormRef)"
          v-if="scope.row.valueType === typeConfig.urlLink"
          >上传</el-button
        >
      </template>
    </el-table-column>
  </el-table>
  <div>
    <el-button type="primary" @click="handleSubmit(ruleFormRef)"
      >确 定</el-button
    >
    <el-button @click="cancel">取 消</el-button>
  </div>
</template>

<script lang="ts">
import { computed, ref, watch, defineComponent, reactive, nextTick } from "vue";
import { ElMessage, FormInstance, FormRules } from "element-plus";

export default defineComponent({
  name: "DeleteData",
  props: {
    dialogData: {
      type: Object,
    },
    visible: {
      type: Boolean,
    },
    cancel: {
      type: Function,
    },
    changeQuery: {
      type: Function,
    },
  },
  components: {},
  setup(props) {
    const ruleFormRef = ref<FormInstance>();
    const currentData = computed(() => props.dialogData);
    const typeConfig = {
      string: "string",
      number: "number",
      object: "object",
      array: "array",
      urlLink: "urlLink",
    };

    const tableTypeConfig = {
      array: "array",
      object: "object",
    };
    const tableTypeArr = [
      {
        key: "array",
        value: "数组",
      },
      {
        key: "object",
        value: "对象",
      },
    ];

    const keyTypeArr = ref([
      {
        key: "string",
        value: "字符串",
      },
      {
        key: "object",
        value: "对象",
      },
      {
        key: "array",
        value: "数组",
      },
    ]);

    const valueTypeArr = ref([
      {
        key: "string",
        value: "字符串",
      },
      // {
      //   key: "number",
      //   value: "数字",
      // },
      {
        key: "urlLink",
        value: "图片",
      },
    ]);

    const formData = reactive({
      workcode: "",
    });
    const rules = reactive<FormRules>({
      name: [{ required: true, message: "请输入资源名称", trigger: "change" }],
    });

    const dialogVisible = ref(false);
    // watch(
    //   () => props.visible,
    //   (val) => {
    //     dialogVisible.value = val;
    //     if (val) {
    //       getEmployee("");
    //     } else {
    //       formData.workcode = "";
    //       nextTick(() => {
    //         ruleFormRef.value?.clearValidate();
    //       });
    //     }
    //   }
    // );
    const getType = (item: any) => {
      console.log(123);
    };
    const tableData = reactive<any>({
      type: tableTypeConfig.array,
      table: [],
    });
    const tableData1 = ref([
      {
        id: 1,
        key: "a",
        type: "string",
        value: "wangxiaohu",
      },
      {
        id: 2,
        key: "b",
        type: "string",
        value: "wangxiaohu",
      },
      {
        id: 3,
        key: "c",
        type: "array",
        value: "",
        children: [
          {
            id: 31,
            key: "d",
            type: "array",
            value: "wangxiaohu",
            children: [
              {
                id: 31,
                type: "string",
                key: "asjdidsajidjsi",
                value: "xxxx",
              },
              {
                id: 32,
                type: "string",
                key: "ausiusdad",
                value: "wangxiaohu",
              },
            ],
          },
          {
            id: 32,
            key: "e",
            type: "string",
            value: "wangxiaohu",
          },
        ],
      },
      {
        id: 4,
        key: "aksidjasidjisjidsjid",
        type: "string",
        value: "haushushu",
      },
    ]);

    const handleSubmit = async (formEl: FormInstance | undefined) => {
      if (!formEl) return;
      await formEl.validate(async (valid, fields) => {
        if (valid) {
          const userArr = formData.workcode.split("-") || [];
          // bindAccount({
          //   wxUserid: (currentData.value && currentData.value.wxUserid) || "",
          //   workCode: userArr[1],
          //   name: userArr[0],
          // }).then(() => {
          //   ElMessage({
          //     message: "绑定成功",
          //     type: "success",
          //   });
          //   props.cancel && props.cancel();
          //   props.changeQuery && props.changeQuery();
          // });
        } else {
          console.log("error submit!", fields);
        }
      });
    };

    const onClickFirstAddData = () => {
      if (tableData.type === tableTypeConfig.array) {
        tableData.table.push({
          key: "0",
          keyType: typeConfig.string,
          value: "",
          valueType: typeConfig.string,
          children: []
        });
      } else {
        // tableData.table.push({
        //   key: "",
        //   type: "string",
        //   value: "",
        // });
      }
    };

    const onChangeKeyType = (row: any) => {
      // debugger
      const list = JSON.parse(JSON.stringify(tableData.table));
      if (row.keyType === typeConfig.object || row.keyType === typeConfig.array) {
        list[0].children.push({
          key: "0",
          keyType: typeConfig.string,
          value: "",
          valueType: typeConfig.string,
        })
        console.log(JSON.parse(JSON.stringify(list)));
        tableData.table = list;
      }
      console.log(123);
    }

    return {
      tableTypeArr,
      keyTypeArr,
      valueTypeArr,
      typeConfig,
      tableTypeConfig,
      tableData,
      formData,
      rules,
      dialogVisible,
      currentData,
      ruleFormRef,
      handleSubmit,
      onClickFirstAddData,
      onChangeKeyType
    };
  },
});
</script>
<style lang="less" scoped>
.data-one {
  display: inline-block;
  display: flex;
  align-items: center;
  justify-content: end;
  .type {
    margin-right: 30px;
  }
}
:deep.el-table td.el-table__cell div {
  display: flex;
}
</style>