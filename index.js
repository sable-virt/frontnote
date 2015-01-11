var path = require('path'),
    async = require('async'),
    glob = require('glob'),
    fs = require('fs-extra'),//require('fs'),
    ejs = require('ejs'),
    md = require("github-flavored-markdown"),
    extend = require('util-extend'),
    sanitizer = require('sanitizer'),
    cache = require('memory-cache'),
    package = require(__dirname + '/package.json');

var VERSION = package.version;

var PATTERNS = {
    comment: /\/\*\s*s?#styleguide([^*]|\*[^/])*\*\//g,
    overview: /\/\*\s*s?#overview([^*]|\*[^/])*\*\//g,
    colors: /\/\*\s*s?#colors([^*]|\*[^/])*\*\//g,
    color: /@(.+)\s{1}(.+)$/,
    splitter: /\n/,
    prefix: /^ *\/?\**(#styleguide|#overview)?\/? */gm,
    line: /^\s*$/gm,
    attr: /^@.+$/gm,
    attrPrefix: /^@/,
    code: /```(.|\s)+```/g,
    codeWrapper: /(```)\n?/g
};
var OPTIONS = {
    overview: __dirname + '/styleguide.md',
    template: __dirname + '/template/index.html',
    includeAssetPath: 'assets/**/*',
    css: './style.css',
    script: null,
    out: './guide',
    title: 'StyleGuide',
    verbose: false,
    clean: false,
    cache: true
};

var HELPERS = {
    // currentファイルかどうか
    isCurrent: function(current,file) {
        return (current.file === file.file);
    },
    // 指定した属性が含まれているかどうか
    hasAttribute: function(attributes,attr) {
        return (attributes.indexOf(attr) !== -1);
    }
};

/**
 * FrontNote
 * @param target {string|array} 解析するファイルのminimatch形式文字列またはminimatch形式文字列が入った配列
 * @param option {object} オプション
 * @param callback {callback} 全ての処理が正常に終了したときに実行するコールバック関数
 * @constructor
 */
function FrontNote(target,option,callback) {
    echoLog('Start','FrontNote - ' + VERSION,'green');

    var options = extend({},OPTIONS);
    options = extend(options,option);
    options.out = path.resolve(options.out);

    globArrayConcat(target, function(result) {
        start(null,result);
    });

    function start(err, files) {
        if(err) throw (err);

        var data = [];
        // 外部ファイルを１つずつ読み込み
        async.forEachSeries(files, function(file, callback) {
            fs.readFile(file, 'utf8',function (err, res) {
                if (err) throw(err);
                if (options.verbose) {
                    echoLog('Read',file);
                }

                if (options.cache && !options.clean) {
                    var cacheData = cache.get(file);
                    if (cacheData === res) {
                        echoLog('Cached',file);
                        return callback();
                    }
                    cache.put(file,res);
                }

                var overview = res.match(PATTERNS.overview);
                if (overview) {
                    overview = parseComments(overview);
                    if (overview) {
                        overview = overview[0];
                    }
                }

                var colors = res.match(PATTERNS.colors);
                if (colors) {
                    colors = parseColors(colors);
                }

                var comments = res.match(PATTERNS.comment);
                if (comments) {
                    comments = parseComments(comments);
                }
                if(overview || comments || colors) {
                    var fileName = path.basename(file,path.extname(file));
                    var relPath = path.relative(__dirname, path.dirname(file));
                    if (relPath) {
                        relPath = relPath.replace(/\.\.\//g,'').replace(/\.\.\\/g,'').replace(/\//g,'-').replace(/\\/g,'-') + '-';
                    }
                    data.push({
                        file: file,
                        fileName: fileName,
                        url: relPath + fileName + '.html',
                        dirs: file.split(path.sep),
                        ext: path.extname(file),
                        sections: comments,
                        overview: overview,
                        colors: colors
                    });
                }
                callback();
            });
        }, function (err) {
            if (err) throw err;
            createStyleGuide(data,options,callback);
        });
    }
}

/**
 * コメントの塊をパースする
 * @param comments
 * @returns {Array}
 */
function parseComments(comments) {
    var result = [];
    for (var i = 0, len = comments.length; i < len; i++) {
        var com = parseComment(comments[i]);
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
function parseColors(colors) {
    var result = [];
    for (var i = 0, len = colors.length; i < len; i++) {
        var color = parseColor(colors[i]);
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
function parseColor(color) {
    var colors = filterPattern(color,PATTERNS.attr,false),
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
}

/**
 * コメントをパースする
 * @param comment
 * @returns {{title: Array, comment: Array, attributes: (*|Array), markdown: *, html: *, code: *}}
 */
function parseComment(comment) {
    comment = comment.replace(PATTERNS.prefix,'');

    // 属性
    var attrs = filterPattern(comment,PATTERNS.attr,false);
    comment = comment.replace(PATTERNS.attr,'');

    // サンプルコード領域
    var code = filterPattern(comment,PATTERNS.code);
    comment = comment.replace(PATTERNS.code,'');

    var result = {
        title: [],
        comment: [],
        attributes: attrs || [],
        code: code
    };

    var lines = comment.split(PATTERNS.splitter),
        hasTitle = false,
        i = 0;

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
}

/**
 * 正規表現によって一致した文字列データを返却
 * @param str
 * @param pattern
 * @param trim
 * @returns {*}
 */
function filterPattern(str,pattern,trim) {
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

/**
 * スタイルガイド作成
 * @param data
 * @param options
 */
function createStyleGuide(data,options,callback) {
    async.waterfall([
        //出力先削除
        function(callback) {
            if (options.clean) {
                fs.remove(options.out,callback);
            } else {
                callback();
            }
        },
        //テンプレート読み込み
        function(callback) {
            //テンプレートファイルの読み込み
            fs.readFile(options.template, 'utf8',function (err, res) {
                if (err) throw(err);
                if (options.verbose) {
                    echoLog('Read',options.template);
                }
                callback(null,res);
            });
        },
        //overviewファイルを読み込んでindexを作成
        function(template,callback) {
            //styleguide.mdを読み込み
            fs.readFile(options.overview, 'utf8',function (err, res) {
                if (err) throw(err);
                if (options.verbose) {
                    echoLog('Read',options.overview);
                }
                //EJSを使ってテンプレートレンダリング
                var rendered = ejs.render(template, {
                    title: options.title,
                    current: md.parse(res),
                    files: data,
                    overview: true,
                    helpers: HELPERS,
                    css: generateIncludeCss(options.css),
                    script: generateIncludeScript(options.script)
                });
                // ディレクトリを作りつつファイル出力
                fs.outputFile(options.out + '/index.html', rendered, function (err) {
                    if (err) throw err;
                    if (options.verbose) {
                        echoLog('Write',options.out + '/index.html');
                    }
                    callback(null,template);
                });
            });
        },
        //ファイルごとにスタイルガイドを作成
        function(template,callback) {
            async.eachSeries(data,function(section,next) {
                //EJSを使ってテンプレートレンダリング
                var rend = ejs.render(template, {
                    title: options.title,
                    current: section,
                    files: data,
                    overview: false,
                    helpers: HELPERS,
                    css: generateIncludeCss(options.css),
                    script: generateIncludeScript(options.script)
                });
                echoLog('Output',section.file);
                //スタイルガイド出力
                fs.outputFile(options.out + '/' + section.url, rend, function (err) {
                    if (err) throw err;
                    if (options.verbose) {
                        echoLog('Write',options.out + '/' + section.fileName + '.html');
                    }
                    next();
                });
            },function() {
                callback();
            });
        },
        //スタイルガイドができたらincludeするその他ファイルをコピー
        function(callback) {
            if (options.includeAssetPath) {
                // includeAssetPathが文字列ならそのまま実行、配列ならeachで回して実行
                if (typeof options.includeAssetPath === 'string') {
                    readFiles(options.includeAssetPath,callback);
                } else {
                    async.each(options.includeAssetPath,function(targetPath,next) {
                        readFiles(targetPath,next);
                    },function() {
                        callback();
                    });
                }
            } else {
                callback();
            }
            /**
             * ファイルを１つずつ読み込んでコピー
             * @param pathPattern
             * @param callback
             */
            function readFiles(pathPattern,callback) {
                async.waterfall([
                    //パターン文字列からファイルパス配列取得
                    function(next) {
                        //テンプレートディレクトリからの相対でminimatch形式の文字列を作成
                        pathPattern = path.dirname(options.template) + '/' + pathPattern;
                        //対象ファイル一覧取得
                        glob(pathPattern, function(err,files) {
                            if (err) throw(err);
                            next(null,files);
                        });
                    },
                    //ファイルパス配列をもとにファイルを出力ディレクトリに複製
                    function(files,next) {
                        copyFiles(files,options,next)
                    },
                    function() {
                        callback();
                    }
                ]);
            }
        },
        //完了
        function() {
            echoLog('Finish','FrontNote - (c)copyright frontainer.com All rights reserved.','green');
            if (callback) {
                callback();
            }
        }
    ]);
}

/**
 * ファイルをコピー
 * @param files
 * @param options
 * @param callback
 */
function copyFiles(files,options,callback) {
    async.each(files,function(file,next) {
        // ファイル情報取得
        fs.stat(file, function(err,stats) {
            if(err) throw(err);
            //ファイル以外（ディレクトリ）だったら無視して次へ
            if (!stats.isFile()) {
                next();
            } else {
                // テンプレートディレクトリからの相対パスでincludeファイルを参照
                var relPath = path.relative(path.dirname(options.template),file);
                //コピー開始
                fs.copy(file, options.out + '/' + relPath, function(err){
                    if (err) throw(err);
                    if (options.verbose) {
                        echoLog('Copy',file + ' => ' + options.out + '/' + relPath);
                    }
                    next();
                });
            }
        });
    },function() {
        callback();
    });
}

/**
 * console.logを色付きで出力
 * @param label
 * @param text
 * @param color
 */
function echoLog(label,text,color) {
    var defaultColor = '\u001b[0m'; //console's defaultColor
    var colorCode = defaultColor;
    switch(color) {
        case 'red':
            colorCode = '\u001b[31m';
            break;
        case 'green':
            colorCode = '\u001b[32m';
            break;
        case 'yellow':
            colorCode = '\u001b[33m';
            break;
        default:
            break;
    }
    console.log(colorCode + '[' + label + '] ' + defaultColor + text);
}

/**
 * HTMLに追加読み込みするCSSファイルパスまたはパスが入った配列からタグを生成
 * @param arr
 * @return {string|array}
 */
function generateIncludeCss(arr) {
    if (!arr) return '';
    if (typeof arr === 'string') {
        return '<link rel="stylesheet" href="'+arr+'"/>';
    }
    var result = [];
    for (var i = 0,len = arr.length; i < len; i++) {
        result.push('<link rel="stylesheet" href="'+arr[i]+'"/>');
    }
    return result.join('\n');
}
/**
 * HTMLに追加読み込みするJSファイルパスまたはパスが入った配列からタグを生成
 * @param arr {string|array}
 */
function generateIncludeScript(arr) {
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

/**
 * globパターン文字列または配列からファイルパスの配列を生成
 * @param arr{string|array}
 * @param callback
 */
function globArrayConcat(arr,callback) {
    var result = [];
    if (arr instanceof Array === false) {
        arr = [arr];
    }
    async.each(arr, function(pattern,next) {
        glob(pattern, function(err,files) {
            if (err) throw err;
            result = result.concat(files);
            next();
        });
    }, function() {
        callback(result);
    });
}

// プラグイン関数をエクスポート
module.exports = FrontNote;