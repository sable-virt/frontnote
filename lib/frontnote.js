'use strict';
const path = require('path'),
    extend = require('extend'),
    Rx = require('rxjs'),
    glob = require('glob'),
    ora = require('ora'),
    chalk = require('chalk'),
    fs = require('fs-extra');

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

    /**
     * render styleguide
     * @param target{String|Array}
     * @returns {Observable<T>}
     */
    render(target) {
        const spinner = ora('Loading files...').start();
        let list = typeof target === 'string' ? glob.sync(target) : target.reduce((previous,current) => {
            return previous.concat(glob.sync(current));
        },[]);
        let obs = this.readFiles(list).map((files) => {
            spinner.text = 'Parsing files...';
            return this.parseFiles(files);
        }).flatMap((parsedFiles) => {
            spinner.text = 'Generating StyleGuide...';
            return this.createStyleGuide(parsedFiles);
        }).share();
        obs.take(1).subscribe((result) => {
            if (this.options.verbose) {
                result.forEach((filepath) => {
                    console.log(chalk.green(`[w] ${filepath}`));
                });
            }
            spinner.text = 'Generated StyleGuide';
            spinner.succeed();
        });
        return obs;
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
                let cwd = process.cwd();
                result = Array.prototype.concat.apply([],result).filter((v) => {
                    return (v);
                }).map((v) => {
                    return path.relative(cwd,v);
                });
                observer.next(result);
            },(e) => {
                observer.error(e);
            });
        });
    }
}

// プラグイン関数をエクスポート
module.exports = FrontNote;