var assert = require('power-assert');
var fs = require('fs');

var FrontNote = require('../lib/frontnote');
var File = require('../lib/file/file');
var files = [
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
var noAssertFiles = [
    './guide/index.html',
    './guide/test-sass-sample.html'
];
require('./const/pattern')();
require('./file/file')();
require('./parser/parser')();
require('./helper/template-helper')();
require('./render/render')();
require('./debug/debug')();

describe('frontnote', function() {
    var frontnote;
    beforeEach(function() {
        frontnote = new FrontNote();
    });
    it('init', function() {
        assert.deepEqual(frontnote.options,{
            overview: process.cwd() + '/lib/../styleguide.md',
            template: process.cwd() + '/lib/../template/index.ejs',
            includeAssetPath: 'assets/**/*',
            css: './style.css',
            script: null,
            out: process.cwd() + '/guide',
            title: 'StyleGuide',
            verbose: false,
            clean: false,
            cache: true
        });
        assert(typeof FrontNote.noop === 'function');
        assert(FrontNote.noop() === undefined);
    });

    it('default render', function(done) {
        frontnote.render('./test/sass/*.scss',function() {
            for (var i = 0, len = files.length; i < len; i++) {
                assert(fs.existsSync(files[i]));
            }
            done();
        });
    });

    it('cache render', function(done) {
        frontnote.render('./test/sass/*.scss',function() {
            for (var i = 0, len = files.length; i < len; i++) {
                assert(fs.existsSync(files[i]));
            }
            done();
        });
    });

    it('verbose & clean & array asset path', function(done) {
        frontnote = new FrontNote({
            clean: true,
            verbose: true,
            includeAssetPath: ['assets/**/*']
        });
        frontnote.render('./test/sass/*.scss',function() {
            for (var i = 0, len = files.length; i < len; i++) {
                assert(fs.existsSync(files[i]));
            }
            done();
        });
    });

    it('no asset path', function(done) {
        frontnote = new FrontNote({
            clean: true,
            includeAssetPath: null
        });
        frontnote.render('./test/sass/*.scss',function() {
            for (var i = 0, len = noAssertFiles.length; i < len; i++) {
                assert(fs.existsSync(files[i]) === true);
            }
            done();
        });
    });

    it('render with overview', function(done) {
        frontnote = new FrontNote({
            clean: true,
            overview: './test/sass/overview.md'
        });
        frontnote.render('./test/sass/*.scss',function() {
            for (var i = 0, len = files.length; i < len; i++) {
                assert(fs.existsSync(files[i]) === true);
            }
            done();
        });
    });
});