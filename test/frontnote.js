var assert = require('power-assert');
var FrontNote = require('../lib/frontnote');
var File = require('../lib/file/file');
var files = ["test/sass/sample.scss","test/sass/sample2.scss"];

require('./file/file')();
require('./parser/parser')();
require('./helper/template-helper')();
require('./render/render')();

describe('frontnote', function() {
    var frontnote;
    beforeEach(function() {
        frontnote = new FrontNote();
    });
    it('init', function() {
        assert.deepEqual(frontnote.options,{
            overview: process.cwd() + '/styleguide.md',
            template: process.cwd() + '/template/index.html',
            includeAssetPath: 'assets/**/*',
            css: './style.css',
            script: null,
            out: process.cwd() + '/guide',
            title: 'StyleGuide',
            verbose: false,
            clean: false,
            cache: true
        });
    });
});