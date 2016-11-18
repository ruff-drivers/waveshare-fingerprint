/*!
 * Copyright (c) 2016 Nanchao Inc.
 * All rights reserved.
 */

'use strict';

var assert = require('assert');
var mock = require('ruff-mock');

var when = mock.when;
var any = mock.any;

require('t');

var constant = require('../src/constant');
var DELIMITER = constant.DELIMITER;
var Ack = constant.Ack;

var communication = mock();
var commands = require('../src/commands')(communication);
var util = require('../src/util');
var checksum = util.checksum;
var buildTimeoutString = util.buildTimeoutString;

communication.parseData = function (data, responseParser) {
    var responseRes = responseParser(data);
    if (responseRes.index[1] === 0) {
        return null;
    }
    return responseRes.valid;
};

describe('Test for `commands` module', function () {
    it('should get expected result when invoke command `getUserCount`', function (done) {
        var data0 = [0x09, 0x00, 0x00, 0x00, 0x00];
        var expectedRequestData = new Buffer(
            [DELIMITER]
                .concat(data0)
                .concat(checksum(data0))
                .concat(DELIMITER)
        );
        var data1 = [0x09, 0x10, 0x01, Ack.SUCCESS, 0x00];
        var expectedResponseData = new Buffer(
            [DELIMITER]
                .concat(data1)
                .concat(checksum(data1))
                .concat(DELIMITER)
        );

        when(communication).pushCmd(any, Function).then(function (cmdOptions, callback) {
            assert.deepEqual(cmdOptions.requestData, expectedRequestData);
            var validData = communication.parseData(expectedResponseData, cmdOptions.parseResponse);
            callback(undefined, validData);
        });

        commands.getUserCount(function (error, count) {
            if (error) {
                done(error);
                return;
            }
            assert.equal(count, 0x1001);
            done();
        });
    });

    it('should get timeout error when invoke command `getUserCount`', function (done) {
        when(communication).pushCmd(any, Function).then(function (cmdOptions, callback) {
            callback(new Error('timeout'));
        });

        commands.getUserCount(function (error) {
            if (error) {
                assert.equal(error.message, buildTimeoutString('getUserCount'));
                done();
                return;
            }
            done();
        });
    });

    it('should get expected result when invoke command `deleteAllUsers`', function (done) {
        var data0 = [0x05, 0x00, 0x00, 0x00, 0x00];
        var expectedRequestData = new Buffer(
            [DELIMITER]
                .concat(data0)
                .concat(checksum(data0))
                .concat(DELIMITER)
        );
        var data1 = [0x05, 0x00, 0x00, Ack.SUCCESS, 0x00];
        var expectedResponseData = new Buffer(
            [DELIMITER]
                .concat(data1)
                .concat(checksum(data1))
                .concat(DELIMITER)
        );

        when(communication).pushCmd(any, Function).then(function (cmdOptions, callback) {
            assert.deepEqual(cmdOptions.requestData, expectedRequestData);
            var validData = communication.parseData(expectedResponseData, cmdOptions.parseResponse);
            callback(undefined, validData);
        });

        commands.deleteAllUsers(function (error) {
            if (error) {
                done(error);
                return;
            }
            done();
        });
    });

    it('should get expected result when invoke command `deleteUser`', function (done) {
        var data0 = [0x04, 0x10, 0x01, 0x00, 0x00];
        var expectedRequestData = new Buffer(
            [DELIMITER]
                .concat(data0)
                .concat(checksum(data0))
                .concat(DELIMITER)
        );
        var data1 = [0x04, 0x00, 0x00, Ack.SUCCESS, 0x00];
        var expectedResponseData = new Buffer(
            [DELIMITER]
                .concat(data1)
                .concat(checksum(data1))
                .concat(DELIMITER)
        );

        when(communication).pushCmd(any, Function).then(function (cmdOptions, callback) {
            assert.deepEqual(cmdOptions.requestData, expectedRequestData);
            var validData = communication.parseData(expectedResponseData, cmdOptions.parseResponse);
            callback(undefined, validData);
        });

        commands.deleteUser(0x1001, function (error) {
            if (error) {
                done(error);
                return;
            }
            done();
        });
    });

    it('should get expected result when invoke command `addUser`', function (done) {
        var data0First = [0x01, 0x10, 0x01, 0x01, 0x00];
        var expectedRequestDataFirst = new Buffer(
            [DELIMITER]
                .concat(data0First)
                .concat(checksum(data0First))
                .concat(DELIMITER)
        );
        var data1First = [0x01, 0x00, 0x00, Ack.SUCCESS, 0x00];
        var expectedResponseDataFirst = new Buffer(
            [DELIMITER]
                .concat(data1First)
                .concat(checksum(data1First))
                .concat(DELIMITER)
        );
        when(communication).pushCmd(any, Function).then(function (cmdOptions, callback) {
            assert.deepEqual(cmdOptions.requestData, expectedRequestDataFirst);
            var validData = communication.parseData(expectedResponseDataFirst, cmdOptions.parseResponse);
            callback(undefined, validData);
        });

        var data0Second = [0x02, 0x10, 0x01, 0x01, 0x00];
        var expectedRequestDataSecond = new Buffer(
            [DELIMITER]
                .concat(data0Second)
                .concat(checksum(data0Second))
                .concat(DELIMITER)
        );
        var data1Second = [0x02, 0x00, 0x00, Ack.SUCCESS, 0x00];
        var expectedResponseDataSecond = new Buffer(
            [DELIMITER]
                .concat(data1Second)
                .concat(checksum(data1Second))
                .concat(DELIMITER)
        );
        when(communication).pushCmd(any, Function).then(function (cmdOptions, callback) {
            assert.deepEqual(cmdOptions.requestData, expectedRequestDataSecond);
            var validData = communication.parseData(expectedResponseDataSecond, cmdOptions.parseResponse);
            callback(undefined, validData);
        });

        var data0Third = [0x03, 0x10, 0x01, 0x01, 0x00];
        var expectedRequestDataThird = new Buffer(
            [DELIMITER]
                .concat(data0Third)
                .concat(checksum(data0Third))
                .concat(DELIMITER)
        );
        var data1Third = [0x03, 0x00, 0x00, Ack.SUCCESS, 0x00];
        var expectedResponseDataThird = new Buffer(
            [DELIMITER]
                .concat(data1Third)
                .concat(checksum(data1Third))
                .concat(DELIMITER)
        );
        when(communication).pushCmd(any, Function).then(function (cmdOptions, callback) {
            assert.deepEqual(cmdOptions.requestData, expectedRequestDataThird);
            var validData = communication.parseData(expectedResponseDataThird, cmdOptions.parseResponse);
            callback(undefined, validData);
        });

        commands.addUser(0x1001, 1, function (error) {
            if (error) {
                done(error);
                return;
            }
            done();
        });
    });

    it('should get expected result when invoke command `scanUser`', function (done) {
        var data0 = [0x0C, 0x00, 0x00, 0x00, 0x00];
        var expectedRequestData = new Buffer(
            [DELIMITER]
                .concat(data0)
                .concat(checksum(data0))
                .concat(DELIMITER)
        );
        var data1 = [0x0C, 0x10, 0x01, 0x01, 0x00];
        var expectedResponseData = new Buffer(
            [DELIMITER]
                .concat(data1)
                .concat(checksum(data1))
                .concat(DELIMITER)
        );

        when(communication).pushCmd(any, Function).then(function (cmdOptions, callback) {
            assert.deepEqual(cmdOptions.requestData, expectedRequestData);
            var validData = communication.parseData(expectedResponseData, cmdOptions.parseResponse);
            callback(undefined, validData);
        });

        commands.scanUser(function (error, user) {
            if (error) {
                done(error);
                return;
            }
            assert.equal(user.id, 0x1001);
            assert.equal(user.privilege, 1);
            done();
        });
    });

    it('should get expected result when invoke command `getScanTimeout`', function (done) {
        var data0 = [0x2E, 0x00, 0x00, 0x01, 0x00];
        var expectedRequestData = new Buffer(
            [DELIMITER]
                .concat(data0)
                .concat(checksum(data0))
                .concat(DELIMITER)
        );
        var data1 = [0x2E, 0x00, 0xFF, Ack.SUCCESS, 0x00];
        var expectedResponseData = new Buffer(
            [DELIMITER]
                .concat(data1)
                .concat(checksum(data1))
                .concat(DELIMITER)
        );

        when(communication).pushCmd(any, Function).then(function (cmdOptions, callback) {
            assert.deepEqual(cmdOptions.requestData, expectedRequestData);
            var validData = communication.parseData(expectedResponseData, cmdOptions.parseResponse);
            callback(undefined, validData);
        });

        commands.getScanTimeout(function (error, timeout) {
            if (error) {
                done(error);
                return;
            }
            assert.equal(timeout, 200 * 0xFF);
            done();
        });
    });

    it('should get expected result when invoke command `setScanTimeout`', function (done) {
        var data0 = [0x2E, 0x00, 0x01, 0x00, 0x00];
        var expectedRequestData = new Buffer(
            [DELIMITER]
                .concat(data0)
                .concat(checksum(data0))
                .concat(DELIMITER)
        );
        var data1 = [0x2E, 0x00, 0x00, Ack.SUCCESS, 0x00];
        var expectedResponseData = new Buffer(
            [DELIMITER]
                .concat(data1)
                .concat(checksum(data1))
                .concat(DELIMITER)
        );

        when(communication).pushCmd(any, Function).then(function (cmdOptions, callback) {
            assert.deepEqual(cmdOptions.requestData, expectedRequestData);
            var validData = communication.parseData(expectedResponseData, cmdOptions.parseResponse);
            callback(undefined, validData);
        });

        commands.setScanTimeout(200, function (error) {
            if (error) {
                done(error);
                return;
            }
            done();
        });
    });

    it('should get expected result when invoke command `getComparisonLevel`', function (done) {
        var data0 = [0x28, 0x00, 0x00, 0x01, 0x00];
        var expectedRequestData = new Buffer(
            [DELIMITER]
                .concat(data0)
                .concat(checksum(data0))
                .concat(DELIMITER)
        );
        var data1 = [0x28, 0x00, 0x05, Ack.SUCCESS, 0x00];
        var expectedResponseData = new Buffer(
            [DELIMITER]
                .concat(data1)
                .concat(checksum(data1))
                .concat(DELIMITER)
        );

        when(communication).pushCmd(any, Function).then(function (cmdOptions, callback) {
            assert.deepEqual(cmdOptions.requestData, expectedRequestData);
            var validData = communication.parseData(expectedResponseData, cmdOptions.parseResponse);
            callback(undefined, validData);
        });

        commands.getComparisonLevel(function (error, level) {
            if (error) {
                done(error);
                return;
            }
            assert.equal(level, 5);
            done();
        });
    });

    it('should get expected result when invoke command `setComparisonLevel`', function (done) {
        var data0 = [0x28, 0x00, 0x05, 0x00, 0x00];
        var expectedRequestData = new Buffer(
            [DELIMITER]
                .concat(data0)
                .concat(checksum(data0))
                .concat(DELIMITER)
        );
        var data1 = [0x28, 0x00, 0x05, Ack.SUCCESS, 0x00];
        var expectedResponseData = new Buffer(
            [DELIMITER]
                .concat(data1)
                .concat(checksum(data1))
                .concat(DELIMITER)
        );

        when(communication).pushCmd(any, Function).then(function (cmdOptions, callback) {
            assert.deepEqual(cmdOptions.requestData, expectedRequestData);
            var validData = communication.parseData(expectedResponseData, cmdOptions.parseResponse);
            callback(undefined, validData);
        });

        commands.setComparisonLevel(5, function (error) {
            if (error) {
                done(error);
                return;
            }
            done();
        });
    });
});
