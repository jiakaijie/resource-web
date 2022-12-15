import {utils} from "./utils"; 
const isImg = (data) => {
    return [".png", ".jpg", ".jpeg", ".webp", ".gif"].includes(data);
}

const getType = (data) => {
    const type = typeof data;
    if (type === 'number'){
        return "number"
    } else if (type === 'string') {
        return isImg(data) ? "img" : "string";
    } else {
        return Array.isArray(data) ? "array" : "object";
    }

}

const createDefaultItem = (type, key = "", value = "", children = []) => {
    return {
        id: Math.random().toString(),
        type,
        key,
        value,
        children
    };
}
const formatArrayData = (data, key = "") => {
    let res = createDefaultItem('array', key, '', []);
    let children = res.children;
    for (let i = 0; i< data.length; i++) {
        let currentres;
        const currentData = data[i];
        const type = getType(currentData);
        if (utils.isSimpleType(type)) {
            currentres = createDefaultItem(type, "", currentData);
        } else if (utils.isArrayType(type)){
            currentres = formatArrayData(currentData);
        } else {
            currentres = formatObjectData(currentData);
        }
        children.push(currentres);
    }
    return res;
};
const formatObjectData = (data, key = "", value = "") => {
    let res = createDefaultItem('object', key, value, []);
    let children = res.children;
    for (let key in data) {
        let currentres;
        const currentData = data[key];
        console.log('currentData', currentData);
        const type = getType(currentData);
        if (utils.isSimpleType(type)) {
            currentres = createDefaultItem(type, key, currentData);
        } else if (utils.isArrayType(type)){
            currentres = formatArrayData(currentData, key);
        } else {
            currentres = formatObjectData(currentData, key);
        }
        children.push(currentres);
    }
    return res;
};
export const formatGetData = (data) => {
    const type = getType(data);
    let res;
    if (utils.isSimpleType(type)) {
        res = createDefaultItem(type, "", data);
    } else if (utils.isArrayType(type)) {
        res = formatArrayData(data);
    } else {
        res = formatObjectData(data);
    }
    return res;
}