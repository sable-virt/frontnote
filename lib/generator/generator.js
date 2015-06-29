var Render = require('../render/render');
var File = require('../file/file');
var async = require('async');
var path = require('path');
var md = require("marked");
var helpers = require('../helper/template-helper');
var Debug = require('../debug/debug');
var Generator = function(data,options) {
    this.data = data;
    this.options = options;
    this.Render = new Render();
};
Generator.prototype = {
    generate: function(callback) {
        async.waterfall([
            //出力先削除
            this.cleanOutputDir.bind(this),
            //テンプレート読み込み
            this.loadTemplate.bind(this),
            //overviewファイルを読み込んでindexを作成
            this.writeOverview.bind(this),
            //ファイルごとにスタイルガイドを作成
            this.writePages.bind(this),
            //スタイルガイドができたらincludeするその他ファイルをコピー
            this.copyOtherFiles.bind(this),
        ], callback);
    },
    cleanOutputDir: function(callback) {
        if (this.options.clean) {
            File.clean(this.options.out,callback);
        } else {
            callback();
        }
    },
    loadTemplate: function(callback) {
        //テンプレートファイルの読み込み
        File.load(this.options.template,function (err, res) {
            if (err) throw(err);
            if (this.options.verbose) {
                Debug.echo('Read',this.options.template);
            }
            callback(null,res);
        }.bind(this));
    },
    writeOverview: function(template,callback) {
        var data = this.data;
        var options = this.options;
        var Render = this.Render;
        //styleguide.mdを読み込み
        File.load(options.overview,function (err, res) {
            if (err) throw(err);
            if (options.verbose) {
                Debug.echo('Read',options.overview);
            }
            //EJSを使ってテンプレートレンダリング
            var outputPath = options.out + '/index.html';
            var rendered = Render.render(template,{
                title: options.title,
                current: md.parse(res),
                files: data,
                overview: true,
                helpers: helpers,
                css: Render.generateIncludeCss(options.css),
                script: Render.generateIncludeScript(options.script)
            });
            File.writeFile(outputPath,rendered,function(err) {
                if (err) throw err;
                if (options.verbose) {
                    Debug.echo('Write',options.out + '/index.html');
                }
                callback(null,template);
            });
        });
    },
    writePages: function(template,callback) {
        var data = this.data;
        var options = this.options;
        var Render = this.Render;
        async.eachSeries(this.data,function(section,next) {
            var outputPath = options.out + '/' + section.url;
            //EJSを使ってテンプレートレンダリング
            var rendered = Render.render(template, {
                title: options.title,
                current: section,
                files: data,
                overview: false,
                helpers: helpers,
                css: Render.generateIncludeCss(options.css),
                script: Render.generateIncludeScript(options.script)
            });
            File.writeFile(outputPath, rendered, function(err) {
                if (err) throw err;
                if (options.verbose) {
                    Debug.echo('Write',options.out + '/' + section.fileName + '.html');
                }
                next();
            });
        } ,function() {
            callback();
        });
    },
    copyOtherFiles: function(callback) {
        if (this.options.includeAssetPath) {
            // includeAssetPathが文字列ならそのまま実行、配列ならeachで回して実行
            if (typeof this.options.includeAssetPath === 'string') {
                this.readFiles(this.options.includeAssetPath,callback);
            } else {
                var gen = this;
                async.each(this.options.includeAssetPath,function(targetPath,next) {
                    gen.readFiles(targetPath,next);
                },function() {
                    callback();
                });
            }
        } else {
            callback();
        }
    },
    /**
     * ファイルを１つずつ読み込んでコピー
     * @param pathPattern
     * @param callback
     */
    readFiles: function(pathPattern,callback) {
        var options = this.options;
        async.waterfall([
            //パターン文字列からファイルパス配列取得
            function (next) {
                //テンプレートディレクトリからの相対でminimatch形式の文字列を作成
                pathPattern = path.dirname(options.template) + '/' + pathPattern;
                //対象ファイル一覧取得
                File.getFiles(pathPattern, function(err,files) {
                    if (err) throw(err);
                    next(null,files);
                });
            },
            //ファイルパス配列をもとにファイルを出力ディレクトリに複製
            function (files, next) {
                File.copyAllFiles(files, options.template,options.out, next);
            }
        ],function () {
            callback();
        });
    }
};
module.exports = Generator;