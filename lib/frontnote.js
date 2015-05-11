var path = require('path'),
    extend = require('util-extend'),
    package = require(__dirname + '/../package.json');

var VERSION = package.version;

var Debug = require('./debug/debug');
var File = require('./file/file');
var Parser = require('./parser/parser');
var Generator = require('./generator/generator');

/**
 * FrontNote
 * @param target {string|array} 解析するファイルのminimatch形式文字列またはminimatch形式文字列が入った配列
 * @param option {object} オプション
 * @param callback {callback} 全ての処理が正常に終了したときに実行するコールバック関数
 * @constructor
 */
function FrontNote(option) {
    this.options = extend({},FrontNote.DEFAULT_OPTIONS);
    this.options = extend(this.options,option);
    this.options.out = path.resolve(this.options.out);
    this.Parser = new Parser();
    if (this.options.verbose) {
        Debug.echo('Start','FrontNote - ' + VERSION,'green');
    }
}
FrontNote.noop = function() {};
FrontNote.DEFAULT_OPTIONS = {
    overview: __dirname + '/../styleguide.md',
    template: __dirname + '/../template/index.ejs',
    includeAssetPath: 'assets/**/*',
    css: './style.css',
    script: null,
    out: './guide',
    title: 'StyleGuide',
    verbose: false,
    clean: false,
    cache: true
};
FrontNote.prototype = {
    render: function(target,callback) {
        var note = this;
        File.globArrayConcat(target, function(err,files) {
            // 外部ファイルを１つずつ読み込み
            if (err) throw new Error('File.globArrayConcat',err);
            File.getAllFiles(files, function(err,data) {
                if (err) throw new File.getAllFiles('File.globArrayConcat',err);
                var parsedFiles = note.parseFiles(data);
                note.createStyleGuide(parsedFiles,callback);
            });
        });
    },
    parseFiles: function(files) {
        var data = [];
        for (var i = 0, len = files.length; i < len; i++) {
            var fileData = files[i];
            if (this.options.verbose) {
                Debug.echo('Read',fileData.file);
            }
            var value = this.Parser.parse(fileData.file,fileData.content,(this.options.cache && !this.options.clean));
            if (value) {
                data.push(value);
            }
        }
        return data;
    },
    /**
     * スタイルガイド作成
     * @param data
     */
    createStyleGuide: function(data,callback) {
        var options = this.options;
        var gen = new Generator(data,options);
        gen.generate(function() {
            if (options.verbose) {
                Debug.echo('Finish', 'FrontNote - (c)copyright frontainer.com All rights reserved.', 'green');
            }
            callback();
        });
    }
};

// プラグイン関数をエクスポート
module.exports = FrontNote;