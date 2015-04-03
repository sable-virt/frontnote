var assert = require('power-assert');
var Helper = require('../../lib/helper/template-helper');

module.exports = function() {
    describe('template-helper', function() {
        it('isCurrent', function() {
            var same = Helper.isCurrent({
                file:'sample.scss'
            },{
                file:'sample.scss'
            });
            assert(same === true);
            var unsame = Helper.isCurrent({
                file:'sample.scss'
            },{
                file:'sample2.scss'
            });
            assert(unsame === false);
        });
        it ('hasAttribute', function() {
            var have = Helper.hasAttribute(['test'],'test');
            assert(have === true);

            var noHave = Helper.hasAttribute(['test'],'test2');
            assert(noHave === false);
        });
    });
};