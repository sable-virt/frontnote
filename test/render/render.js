var assert = require('power-assert');
var Render = require('../../lib/render/render');


module.exports = function() {
    describe('render', function() {
        var render;
        beforeEach(function() {
            render = new Render();
        });
        it('generateIncludeCss', function() {
            assert(render.generateIncludeCss('main.css'),'<link rel="stylesheet" href="main.css" />');
            var css = render.generateIncludeCss([
                'main.css',
                'style.css',
                'sub.css'
            ]);
            assert(css == '<link rel="stylesheet" href="main.css" />\n<link rel="stylesheet" href="style.css" />\n<link rel="stylesheet" href="sub.css" />');
        });
        it('generateIncludeScript', function() {
            assert(render.generateIncludeScript('main.js'),'<script src="main.js"></script>');
            var js = render.generateIncludeScript([
                'main.js',
                'style.js',
                'sub.js'
            ]);
            assert(js == '<script src="main.js"></script>\n<script src="style.js"></script>\n<script src="sub.js"></script>');
        });
    });
};