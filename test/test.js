/*!
 * Copyright (c) 2016 Nanchao Inc.
 * All rights reserved.
 */

'use strict';

var fs = require('fs');
var dirs = fs.readdirSync(__dirname);

dirs.filter(function (file) {
    return /test-/.test(file);
}).forEach(function (file) {
    require('./' + file);
});

/*
fp.getUserCount(function (error, count) {
    console.log(error, count);
});

fp.getAllUsers(function (error, users) {
    console.log(error, users);
});

fp.deleteUser(20, function (error) {
    console.log(error);
});

fp.deleteAllUsers(function (error) {
    console.log(error);
});

fp.getComparisonLevel(function (error, level) {
    console.log(error, level);
});

fp.setComparisonLevel(5, function (error) {
    console.log(error);
});

fp.getScanTimeout(function (error, timeout) {
    console.log(error, timeout);
});

fp.setScanTimeout(0, function (error) {
    console.log(error);
});

fp.addUser(11, 1, function (error) {
    console.log(error);
});

fp.scanUser(function (error, user) {
    console.log(error, user);
});

fp.cancelCommand(function (error) {
    console.log(error, 'cancel done');
});
*/
