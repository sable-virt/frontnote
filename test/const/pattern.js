var assert = require('power-assert');

module.exports = function() {
    describe('Pattern', function() {
        var Pattern = require('../../lib/const/pattern');
        it('comment', function() {
            assert('/*#styleguide*/'.search(Pattern.comment) !== -1);
            assert('/**#styleguide**/'.search(Pattern.comment) !== -1);
            assert('/** #styleguide **/'.search(Pattern.comment) !== -1);
            assert('/**\n#styleguide\n**/'.search(Pattern.comment) !== -1);
        });
        it('overview', function() {
            assert('/*#overview*/'.search(Pattern.overview) !== -1);
            assert('/**#overview**/'.search(Pattern.overview) !== -1);
            assert('/** #overview **/'.search(Pattern.overview) !== -1);
            assert('/**\n#overview\n**/'.search(Pattern.overview) !== -1);
        });

        it('colors', function() {
            assert('/*#colors*/'.search(Pattern.colors) !== -1);
            assert('/**#colors**/'.search(Pattern.colors) !== -1);
            assert('/** #colors **/'.search(Pattern.colors) !== -1);
            assert('/**\n#colors\n**/'.search(Pattern.colors) !== -1);
        });

        it('color', function() {
            assert('@primary #996600'.search(Pattern.color) !== -1);
            assert('@primary    #996600'.search(Pattern.color) !== -1);
            assert('@primary   #996600'.search(Pattern.color) !== -1);
            assert(' @primary #996600'.search(Pattern.color) !== -1);
        });

        it('spliltter', function() {
            assert('test\ntest'.split(Pattern.splitter).length === 2);
            assert('test\n\ntest'.split(Pattern.splitter).length === 3);
            assert('\ntest\ntest'.split(Pattern.splitter).length === 3);
            assert('test'.split(Pattern.splitter).length === 1);
        });

        it('prefix', function() {
            assert('/*#styleguide*/'.replace(Pattern.prefix,'') === '');
            assert('/**#styleguide**/'.replace(Pattern.prefix,'') === '');
            assert('/** #styleguide **/'.replace(Pattern.prefix,'') === '');
            assert('/**\n#styleguide\n**/'.replace(Pattern.prefix,'') === '');
        });

        it('line', function() {
            assert(' '.search(Pattern.line) !== -1);
            assert('    '.search(Pattern.line) !== -1);
            assert('  \n   '.search(Pattern.line) !== -1);
            assert('  t  '.search(Pattern.line) === -1);
        });

        it('attr', function() {
            assert('@test'.search(Pattern.attr) !== -1);
            assert('test\n@attr'.search(Pattern.attr) !== -1);
            assert(' @test'.search(Pattern.attr) !== -1);
            assert('    @test'.search(Pattern.attr) !== -1);
            assert('test@test\ntest\naaa'.search(Pattern.attr) === -1);
        });

        it('attrPrefix', function() {
            assert('@test'.search(Pattern.attrPrefix) !== -1);
            assert(' @attr'.search(Pattern.attr) !== -1);
            assert('    @attr'.search(Pattern.attr) !== -1);
            assert(' test'.search(Pattern.attr) === -1);
        });

        it('code', function() {

        });

        it('codeWrapper', function() {

        });
    })
};