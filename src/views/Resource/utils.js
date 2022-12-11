const utils = {
    isSimpleType: (type) => {
        return ['string', 'number', 'img'].includes(type);
    },
    isArrayType: (type) => {
        return type === 'array';
    },
    isObjectType: (type) => {
        return type === 'object';
    }
};

export {utils}