var assert = require('power-assert');
var Parser = require('../../lib/parser/parser');

var sampleFile = '../test/sass/sample.scss';
var sampleText = '/*\n#styleguide\nstyle title\n\nstyle comment.\n\n@depulicated\n@非推奨\n@todo\n@your-attribute\n\n```\nsample code here.\n```\n*/\n\n/*\n#colors\n\n@primary #996600\n@secondary #333\n@color-name color-code\n*/';

module.exports = function() {
    describe('Parser', function() {
        var parser;
        beforeEach(function() {
            parser = new Parser();
        });
        it('parse', function(done) {
            var result = parser.parse(sampleFile,sampleText);
            assert(result.fileName === 'sample');
            assert(result.url === 'test-sass-sample.html');

            assert(result.ext === '.scss');
            assert.deepEqual(result.dirs,['..','test','sass','sample.scss']);

            assert(result.sections[0].title === 'style title');
            assert(result.sections[0].comment === 'style comment.');
            assert(result.sections[0].code === 'sample code here.\n');

            assert.deepEqual(result.sections[0].attributes, ["depulicated","非推奨","todo","your-attribute"]);

            assert(result.colors[0].name === 'primary');
            assert(result.colors[0].color === '#996600');

            assert(result.colors[1].name === 'secondary');
            assert(result.colors[1].color === '#333');
            //console.log(result.colors);
            done();
        });
    });
};