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
require('./const/pattern')();
require('./file/file')();
require('./parser/parser')();
require('./helper/template-helper')();
require('./render/render')();
require('./debug/debug')();

describe('frontnote', function() {
    var frontnote;
    beforeEach(function() {
        frontnote = new FrontNote({clean:true});
    });
    it('init', function() {
        assert.deepEqual(frontnote.options,{
            overview: process.cwd() + '/lib/../styleguide.md',
            template: process.cwd() + '/lib/../template/index.html',
            includeAssetPath: 'assets/**/*',
            css: './style.css',
            script: null,
            out: process.cwd() + '/guide',
            title: 'StyleGuide',
            verbose: false,
            clean: true,
            cache: true
        });
    });


    it('parseFilesExists', function(done) {
        frontnote.render('./test/sass/sample.scss',function() {
            for (var i = 0, len = files.length; i < len; i++) {
               assert(fs.existsSync(files[i]) === true);
            }
            done();
        });
    });

    it('verbose', function(done) {
        frontnote = new FrontNote({
            verbose: true,
            includeAssetPath: ['assets/**/*']
        });
        frontnote.render('./test/sass/sample2.scss',function() {
            for (var i = 0, len = files.length; i < len; i++) {
                assert(fs.existsSync(files[i]) === true);
            }
            done();
        });
    });

    it('no asset path', function(done) {
        frontnote = new FrontNote({
            includeAssetPath: null
        });
        frontnote.render('./test/sass/sample2.scss',function() {
            for (var i = 0, len = files.length; i < len; i++) {
                assert(fs.existsSync(files[i]) === true);
            }
            done();
        });
    });
});