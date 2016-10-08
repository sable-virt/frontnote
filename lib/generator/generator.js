'use strict';
const Rx = require('rxjs');
const fs = require('fs-extra');
const cpx = require('cpx');
const path = require('path');
const md = require("marked");
const Render = require('../render/render');
const helpers = require('../helper/template-helper');
class Generator {
    constructor(data, options) {
        this.data = data;
        this.options = options;
        this.Render = new Render();
    }

    generate() {
        return this.cleanOutputDir()
            .flatMap(() => {
                return this.readFile(this.options.template);
            }).flatMap((tmpl) => {
                return Rx.Observable.combineLatest(
                    this.writeOverview(tmpl),
                    this.writePages(tmpl),
                    this.copyOtherFiles()
                );
            });
    }

    cleanOutputDir() {
        return Rx.Observable.create(observer => {
            if (!this.options.clean) return observer.next();
            fs.remove(this.options.out, () => {
                observer.next();
            });
        });
    }

    readFile(filepath) {
        const readFileAsObservable = Rx.Observable.bindNodeCallback(fs.readFile);
        return readFileAsObservable(filepath, 'utf8');
    }
    writeFile(filepath,content) {
        const writeFileAsObservable = Rx.Observable.bindNodeCallback(fs.outputFile);
        return writeFileAsObservable(filepath, content).map(() => {
            return filepath;
        });
    }
    copyFile(from,to) {
        const copyFileAsObservable = Rx.Observable.bindNodeCallback(cpx.copy);
        return copyFileAsObservable(from, to).map(() => {
            return to;
        });
    }

    writeOverview(tmpl) {
        //styleguide.mdを読み込み
        return this.readFile(this.options.overview)
            .flatMap((file) => {
                const outputPath = this.options.out + '/index.html';
                const rendered = this.Render.render(tmpl, {
                    title: this.options.title,
                    current: md.parse(file),
                    files: this.data,
                    overview: true,
                    helpers: helpers,
                    css: this.Render.generateIncludeCss(this.options.css),
                    script: this.Render.generateIncludeScript(this.options.script),
                    params: this.options.params || {}
                });
                return this.writeFile(outputPath, rendered);
            });
    }

    writePages(tmpl) {
        let observers = this.data.map((section) => {
            const outputPath = this.options.out + '/' + section.url;
            const rendered = this.Render.render(tmpl, {
                title: this.options.title,
                current: section,
                files: this.data,
                overview: false,
                helpers: helpers,
                css: this.Render.generateIncludeCss(this.options.css),
                script: this.Render.generateIncludeScript(this.options.script),
                params: this.options.params || {}
            });
            return this.writeFile(outputPath, rendered);
        });
        if (observers.length === 0) {
            return Rx.Observable.create(observer => {
                observer.next();
            });
        }
        return Rx.Observable.combineLatest(observers);
    }

    copyOtherFiles() {
        if (!this.options.includeAssetPath) {
            return Rx.Observable.create(observer => {
                observer.next([]);
            });
        }
        let assets = typeof this.options.includeAssetPath === 'string' ? [this.options.includeAssetPath] : this.options.includeAssetPath;

        assets = assets.map((asset) => {
            return this.copyFile(asset,path.join(this.options.out,'assets'));
        });
        return Rx.Observable.combineLatest(assets);
    }
}
module.exports = Generator;