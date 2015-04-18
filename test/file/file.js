var assert = require('power-assert');
var File = require('../../lib/file/file');

var emptyText = '// empty\n.test {\n    font-size: 14px;\n}';
var sampleText = '/*\n#overview\ntitle\n\noverview comment\n*/\n\n/*\n#styleguide\nstyle title\n\nstyle comment.\n\n@depulicated\n@非推奨\n@todo\n@your-attribute\n\n```\nsample code here.\n```\n*/\n\n/*\n#colors\n\n@primary #996600\n@secondary #333\n@color-name color-code\n*/';


module.exports = function() {
    describe('File', function() {
        var files = ["test/sass/empty.scss","test/sass/sample.scss"];
        beforeEach(function() {

        });
        it('globArrayConcat', function(done) {
            File.globArrayConcat('test/sass/*.scss',function(err,result) {
                assert.deepEqual(result,files);
                done();
            });
        });
        it('globArrayConcat with array', function(done) {
            File.globArrayConcat(['test/sass/empty.scss','test/sass/sample.scss'],function(err,result) {
                assert.deepEqual(result,files);
                done();
            });
        });
        it('getAllFiles', function(done) {
            File.getAllFiles(files,function(err,result) {
                assert(result.length === 2);
                assert(result[0].content === emptyText);
                assert(result[1].content === sampleText);
                done();
            });
        });
    });
};