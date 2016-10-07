'use strict';

const TemplateHelper = require('../helper/template-helper');
const ejs = require('ejs');

const CSS = '<link rel="stylesheet" href="<%=src%>" />';
const SCRIPT = '<script src="<%=src%>"></script>';

class Render {
    render(template, params) {
        //EJSを使ってテンプレートレンダリング
        params.helpers = TemplateHelper;
        return ejs.render(template, params);
    }

    /**
     * HTMLに追加読み込みするファイルパスまたはパスが入った配列からタグを生成
     * @param type(css|script)
     * @param arr
     * @return {string|array}
     */
    generateInclude(type, data) {
        if (!data) return '';
        let template = SCRIPT;
        if (type === 'css') {
            template = CSS;
        }
        if (typeof data === 'string') {
            return ejs.render(template, {src: data});
        }
        let result = data.map((d) => {
            return ejs.render(template, {src: d});
        });
        return result.join('\n');
    }

    /**
     * HTMLに追加読み込みするCSSファイルパスまたはパスが入った配列からタグを生成
     * @param arr
     * @return {string|array}
     */
    generateIncludeCss(arr) {
        return this.generateInclude('css', arr);
    }

    /**
     * HTMLに追加読み込みするJSファイルパスまたはパスが入った配列からタグを生成
     * @param arr {string|array}
     */
    generateIncludeScript(arr) {
        return this.generateInclude('script', arr);
    }
}
module.exports = Render;