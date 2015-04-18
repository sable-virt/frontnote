var colors = require('colors');
var DEBUG_HELPER = {
    /**
     * console.logを色付きで出力
     * @param label
     * @param text
     * @param color
     */
    echo: function(label,text,color) {
        var str = '[' + label + '] ' + text;
        if (!color) {
            console.log(str);
        } else {
            console.log(colors[color](text));
        }
        return str;
    }
};
module.exports = DEBUG_HELPER;