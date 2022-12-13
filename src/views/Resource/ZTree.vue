<template>
  <div class="z-tree" 
    v-for="(item, index) in data"
    :key="item.id">
    <el-row style="margin-top: 10px;" :gutter="20">
        <el-col :span="6">
            <el-input v-model="item.key" :disabled="rootType === 'array'"></el-input>
        </el-col>
        <el-col :span="6">
                    
            <el-select 
                v-model="item.type" 
                style="width: 100%"
                @change="handleChange(item.type, index)"
            >
                <el-option
                    v-for="it in dataType"
                    :key="it"
                    :label="it"
                    :value="it"
                ></el-option>
            </el-select>
        </el-col>
        
         <el-col :span="6">
            <el-input
                v-model="item.value"
                placeholder="值"
                v-if="item.type === 'img'"
            >
                <template #append>
                    <el-upload
                        :show-file-list="false"
                        :action="`${host}/api/upload/files`"
                        :limit="1"
                        @success="uploadSucess"
                    >
                        <el-button @click="currentItem(index)"> <el-icon><UploadFilled /></el-icon> </el-button>
                    </el-upload>
                </template>
            </el-input>
            <el-input 
                v-else
                v-model="item.value" 
                :disabled="item.type === 'array' || item.type === 'object'"  
                placeholder="值"
            ></el-input>
        </el-col>
        <el-col :span="4">
            <el-input v-model="item.desc" placeholder="描述"></el-input>
        </el-col>
        <el-col :span="2">
            <el-dropdown v-if="item.type === 'array' || item.type === 'object'">
                <el-icon ><Plus /></el-icon>
                <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item @click="handlePlus(item, index, 'sub')">添加子项</el-dropdown-item>
                    <el-dropdown-item @click="handlePlus(item, index,'bor')">添加兄弟节点</el-dropdown-item>
                </el-dropdown-menu>
                </template>
            </el-dropdown>
            <el-icon v-else @click="handlePlus(item, index)"><Plus /></el-icon>
            <el-icon @click="handleMinus(index)"><Minus /></el-icon>
        </el-col>
    </el-row>
    <z-tree v-if="item && item.children" :data="item.children" :root-type="item.type"></z-tree>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, ref } from "vue";
import { utils } from "./utils";
import {apiHostConfig} from "@/config/host";
import {env} from "@/config/env";



export default defineComponent({
  name: "ZTree",
  components: {},
  props: {
    data: {
        type: Array,
        default: ()=> []
    },
    rootType: {
        type: String,
        default: ()=> ""
    }
  },
  setup(props) {
    const dataTypeConfig = [
      "string", "number", "img", "array","object",
    ];
    const {data} = toRefs<any>(props);
    console.log('data', data);
    const dataType = reactive(dataTypeConfig);
    const host = ref<string>(apiHostConfig[env]);

    const handlePlus = (curdata: any, index: number, type?: string) => {
        if (type === 'sub') {
            addSub(index);
        } else {
            data.value && data.value.push({
                id: Date.now()
            });
        }
         
    }
    const addSub = (index: number) => {
        console.log('addSub', data.value)
        if (!data.value[index].children) {
            data.value[index].children = [];
        }
        data.value[index].children.push({
            id: Date.now()
        });
    }
    const handleMinus = (index: number)=> {
        data.value.splice(index, 1);
    }
    let currentItemIndex = -1;
    const uploadSucess = (response: any)=> {
        console.log('upload', response);
        const {url} = response.data;
        data.value[currentItemIndex].value = url;
        currentItemIndex = -1;
    }

    const handleChange = (type: string, index: number)=> {
        if (utils.isSimpleType(type)) {
            data.value[index].children = [];
        } else if (utils.isArrayType(type)) {
            data.value[index].children = [];
            addSub(index);
        }
    }
    const currentItem = (index: number)=> {
        currentItemIndex = index;
    }
   
    return {
        dataType,
        host,
        currentItem,
        uploadSucess,
        handlePlus,
        handleMinus,
        handleChange
    };
  },
});
</script>
<style lang="less" scoped>
.z-tree {
    padding-left: 20px;
}
</style>