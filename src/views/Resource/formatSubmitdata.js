import {utils} from "./utils";
const makeArray = (children) => {
    console.log('array', children);
    let resArr = [];
    for (let i = 0; i< children.length; i++) {
    
        let currentItem = children[i];
        const {type, value} = currentItem;

        let res;
        if (utils.isSimpleType(type)) {
            res = value;
        } else if (utils.isArrayType(type)) {
            const {children: child} = currentItem;
            res = makeArray(child);
        } else {
            const {children: child} = currentItem;
            res = makeObject(child);
        }
        resArr.push(res);
    }
    return resArr;
}
const makeObject = (children) => {
    let resObj = {};

    for (let i = 0; i< children.length; i++) {

        let currentItem = children[i];
        const {type, key, value} = currentItem;
        let res;
        if (utils.isSimpleType(type)) {
            res = value;
        }else if (utils.isArrayType(type)) {
            const {children: child} = currentItem;
            res = makeArray(child);
        } else {
            const {children: child} = currentItem;
            res = makeObject(child);
        }
        resObj[key] = res;
    }
    return resObj;
}

export const formatSubmateData = (root) => {
    let res;
    if (['number', 'string'].includes(root.type)) {
        res = root.value;
    } else if (root.type === 'array') {
        res = makeArray(root.children);
    } else {
        res = makeObject(root.children)
    }
    return res;
} 