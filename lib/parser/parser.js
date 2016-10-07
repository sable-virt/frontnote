'use strict';
const path = require('path'),
    sanitizer = require('sanitizer');

const PATTERNS = require('../const/pattern.js');

class Parser {
    parse(file, content) {
        let overview = content.match(PATTERNS.overview);
        if (overview) {
            overview = this.parseComments(overview);
            if (overview) {
                overview = overview[0];
            }
        }
        let colors = content.match(PATTERNS.colors);
        if (colors) {
            colors = this.parseColors(colors);
        }
        let comments = content.match(PATTERNS.comment);
        if (comments) {
            comments = this.parseComments(comments);
        }
        if (overview || comments || colors) {
            let fileName = path.basename(file, path.extname(file));
            let relPath = path.relative(__dirname, path.dirname(file));
            if (relPath) {
                relPath = relPath.replace(/\.\.\//g, '').replace(/\.\.\\/g, '').replace(/\//g, '-').replace(/\\/g, '-') + '-';
            }
            return {
                file: path.relative(process.cwd(),file),
                fileName: fileName,
                url: relPath + fileName + '.html',
                dirs: file.split(path.sep),
                ext: path.extname(file),
                sections: comments,
                overview: overview,
                colors: colors
            };
        }
        return null;
    }

    /**
     * コメントの塊をパースする
     * @param comments
     * @returns {Array}
     */
    parseComments(comments) {
        let result = [];
        for (let i = 0, len = comments.length; i < len; i++) {
            let com = this.parseComment(comments[i]);
            if (com) {
                result.push(com);
            }
        }
        return result;
    }

    /**
     * カラーコメントの塊をパースする
     * @param colors
     * @returns {Array}
     */
    parseColors(colors) {
        let result = [];
        for (let i = 0, len = colors.length; i < len; i++) {
            let color = this.parseColor(colors[i]);
            if (color) {
                result = result.concat(color);
            }
        }
        return result;
    }

    /**
     * カラーコメントパースする
     * @param color
     * @returns {Array}
     */
    parseColor(color) {
        let colors = this.filterPattern(color, PATTERNS.attr, false),
            result = [];
        for (let i = 0, len = colors.length; i < len; i++) {
            let matches = colors[i].match(PATTERNS.color);
            if (matches.length > 2) {
                result.push({
                    value: matches[0],
                    name: matches[1],
                    color: matches[2]
                });
            }
        }
        return result;
    }

    /**
     * コメントをパースする
     * @param comment
     * @returns {{title: Array, comment: Array, attributes: (*|Array), markdown: *, html: *, code: *}}
     */
    parseComment(comment) {
        comment = comment.replace(PATTERNS.prefix, '');

        // 属性
        let attrs = this.filterPattern(comment, PATTERNS.attr, false);
        comment = comment.replace(PATTERNS.attr, '');

        // サンプルコード領域
        let code = this.filterPattern(comment, PATTERNS.code);
        comment = comment.replace(PATTERNS.code, '');

        return this.sanitize(attrs, code, comment);
    }

    /**
     * パースされた文字列をサニタイズする
     * @param attrs
     * @param code
     * @param comment
     * @returns {{title: Array, comment: Array, attributes: (*|Array), code: *}}
     */
    sanitize(attrs, code, comment) {
        let result = {
            title: [],
            comment: [],
            attributes: attrs || [],
            code: code
        };

        let lines = comment.split(PATTERNS.splitter),
            hasTitle = false,
            i = 0,
            len = 0;

        for (i = 0, len = lines.length; i < len; i++) {
            let line = lines[i];
            if (!hasTitle) {
                if (line) {
                    result.title.push(sanitizer.escape(line));
                } else if (result.title.length !== 0) {
                    hasTitle = true;
                }
            } else if (line) {
                result.comment.push(sanitizer.escape(line));
            }
        }
        result.title = result.title.join('<br>');
        result.comment = result.comment.join('<br>');

        for (i = 0, len = result.attributes.length; i < len; i++) {
            result.attributes[i] = sanitizer.escape(result.attributes[i].replace(PATTERNS.attrPrefix, ''));
        }
        return result;
    }

    /**
     * 正規表現によって一致した文字列データを返却
     * @param str
     * @param pattern
     * @param trim
     * @returns {*}
     */
    filterPattern(str, pattern, trim) {
        if (trim === false) {
            return str.match(pattern);
        } else {
            let match = str.match(pattern);
            if (match) {
                return match[0].replace(PATTERNS.codeWrapper, '');
            }
            return null;
        }
    }
}
module.exports = Parser;