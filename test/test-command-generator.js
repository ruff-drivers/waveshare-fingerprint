/*!
 * Copyright (c) 2016 Nanchao Inc.
 * All rights reserved.
 */

'use strict';

var generateCommand = require('../src/command-generator');
var assert = require('assert');

require('t');

describe('Test for `command-generator` module', function () {
    it('should get expected data', function (done) {
        var expectedData = new Buffer([0xF5, 0x00, 0x01, 0x02, 0x03, 0x00, 0xF5]);
        var head = [0x00, 0x01, 0x02, 0x03];

        assert.deepEqual(generateCommand(head), expectedData);
        done();
    });
});
