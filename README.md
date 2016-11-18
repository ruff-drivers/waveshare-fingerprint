[![Build Status](https://travis-ci.org/ruff-drivers/waveshare-fingerprint.svg)](https://travis-ci.org/ruff-drivers/waveshare-fingerprint)

# Waveshare Fingerprint Module Driver for Ruff

Waveshare Fingerprint Module Driver with UART interface.

## Supported Engines

* Ruff: >=1.2.0 <1.7.0

## Supported Models

- [waveshare-fingerprint](https://rap.ruff.io/devices/waveshare-fingerprint)

## Installing

Execute following command and enter a **supported model** to install.

```sh
# Please replace `<device-id>` with a proper ID.
# And this will be what you are going to query while `$('#<device-id>')`.
rap device add <device-id>

# Then enter a supported model, for example:
# ? model: waveshare-fingerprint
```

## Usage

Here is the basic usage of this driver.

```js
var fingerprint = $('#<device-id>');
var num = fingerprint.getUserCount(function (error, count) {
    if (error) {
        console.log(error.message);
        return;
    }
    if (count === 0) {
        // add the first user (namely fingerprint)
        console.log('Add user ...');
        var id = 1;
        var privilege = 1;
        fingerprint.addUser(id, privilege, function (error) {
            if (error) {
                console.log(error.message);
                return;
            }
            console.log('fingerprint successfully added');
        })
    } else {
        // print all
        var users = fingerprint.getAllUsers(function (error, users) {
            if (error) {
                console.log(error.message);
                return;
            }
            for (var id in users) {
                console.log('id:', id, 'privilege:', users[id]);
            }
            // scan and identify
            fingerprint.scanUser(function(error, user) {
                if (error) {
                    console.log(error.message);
                    return;
                }
                console.log('id:', user.id, 'privilege:', user.privilege)
            });
        });
    }
});
```

## API References

### Methods

#### `getUserCount(callback)`

Get number of fingerprints registered to the device.

- **callback:** The callback that takes the first argument as the possible error and the second argument as the count of users registered in the device.

#### `getAllUsers(callback)`

Get ID and privilege of all fingerprints.

- **callback:** The callback that takes the first argument as the possible error and the second argument as users infomation registered in the device.
The users infomation is an Object with id as it's key and privilege as it's value.

#### `deleteUser(id[, callback])`

Delete a fingerprint by a specific ID.

- **id:** The id of user, it is a number, and should be between 0 ~ 0xFFFF.
- **callback:** No arguments other than a possible exception are given to the completion callback.

#### `deleteAllUsers([callback])`

Delete all registered fingerprints.

- **callback:** No arguments other than a possible exception are given to the completion callback.

#### `addUser(id, privilege[, callback])`

Register a new fingerprint to the device.

- **id:** The id of user, it is a number, and should be between 0 ~ 0xFFFF.
- **privilege:** The privilege of user, it is a number, and should be between 1 ~ 3.
- **callback:** No arguments other than a possible exception are given to the completion callback.

#### `scanUser(callback)`

Scan and identify fingerprint.

- **callback:** The callback that takes the first argument as the possible error and the second argument as user infomation registered in the device.
The user infomation is an Object with two keys `id` and `privilege`.

#### `getScanTimeout(callback)`

Get fingerprint capture timeout value.

- **callback:** The callback that takes the first argument as the possible error and the second argument as timeout value in milliseconds.

#### `setScanTimeout(timeout[, callback])`

Set fingerprint capture timeout value.

- **timeout:** The timeout of fingerprint scanning. It is a number in milliseconds and should be between 0 ~ 200 * 255.
When the `timeout` is 0, the timeout of fingerprint scanning is infinity.

- **callback:** No arguments other than a possible exception are given to the completion callback.

#### `getComparisonLevel(callback)`

Get comparision level.

- **callback:** The callback that takes the first argument as the possible error and the second argument as the comparision level.

#### `setComparisonLevel(level[, callback])`

Set comparision level.

- **level:** The comparision level. It is a number and should be between 0 ~ 9. The greater the level is, the more strict in comparison.

- **callback:** No arguments other than a possible exception are given to the completion callback.

#### `cancelCommand([callback])`

Cancel the commands whose response would consume unexpected time, such as `addUser` and `scanUser`, thus another new command could be sent to the device.

- **callback:** No arguments other than a possible exception are given to the completion callback.

## Contributing

Contributions to this project are warmly welcome. But before you open a pull request, please make sure your changes are passing code linting and tests.

You will need the latest [Ruff SDK](https://ruff.io/) to install rap dependencies and then to run tests.

### Installing Dependencies

```sh
npm install
rap install
```

### Running Tests

```sh
npm test
```

## License

The MIT License (MIT)

Copyright (c) 2016 Nanchao Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
