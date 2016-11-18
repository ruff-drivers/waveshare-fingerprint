/*!
 * Copyright (c) 2016 Nanchao Inc.
 * All rights reserved.
 */

'use strict';

function checksum(data) {
    var sum = 0;
    if (typeof data === 'number') {
        sum = data & 0xFF;
    } else {
        for (var i = 0; i < data.length; i++) {
            sum ^= data[i];
        }
    }
    return sum & 0xFF;
}
exports.checksum = checksum;

function parseShort(data, offset) {
    return (data[offset] << 8) | data[offset + 1];
}
exports.parseShort = parseShort;

function buildTimeoutString(commandName) {
    return 'Command `' + commandName + '` failed: response timeout';
}
exports.buildTimeoutString = buildTimeoutString;

function buildAckString(commandName, ack) {
    return 'Command `' + commandName + '` failed, ack is ' + ack;
}
exports.buildAckString = buildAckString;
