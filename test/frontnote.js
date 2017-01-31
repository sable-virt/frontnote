'use strict';

const assert = require('power-assert');
const fs = require('fs-extra');

const FrontNote = require('../lib/frontnote');
const files = [
    './guide/index.html',
    './guide/test-sass-sample.html',
    './guide/assets/js/main.js',
    './guide/assets/js/ripple-effect.js',
    './guide/assets/css/style.css',
    './guide/assets/fonts/fontawesome-webfont.ttf',
    './guide/assets/fonts/fontawesome-webfont.eot',
    './guide/assets/fonts/FontAwesome.otf',
    './guide/assets/fonts/fontawesome-webfont.svg',
    './guide/assets/fonts/fontawesome-webfont.woff',
    './guide/assets/images/favicon.ico',
    './guide/assets/images/frontnote.png',
    './guide/assets/lib/highlight.pack.js',
    './guide/assets/lib/jquery.js',
    './guide/assets/lib/jquery.mousewheel.js'
];
const noAssertFiles = [
    './guide/index.html',
    './guide/test-sass-sample.html'
];
require('./const/pattern')();
require('./parser/parser')();
require('./helper/template-helper')();
require('./render/render')();

describe('frontnote', function () {
    let frontnote;
    beforeEach(function () {
        frontnote = new FrontNote();
    });
    afterEach(function () {
        fs.remove('./guide');
    });
    it('init', function () {
        assert.deepEqual(frontnote.options, {
            overview: process.cwd() + '/lib/const/../../styleguide.md',
            template: process.cwd() + '/lib/const/../../template/index.ejs',
            includeAssetPath: process.cwd() + '/lib/const/../../template/assets/**/*',
            css: './style.css',
            script: null,
            out: process.cwd() + '/guide',
            title: 'StyleGuide',
            verbose: false,
            clean: false,
            params: {}
        });
    });

    it('default render', function (done) {
        frontnote.render('./test/sass/*.scss').subscribe(() => {
            for (var i = 0, len = files.length; i < len; i++) {
                assert(fs.existsSync(files[i]));
            }
            done();
        });
    });

    it('cache render', function (done) {
        frontnote.render('./test/sass/*.scss').subscribe(() => {
            for (var i = 0, len = files.length; i < len; i++) {
                assert(fs.existsSync(files[i]));
            }
            done();
        });
    });

    it('verbose & clean & array asset path', function (done) {
        frontnote = new FrontNote({
            clean: true,
            verbose: true,
            includeAssetPath: ['template/assets/**/*']
        });
        frontnote.render('./test/sass/*.scss').subscribe(() => {
            for (var i = 0, len = files.length; i < len; i++) {
                assert(fs.existsSync(files[i]));
            }
            done();
        });
    });

    it('no asset path', function (done) {
        frontnote = new FrontNote({
            clean: true,
            includeAssetPath: null
        });
        frontnote.render('./test/sass/*.scss').subscribe(() => {
            for (var i = 0, len = noAssertFiles.length; i < len; i++) {
                assert(fs.existsSync(files[i]) === true);
            }
            done();
        });
    });

    it('render with overview', function (done) {
        frontnote = new FrontNote({
            clean: true,
            overview: './test/sass/overview.md'
        });
        frontnote.render('./test/sass/*.scss').subscribe(() => {
            for (var i = 0, len = files.length; i < len; i++) {
                assert(fs.existsSync(files[i]) === true);
            }
            done();
        });
    });

    it('no src', function (done) {
        frontnote = new FrontNote({
            clean: true,
            includeAssetPath: null
        });
        frontnote.render('./none/*.scss').subscribe(() => {
            done();
        });
    });

    it('multiple entrypoint', function (done) {
        frontnote = new FrontNote({
            clean: true,
            includeAssetPath: null
        });
        frontnote.render(['./test/sass/partial/**/*.scss', './test/sass/*.scss']).subscribe(() => {
            done();
        });
    });
});