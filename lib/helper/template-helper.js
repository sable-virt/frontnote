'use strict';
const HELPER = {
    // currentファイルかどうか
    isCurrent(current,file) {
        return (current.file === file.file);
    },
    // 指定した属性が含まれているかどうか
    hasAttribute(attributes,attr) {
        return (attributes.indexOf(attr) !== -1);
    }
};
module.exports = HELPER;