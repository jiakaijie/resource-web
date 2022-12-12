const utils = {
    isSimpleType: (type: string): boolean => {
        return ['string', 'number', 'img'].includes(type);
    },
    isArrayType: (type: string): boolean => {
        return type === 'array';
    },
    isObjectType: (type: string): boolean => {
        return type === 'object';
    }
};

export {utils}