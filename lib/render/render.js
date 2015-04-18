var TemplateHelper = require('../helper/template-helper');
var ejs = require('ejs');

var Render = function() {
};
Render.prototype = {
    render: function(template,params) {
        //EJSを使ってテンプレートレンダリング
        params.helpers = TemplateHelper;
        return ejs.render(template, params);
    },
    /**
     * HTMLに追加読み込みするCSSファイルパスまたはパスが入った配列からタグを生成
     * @param arr
     * @return {string|array}
     */
    generateIncludeCss: function(arr) {
        if (!arr) return '';
        if (typeof arr === 'string') {
            return '<link rel="stylesheet" href="'+arr+'"/>';
        }
        var result = [];
        for (var i = 0,len = arr.length; i < len; i++) {
            result.push('<link rel="stylesheet" href="'+arr[i]+'"/>');
        }
        return result.join('\n');
    },

    /**
     * HTMLに追加読み込みするJSファイルパスまたはパスが入った配列からタグを生成
     * @param arr {string|array}
     */
    generateIncludeScript: function(arr) {
        if (!arr) return '';
        if (typeof arr === 'string') {
            return '<script src="'+arr+'"></script>';
        }
        var result = [];
        for (var i = 0,len = arr.length; i < len; i++) {
            result.push('<script src="'+arr[i]+'"></script>');
        }
        return result.join('\n');
    }
};
module.exports = Render;