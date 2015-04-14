var async = require('async'),
    glob = require('glob'),
    path = require('path'),
    fs = require('fs-extra');

var FILE = {
    /**
     * globパターン文字列または配列からファイルパスの配列を生成
     * @param arr{string|array}
     * @param callback
     */
    globArrayConcat: function (arr, callback) {
        var result = [];
        if (arr instanceof Array === false) {
            arr = [arr];
        }
        async.each(arr, function (pattern, next) {
            glob(pattern, function (err, files) {
                if (err) throw err;
                result = result.concat(files);
                next();
            });
        }, function (err) {
            callback(err,result);
        });
    },
    getAllFiles: function(files,callback) {
        var data = [];
        async.forEachSeries(files, function(file, cb) {
            fs.readFile(file, 'utf8',function (err, res) {
                if (err) throw(err);
                data.push({
                    file: file,
                    content: res
                });
                cb();
            });
        }, function (err) {
            callback(err,data);
        });
    },
    copyAllFiles: function(files,templateDir,outputDir,callback) {
        async.each(files,function(file,next) {
            // ファイル情報取得
            fs.stat(file, function(err,stats) {
                if(err) throw(err);
                //ファイル以外（ディレクトリ）だったら無視して次へ
                if (!stats.isFile()) {
                    next();
                } else {
                    // テンプレートディレクトリからの相対パスでincludeファイルを参照
                    var relPath = path.relative(path.dirname(templateDir),file);
                    //コピー開始
                    fs.copy(file, outputDir + '/' + relPath, function(err){
                        if (err) throw(err);
                        next();
                    });
                }
            });
        },function() {
            callback();
        });
    },
    getFiles: function(pattern,callback) {
        glob(pattern, function(err,files) {
            callback(err,files);
        });
    },
    writeFile: function(path,content,callback) {
        fs.outputFile(path, content, function (err) {
            callback(err);
        });
    },
    clean: function(path,callback) {
        fs.remove(path,callback);
    },
    load: function(path,callback) {
        fs.readFile(path, 'utf8',function (err, res) {
            callback(err,res);
        });
    }
};
module.exports = FILE;