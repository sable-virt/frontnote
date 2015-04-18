var assert = require('power-assert');
var Debug = require('../../lib/debug/debug');

module.exports = function() {
    describe('debug', function() {
        beforeEach(function() {

        });
        it('echo', function() {
            assert(Debug.echo('Label','debug messages...') === '[Label] debug messages...');
        });

        it('echo with color', function() {
            assert(Debug.echo('Label','yellow messages...','yellow') === '[Label] yellow messages...');
        });
    });
};