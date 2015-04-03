var assert = require('power-assert');
var File = require('../../lib/file/file');

var sampleText = '/*\n#styleguide\nstyle title\n\nstyle comment.\n\n@depulicated\n@非推奨\n@todo\n@your-attribute\n\n```\nsample code here.\n```\n*/\n\n/*\n#colors\n\n@primary #996600\n@secondary #333\n@color-name color-code\n*/';

module.exports = function() {
    describe('File', function() {
        var files = ["test/sass/sample.scss","test/sass/sample2.scss"];
        beforeEach(function() {

        });
        it('globArrayConcat', function(done) {
            File.globArrayConcat('test/sass/*.scss',function(err,result) {
                assert.deepEqual(result,files);
                done();
            });
        });
        it('getAllFiles', function(done) {
            File.getAllFiles(files,function(err,result) {
                assert(result.length === 2);
                assert(result[0].content === sampleText);
                done();
            });
        });
    });
};