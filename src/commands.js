/*!
 * Copyright (c) 2016 Nanchao Inc.
 * All rights reserved.
 */

'use strict';

var generateCommand = require('./command-generator');
var constant = require('./constant');
var Ack = constant.Ack;
var util = require('./util');
var parseShort = util.parseShort;
var buildTimeoutString = util.buildTimeoutString;
var buildAckString = util.buildAckString;

function createCommands(communication) {
    var commands = Object.create(null);

    commands.getUserCount = function (callback) {
        var cmdBuffer = generateCommand([0x09, 0x00, 0x00, 0x00, 0x00]);

        communication.pushCmd({
            requestData: cmdBuffer,
            responseTimeout: 3000,
            parseResponse: basicParseResponseWithData.bind(undefined, 0x09, 'count')
        }, function (error, result) {
            if (error) {
                callback(new Error(buildTimeoutString('getUserCount')));
                return;
            }
            if (result.ackResult !== 'success') {
                callback(new Error(buildAckString('getUserCount', result.ackResult)));
                return;
            }
            callback(undefined, result.count);
        });
    };

    commands.getAllUsers = function (callback) {
        var cmdBuffer = generateCommand([0x2B, 0x00, 0x00, 0x00, 0x00]);
        var thisObj = Object.create(null);
        thisObj.expectedLength = 8;
        thisObj.stage = 1;
        thisObj.dataLength = 0;
        thisObj.users = Object.create(null);

        communication.pushCmd({
            requestData: cmdBuffer,
            responseTimeout: 3000,
            parseResponse: parseResponse.bind(thisObj, 0x2B)
        }, function (error, result) {
            if (error) {
                callback(new Error(buildTimeoutString('getAllUsers')));
                return;
            }
            if (result.ackResult !== 'success') {
                callback(new Error(buildAckString('getAllUsers', result.ackResult)));
                return;
            }
            callback(undefined, result.users);
        });

        function parseResponse(cmdId, buffer) {
            var invalidResult = {
                index: [-1, 0],
                valid: null
            };
            if (buffer.length < this.expectedLength) {
                return invalidResult;
            }
            if (this.stage === 1) {
                if (buffer[1] !== cmdId) {
                    return {
                        index: [0, this.expectedLength],
                        valid: {
                            ackResult: 'cancel'
                        }
                    };
                }
                if (buffer[4] === Ack.FAIL) {
                    return {
                        index: [0, this.expectedLength],
                        valid: {
                            ackResult: 'fail'
                        }
                    };
                }
                this.dataLength = parseShort(buffer, 2);
                this.expectedLength = this.dataLength + 3;
                this.stage = 2;
                if (buffer.length < this.expectedLength + 8) {
                    return invalidResult;
                }
            }
            if (this.stage === 2) {
                var nuser = parseShort(buffer, 9);
                for (var i = 0, offset = 11; i < nuser; ++i, offset += 3) {
                    var id = parseShort(buffer, offset);
                    var privilege = buffer[offset + 2];
                    this.users[id] = privilege;
                }
                return {
                    index: [0, this.expectedLength],
                    valid: {
                        ackResult: 'success',
                        users: this.users
                    }
                };
            }
        }
    };

    commands.deleteAllUsers = function (callback) {
        var cmdBuffer = generateCommand([0x05, 0x00, 0x00, 0x00, 0x00]);
        communication.pushCmd({
            requestData: cmdBuffer,
            responseTimeout: 3000,
            parseResponse: basicParseResponse.bind(undefined, 0x05)
        }, function (error, result) {
            if (error) {
                callback && callback(new Error(buildTimeoutString('deleteAllUsers')));
                return;
            }
            if (result.ackResult !== 'success') {
                callback && callback(new Error(buildAckString('deleteAllUsers', result.ackResult)));
                return;
            }
            callback && callback();
        });
    };

    commands.deleteUser = function (id, callback) {
        var cmdBuffer = generateCommand([0x04, (id & 0xff00) >> 8, id & 0xff, 0x00, 0x00]);
        communication.pushCmd({
            requestData: cmdBuffer,
            responseTimeout: 3000,
            parseResponse: basicParseResponse.bind(undefined, 0x04)
        }, function (error, result) {
            if (error) {
                callback && callback(new Error(buildTimeoutString('deleteUser')));
                return;
            }
            if (result.ackResult !== 'success') {
                callback && callback(new Error(buildAckString('deleteUser', result.ackResult)));
                return;
            }
            callback && callback();
        });
    };

    commands.addUser = function (id, privilege, callback) {
        function parseResponse(cmdId, buffer) {
            if (buffer.length < 8) {
                return {
                    index: [-1, 0],
                    valid: null
                };
            }
            return {
                index: [0, 8],
                valid: {
                    ackResult: buffer[1] !== cmdId ? 'cancel' : buffer[4] === Ack.SUCCESS ? 'success' : buffer[4] === Ack.FAIL ? 'fail' :
                        buffer[4] === Ack.FULL ? 'full' : buffer[4] === Ack.TIMEOUT ? 'timeout' :
                            buffer[4] === Ack.USER_EXIST ? 'user_exist' : 'unknown'
                }
            };
        }
        function stage(i, next) {
            var cmdBuffer = generateCommand([i, (id & 0xff00) >> 8, id & 0xff, privilege, 0x00]);
            communication.pushCmd({
                requestData: cmdBuffer,
                responseTimeout: 10000,
                parseResponse: parseResponse.bind(undefined, i)
            }, function (error, result) {
                if (error) {
                    callback && callback(new Error(buildTimeoutString('addUser')));
                    return;
                }
                if (result.ackResult === 'success') {
                    next();
                    return;
                }
                callback && callback(new Error(buildAckString('addUser', result.ackResult)));
            });
        }

        stage(1, function () {
            stage(2, function () {
                stage(3, function () {
                    callback && callback();
                });
            });
        });
    };

    commands.scanUser = function (callback) {
        var cmdBuffer = generateCommand([0x0C, 0x00, 0x00, 0x00, 0x00]);
        communication.pushCmd({
            requestData: cmdBuffer,
            responseTimeout: 10000,
            parseResponse: parseResponse.bind(undefined, 0x0C)
        }, function (error, result) {
            if (error) {
                callback(new Error(buildTimeoutString('scanUser')));
                return;
            }
            if (result.ackResult !== 'success') {
                callback(new Error(buildAckString('scanUser', result.ackResult)));
                return;
            }
            callback(undefined, result.user);
        });

        function parseResponse(cmdId, buffer) {
            if (buffer.length < 8) {
                return {
                    index: [-1, 0],
                    valid: null
                };
            }
            var id = undefined;
            var privilege = buffer[4];
            if (privilege >= 1 && privilege <= 3) {
                id = parseShort(buffer, 2);
            }
            return {
                index: [0, 8],
                valid: {
                    ackResult: buffer[1] !== cmdId ? 'cancel' : privilege === Ack.NOUSER ? 'nouser' : privilege === Ack.TIMEOUT ? 'timeout' : 'success',
                    user: id && {
                        id: id,
                        privilege: privilege
                    }
                }
            };
        }
    };

    commands.getScanTimeout = function (callback) {
        var cmdBuffer = generateCommand([0x2E, 0x00, 0x00, 0x01, 0x00]);
        communication.pushCmd({
            requestData: cmdBuffer,
            responseTimeout: 3000,
            parseResponse: basicParseResponseWithData.bind(undefined, 0x2E, 'timeout')
        }, function (error, result) {
            if (error) {
                callback(new Error(buildTimeoutString('getScanTimeout')));
                return;
            }
            if (result.ackResult !== 'success') {
                callback(new Error(buildAckString('getScanTimeout', result.ackResult)));
                return;
            }
            callback(undefined, result.timeout * 200);
        });
    };

    commands.setScanTimeout = function (timeout, callback) {
        var timeoutValue = 0;
        if (timeout > 0) {
            timeoutValue = (timeout / 200) & 0xFF;
        }
        var cmdBuffer = generateCommand([0x2E, 0x00, timeoutValue, 0x00, 0x00]);
        communication.pushCmd({
            requestData: cmdBuffer,
            responseTimeout: 3000,
            parseResponse: basicParseResponse.bind(undefined, 0x2E)
        }, function (error, result) {
            if (error) {
                callback && callback(new Error(buildTimeoutString('setScanTimeout')));
                return;
            }
            if (result.ackResult !== 'success') {
                callback && callback(new Error(buildAckString('setScanTimeout', result.ackResult)));
                return;
            }
            callback && callback();
        });
    };

    commands.getComparisonLevel = function (callback) {
        var cmdBuffer = generateCommand([0x28, 0x00, 0x00, 0x01, 0x00]);
        communication.pushCmd({
            requestData: cmdBuffer,
            responseTimeout: 3000,
            parseResponse: basicParseResponseWithData.bind(undefined, 0x28, 'level')
        }, function (error, result) {
            if (error) {
                callback(new Error(buildTimeoutString('getComparisonLevel')));
                return;
            }
            if (result.ackResult !== 'success') {
                callback(new Error(buildAckString('getComparisonLevel', result.ackResult)));
                return;
            }
            callback(undefined, result.level);
        });
    };

    commands.setComparisonLevel = function (level, callback) {
        var cmdBuffer = generateCommand([0x28, 0x00, (level & 0xFF) % 10, 0x00, 0x00]);
        communication.pushCmd({
            requestData: cmdBuffer,
            responseTimeout: 3000,
            parseResponse: basicParseResponse.bind(undefined, 0x28)
        }, function (error, result) {
            if (error) {
                callback && callback(new Error(buildTimeoutString('setComparisonLevel')));
                return;
            }
            if (result.ackResult !== 'success') {
                callback && callback(new Error(buildAckString('setComparisonLevel', result.ackResult)));
                return;
            }
            callback && callback();
        });
    };

    commands.cancelCommand = function (callback) {
        var cmdBuffer = generateCommand([0x28, 0x00, 0x00, 0x01, 0x00]);
        communication.sendRawData(cmdBuffer, callback);
    };

    return commands;
}

function basicParseResponse(cmdId, buffer) {
    if (buffer.length < 8) {
        return {
            index: [-1, 0],
            valid: null
        };
    }
    return {
        index: [0, 8],
        valid: {
            ackResult: buffer[1] !== cmdId ? 'cancel' : buffer[4] === Ack.SUCCESS ? 'success' : 'fail'
        }
    };
}

function basicParseResponseWithData(cmdId, dataName, buffer) {
    if (buffer.length < 8) {
        return {
            index: [-1, 0],
            valid: null
        };
    }
    var res = Object.create(null);
    res.index = [0, 8];
    res.valid = Object.create(null);
    res.valid.ackResult = buffer[1] !== cmdId ? 'cancel' : buffer[4] === Ack.SUCCESS ? 'success' : 'fail';
    res.valid[dataName] = buffer[2] << 8 | buffer[3];
    return res;
}

module.exports = createCommands;
