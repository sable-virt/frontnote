var TemplateHelper = require('../helper/template-helper');
var ejs = require('ejs');

var Render = function() {};
Render.css = '<link rel="stylesheet" href="<%=src%>" />';
Render.script = '<script src="<%=src%>"></script>';
Render.prototype = {
    render: function(template,params) {
        //EJSを使ってテンプレートレンダリング
        params.helpers = TemplateHelper;
        return ejs.render(template, params);
    },
    /**
     * HTMLに追加読み込みするファイルパスまたはパスが入った配列からタグを生成
     * @param type(css|script)
     * @param arr
     * @return {string|array}
     */
    generateInclude: function(type,data){
        if (!data) return '';
        var template = Render.script;
        if(type === 'css') {
            template = Render.css;
        }
        if (typeof data === 'string') {
            return ejs.render(template,{src:data});
        }
        var result = [];
        for (var i = 0,len = data.length; i < len; i++) {
            result.push(ejs.render(template, {src:data[i]}));
        }
        return result.join('\n');
    },
    /**
     * HTMLに追加読み込みするCSSファイルパスまたはパスが入った配列からタグを生成
     * @param arr
     * @return {string|array}
     */
    generateIncludeCss: function(arr) {
        return this.generateInclude('css',arr);
    },

    /**
     * HTMLに追加読み込みするJSファイルパスまたはパスが入った配列からタグを生成
     * @param arr {string|array}
     */
    generateIncludeScript: function(arr) {
        return this.generateInclude('script',arr);
    }
};
module.exports = Render;