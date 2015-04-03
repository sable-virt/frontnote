var HELPER = {
    // currentファイルかどうか
    isCurrent: function(current,file) {
        return (current.file === file.file);
    },
    // 指定した属性が含まれているかどうか
    hasAttribute: function(attributes,attr) {
        return (attributes.indexOf(attr) !== -1);
    }
};
module.exports = HELPER;