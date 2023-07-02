const path = require("path");
const axios = require('axios')

// internal requires
const pack = require("./package.json")
const aevent = require("./lib/aevent")
const prettyjson = require("prettyjson")

// reayl load of log
require("./lib/log")

// module require
BigInt.prototype.toJSON = function () { return this.toString() }

String.prototype.trim = function () {
    return this.replace(/^\s+|\s+$/g, "");
}

String.isString = function (value) {
    return typeof value === 'string' || value instanceof String;
}

Number.prototype.fixZero = function (num) {
    if (this < 10) return (`0${this}`);
    return (`${this}`);
}

String.prototype.fixZero = function () {
    if (this.length % 2 !== 0) return (`0${this}`);
    return (`${this}`);
}

String.prototype.padding = function (length, char = "0") {
    var result = String(this)
    while (result.length < length) {
        result = char + result
    }
    return result;
}

console.pretty = (data) => {
    console.log(prettyjson.render(data))
}

console.params = function (start, params) {
    var buffer = start

    for (var k in params) {
        var v = params[k]
        buffer += `${k}=${v} `
    }
    return (buffer.trim())
}

class Zuln {
    constructor(url, path) {
        this.url = url
        this.path = path
    }

    async post(resource, data) {
        try {
            console.nino.debug(`Sending Zuln POST to ${this.url}${this.path}${resource}`, ['zult'])
            var response = await axios.post(`${this.url}${this.path}${resource}`, data)
            return (response.data)
        } catch (e) {
            return ({
                error: e.message
            })
        }
    }
}

module.exports = Zuln


