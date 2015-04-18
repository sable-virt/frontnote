var cache = require('memory-cache'),
    path = require('path'),
    sanitizer = require('sanitizer');

var PATTERNS = require('../const/pattern.js');

var Parser = function(){};
Parser.prototype = {
    parse: function(file,content,useCache) {
        if (useCache) {
            var cacheData = cache.get(file);
            if (cacheData === content) {
                return null;
            }
            cache.put(file,content);
        }
        var overview = content.match(PATTERNS.overview);
        if (overview) {
            overview = this.parseComments(overview);
            if (overview) {
                overview = overview[0];
            }
        }
        var colors = content.match(PATTERNS.colors);
        if (colors) {
            colors = this.parseColors(colors);
        }
        var comments = content.match(PATTERNS.comment);
        if (comments) {
            comments = this.parseComments(comments);
        }
        if(overview || comments || colors) {
            var fileName = path.basename(file,path.extname(file));
            var relPath = path.relative(__dirname, path.dirname(file));
            if (relPath) {
                relPath = relPath.replace(/\.\.\//g,'').replace(/\.\.\\/g,'').replace(/\//g,'-').replace(/\\/g,'-') + '-';
            }
            return {
                file: file,
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
    },

    /**
     * コメントの塊をパースする
     * @param comments
     * @returns {Array}
     */
    parseComments: function(comments) {
        var result = [];
        for (var i = 0, len = comments.length; i < len; i++) {
            var com = this.parseComment(comments[i]);
            if (com) {
                result.push(com);
            }
        }
        return result;
    },

    /**
     * カラーコメントの塊をパースする
     * @param colors
     * @returns {Array}
     */
    parseColors: function(colors) {
        var result = [];
        for (var i = 0, len = colors.length; i < len; i++) {
            var color = this.parseColor(colors[i]);
            if (color) {
                result = result.concat(color);
            }
        }
        return result;
    },
    /**
     * カラーコメントパースする
     * @param color
     * @returns {Array}
     */
    parseColor: function(color) {
        var colors = this.filterPattern(color,PATTERNS.attr,false),
            result = [];
        for(var i = 0,len = colors.length; i < len; i++) {
            var matches = colors[i].match(PATTERNS.color);
            if (matches.length > 2) {
                result.push({
                    value: matches[0],
                    name: matches[1],
                    color: matches[2]
                });
            }
        }
        return result;
    },
    /**
     * コメントをパースする
     * @param comment
     * @returns {{title: Array, comment: Array, attributes: (*|Array), markdown: *, html: *, code: *}}
     */
    parseComment: function(comment) {
        comment = comment.replace(PATTERNS.prefix,'');

        // 属性
        var attrs = this.filterPattern(comment,PATTERNS.attr,false);
        comment = comment.replace(PATTERNS.attr,'');

        // サンプルコード領域
        var code = this.filterPattern(comment,PATTERNS.code);
        comment = comment.replace(PATTERNS.code,'');

        return this.sanitize(attrs,code,comment);
    },
    /**
     * パースされた文字列をサニタイズする
     * @param attrs
     * @param code
     * @param comment
     * @returns {{title: Array, comment: Array, attributes: (*|Array), code: *}}
     */
    sanitize: function(attrs,code,comment) {
        var result = {
            title: [],
            comment: [],
            attributes: attrs || [],
            code: code
        };

        var lines = comment.split(PATTERNS.splitter),
            hasTitle = false,
            i = 0,
            len = 0;

        for (i = 0, len = lines.length; i < len; i++) {
            var line = lines[i];
            if (!hasTitle) {
                if (line) {
                    result.title.push(sanitizer.escape(line));
                } else if(result.title.length !== 0) {
                    hasTitle = true;
                }
            } else if (line) {
                result.comment.push(sanitizer.escape(line));
            }
        }
        result.title = result.title.join('<br>');
        result.comment = result.comment.join('<br>');

        for (i = 0, len = result.attributes.length; i < len; i++) {
            result.attributes[i] = sanitizer.escape(result.attributes[i].replace(PATTERNS.attrPrefix,''));
        }
        return result;
    },
    /**
     * 正規表現によって一致した文字列データを返却
     * @param str
     * @param pattern
     * @param trim
     * @returns {*}
     */
    filterPattern: function(str,pattern,trim) {
        if (trim === false) {
            return str.match(pattern);
        } else {
            var match = str.match(pattern);
            if (match) {
                return match[0].replace(PATTERNS.codeWrapper,'');
            }
            return null;
        }
    }
};
module.exports = Parser;