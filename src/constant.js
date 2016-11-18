/*!
 * Copyright (c) 2016 Nanchao Inc.
 * All rights reserved.
 */

'use strict';

var constant = Object.create(null);

constant.DELIMITER = 0xF5;

var Ack = Object.create(null);
Ack.SUCCESS = 0x00;
Ack.FAIL = 0x01;
Ack.FULL = 0x04;
Ack.NOUSER = 0x05;
Ack.USER_EXIST = 0x06;
Ack.FIN_EXIST = 0x07;
Ack.TIMEOUT = 0x08;
constant.Ack = Ack;

module.exports = constant;
