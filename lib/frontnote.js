'use strict';
const path = require('path'),
    extend = require('extend'),
    Rx = require('rxjs'),
    glob = require('glob'),
    fs = require('fs-extra');

const Debug = require('./debug/debug');
const Parser = require('./parser/parser');
const Generator = require('./generator/generator');
const DEFAULT_OPTIONS = require('./const/options');

/**
 * FrontNote
 * @param target {string|array} 解析するファイルのminimatch形式文字列またはminimatch形式文字列が入った配列
 * @param option {object} オプション
 * @param callback {callback} 全ての処理が正常に終了したときに実行するコールバック関数
 * @constructor
 */
class FrontNote {
    constructor(option) {
        this.options = extend({},DEFAULT_OPTIONS,option);
        this.options.out = path.resolve(this.options.out);
        this.Parser = new Parser();
    }
    render(target) {
        let list = glob.sync(target);
        return this.readFiles(list).map((files) => {
            return this.parseFiles(files);
        }).flatMap((parsedFiles) => {
            return this.createStyleGuide(parsedFiles);
        });
    }
    readFiles(fileList) {
        const observers = fileList.map((filepath) => {
            const readFileAsObservable = Rx.Observable.bindNodeCallback(fs.readFile);
            return readFileAsObservable(filepath, 'utf8').map((data) => {
                return {
                    file: filepath,
                    content: data
                };
            });
        });
        if (observers.length === 0) {
            return Rx.Observable.create(observer => {
                observer.next([]);
            });
        }
        return Rx.Observable.combineLatest(observers);
    }
    parseFiles(files) {
        return files.map((fileData) => {
            if (this.options.verbose) {
                Debug.echo('Read',fileData.file);
            }
            const value = this.Parser.parse(fileData.file,fileData.content);
            if (value) {
                return value;
            }
        }).filter((v) => {
            return (v !== undefined);
        });
    }
    /**
     * スタイルガイド作成
     * @param data
     */
    createStyleGuide(data) {
        return Rx.Observable.create(observer => {
            const gen = new Generator(data,this.options);
            gen.generate().subscribe(result => {
                if (this.options.verbose) {
                    Debug.echo('Finish', 'FrontNote - (c)copyright frontainer.com All rights reserved.', 'green');
                }
                observer.next(result);
            });
        });
    }
}

// プラグイン関数をエクスポート
module.exports = FrontNote;