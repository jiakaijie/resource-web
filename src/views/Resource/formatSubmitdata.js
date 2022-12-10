
const makeArray = (root, children) => {
    console.log('array', children);
}
const makeObject = (root, children) => {
    console.log('object', children);
}

export const formatSubmateData = (root) => {
    console.log('root');
    let res;
    if (['number', 'string'].includes(root.type)) {
        res = root.value;
    } else if (root.type === 'array') {
        res = [];
        res = makeArray(res, root.children);
    } else {
        res = {};
        res = makeObject(res, root.children)
    }
    return res;
} 