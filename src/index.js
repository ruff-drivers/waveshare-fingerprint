/*!
 * Copyright (c) 2016 Nanchao Inc.
 * All rights reserved.
 */

'use strict';

var driver = require('ruff-driver');
var Communication = require('./communication');
var createCommands = require('./commands');

module.exports = driver({
    attach: function (inputs) {
        this._commands = createCommands(new Communication(inputs['uart']));
        var that = this;
        Object.keys(this._commands).forEach(function (key) {
            that[key] = that._commands[key].bind(that._commands);
        });
    }
    // exports: {
    //     getUserCount: function () {
    //         this._commands.getUserCount.apply(this._commands, arguments);
    //     },
    //     getAllUsers: function () {
    //         this._commands.getAllUsers.apply(this._commands, arguments);
    //     },
    //     deleteAllUsers: function () {
    //         this._commands.deleteAllUsers.apply(this._commands, arguments);
    //     },
    //     deleteUser: function () {
    //         this._commands.deleteUser.apply(this._commands, arguments);
    //     },
    //     addUser: function () {
    //         this._commands.addUser.apply(this._commands, arguments);
    //     },
    //     scanUser: function () {
    //         this._commands.scanUser.apply(this._commands, arguments);
    //     },
    //     getScanTimeout: function () {
    //         this._commands.getScanTimeout.apply(this._commands, arguments);
    //     },
    //     setScanTimeout: function () {
    //         this._commands.setScanTimeout.apply(this._commands, arguments);
    //     },
    //     getComparisonLevel: function () {
    //         this._commands.getComparisonLevel.apply(this._commands, arguments);
    //     },
    //     setComparisonLevel: function () {
    //         this._commands.setComparisonLevel.apply(this._commands, arguments);
    //     }
    // }
});
