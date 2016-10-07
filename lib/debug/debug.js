'use strict';
const chalk = require('chalk');
const DEBUG_HELPER = {
    /**
     * console.logを色付きで出力
     * @param label
     * @param text
     * @param color
     */
    echo: function(label,text,color) {
        let str = '[' + label + '] ' + text;
        if (!color) {
            console.log(str);
        } else {
            console.log(chalk[color](text));
        }
        return str;
    }
};
module.exports = DEBUG_HELPER;