var assert = require('power-assert');
var File = require('../../lib/file/file');

var emptyText = '// empty\n.test {\n    font-size: 14px;\n}';
var sampleText = '/*\n#overview\ntitle\n\noverview comment\n*/\n\n/*\n#styleguide\nstyle title\n\nstyle comment.\n\n@depulicated\n@非推奨\n@todo\n@your-attribute\n\n```\nsample code here.\n```\n*/\n\n/*\n#colors\n\n@primary #996600\n@secondary #333\n@color-name color-code\n*/';
var sampleTextCR = '/*\r#overview\rtitle\r\roverview comment\r*/\r\r/*\r#styleguide\rstyle title\r\rstyle comment.\r\r@depulicated\r@非推奨\r@todo\r@your-attribute\r```\r\rsample code here.\r```\r*/\r\r/*\r#colors\r\r@primary #996600\r@secondary #333\r@color-name color-code\r*/';
var sampleTextCRCL = '/*\r\n#overview\r\ntitle\r\n\r\noverview comment\r\n*/\r\n\r\n/*\r\n#styleguide\r\nstyle title\r\n\r\nstyle comment.\r\n\r\n@depulicated\r\n@非推奨\r\n@todo\r\n@your-attribute\r\n```\r\n\r\nsample code here.\r\n```\r\n*/\r\n\r\n/*\r\n#colors\r\n\r\n@primary #996600\r\n@secondary #333\r\n@color-name color-code\r\n*/';

module.exports = function() {
    describe('File', function() {
        var files = ["test/sass/empty.scss","test/sass/sample-cr.scss","test/sass/sample-crlf.scss","test/sass/sample.scss"];
        beforeEach(function() {

        });
        it('globArrayConcat', function(done) {
            File.globArrayConcat('test/sass/*.scss',function(err,result) {
                assert.deepEqual(result,files);
                done();
            });
        });
        it('globArrayConcat with array', function(done) {
            File.globArrayConcat(['test/sass/empty.scss',"test/sass/sample-cr.scss","test/sass/sample-crlf.scss",'test/sass/sample.scss'],function(err,result) {
                assert.deepEqual(result,files);
                done();
            });
        });
        it('getAllFiles', function(done) {
            File.getAllFiles(files,function(err,result) {
                assert(result.length === 4);
                assert(result[0].content === emptyText);
                assert(result[1].content === sampleTextCR);
                assert(result[2].content === sampleTextCRCL);
                assert(result[3].content === sampleText);
                done();
            });
        });
    });
};