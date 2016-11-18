/*!
 * Copyright (c) 2016 Nanchao Inc.
 * All rights reserved.
 */

'use strict';

var constant = require('./constant');
var checksum = require('./util').checksum;

function generateCommand(head, body) {
    var headData = packData(head);
    var bodyData = [];
    if (body) {
        bodyData = packData(body);
    }
    return new Buffer(headData.concat(bodyData));
}

function packData(data) {
    return []
        .concat(constant.DELIMITER)
        .concat(data)
        .concat(checksum(data))
        .concat(constant.DELIMITER);
}

module.exports = generateCommand;
