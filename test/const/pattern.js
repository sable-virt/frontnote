var assert = require('power-assert');
var Pattern = require('../../lib/const/pattern');

module.exports = function() {
    describe('comment', function() {
        assert('/*#styleguide*/'.search(Pattern.comment) !== -1);
        assert('/**#styleguide**/'.search(Pattern.comment) !== -1);
        assert('/** #styleguide **/'.search(Pattern.comment) !== -1);
        assert('/**\n#styleguide\n**/'.search(Pattern.comment) !== -1);
    });
    describe('overview', function() {
        assert('/*#overview*/'.search(Pattern.overview) !== -1);
        assert('/**#overview**/'.search(Pattern.overview) !== -1);
        assert('/** #overview **/'.search(Pattern.overview) !== -1);
        assert('/**\n#overview\n**/'.search(Pattern.overview) !== -1);
    });

    describe('colors', function() {
        assert('/*#colors*/'.search(Pattern.colors) !== -1);
        assert('/**#colors**/'.search(Pattern.colors) !== -1);
        assert('/** #colors **/'.search(Pattern.colors) !== -1);
        assert('/**\n#colors\n**/'.search(Pattern.colors) !== -1);
    });

    describe('color', function() {
        assert('@primary #996600'.search(Pattern.color) !== -1);
        assert('@primary    #996600'.search(Pattern.color) !== -1);
        assert('@primary   #996600'.search(Pattern.color) !== -1);
        assert(' @primary #996600'.search(Pattern.color) !== -1);
    });

    describe('spliltter', function() {
        assert('test\ntest'.split(Pattern.splitter).length === 2);
        assert('test\n\ntest'.split(Pattern.splitter).length === 3);
        assert('\ntest\ntest'.split(Pattern.splitter).length === 3);
        assert('test'.split(Pattern.splitter).length === 1);
    });

    // [wip]
    //describe('prefix', function() {
    //    assert('/*#styleguide*/'.replace(Pattern.prefix,'') === '');
    //    assert('/**#styleguide**/'.replace(Pattern.prefix,'') === '');
    //    assert('/** #styleguide **/'.replace(Pattern.prefix,'') === '');
    //    assert('/**\n#styleguide\n**/'.replace(Pattern.prefix,'') === '');
    //});
};