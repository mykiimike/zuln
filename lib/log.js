const crypto = require("crypto")
const chalk = require('chalk')


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
 * Extends log (debug version)
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
var logPaddingChan = 16;
var logPaddingType = 9;
const logVerbosity = 3;
const lastLogChan = {}

function __logger(message) {

  message.params = message.params || [];

  // remove null and undefined
  message.params = message.params.filter((item) => {
    if (!item) return (false);
    return (true)
  })

  var chan = `/${message.params.join("/")}`;

  // prepare chan
  var type = `[${message.type.toUpperCase()}]`;

  // padding
  if (type.length > logPaddingType) logPaddingType = type.length;
  type += ' '.repeat(logPaddingType - type.length);

  if (chan.length > logPaddingChan) logPaddingChan = chan.length;
  chan += ' '.repeat(logPaddingChan - chan.length);

  var consoleLog = console.log;

  // coloring type
  switch (message.type) {
    // verbosity 1
    case 'info':
      if (logVerbosity < 1) return;
      type = chalk.grey(type);
      break;

    // verbosity -1
    case 'error':
    case 'fatal':
      if (logVerbosity < -1) return;
      type = chalk.red(type);
      consoleLog = console.error;
      break;

    // verbosity 0
    case 'success':
      if (logVerbosity < 0) return;
      type = chalk.green(type);
      break;

    case 'warning':
      if (logVerbosity < 0) return;
      type = chalk.yellow(type);
      consoleLog = console.error;
      break;

    // verbosity 2

    case 'debug':
      if (logVerbosity < 2 || process.env.DEBUG !== "true") return;
      type = chalk.blue(type);
      consoleLog = console.debug;
      break;
  }

  // const rec = 100;
  // var track = parseInt(crypto.randomBytes(4).toString("hex"));
  const h = crypto.createHash("sha1");
  h.update("seed2")
  h.update(chan);
  const hash = h.digest("hex");

  // var r = crypto.randomBytes(1).toString("hex").fixZero();
  // var g = crypto.randomBytes(1).toString("hex").fixZero();
  // var b = crypto.randomBytes(1).toString("hex").fixZero();

  var r = hash.substring(0, 2).fixZero();
  var g = hash.substring(2, 4).toString("hex").fixZero();
  var b = hash.substring(4, 6).toString("hex").fixZero();

  // console.log(r, g, b, hash)
  // chan = chalk.rgb(r, g, b)(chan);
  chan = chalk.hex(`#${r}${g}${b}`)(chan);

  // computer channel timer
  if (!lastLogChan[chan]) lastLogChan[chan] = new Date;
  const timer = Date.now()-lastLogChan[chan].getTime();

  consoleLog(`[${message.date.toLocaleString()}] ${type} ${chan} | ${message.message.trim()} (+${timer}ms)`)

  // next timer
  lastLogChan[chan] = new Date
}

function __subLogger(type, message, params) {
  const date = new Date;
  __logger({ date, type, message, params: params || null })
}

console.nino = {}

console.nino.info = function (msg, params) {
  return (__subLogger('info', msg, params));
}

console.nino.success = function (msg, params) {
  return (__subLogger('success', msg, params));
}

console.nino.fatal = function (msg, params) {
  return (__subLogger('fatal', msg, params));
}

console.nino.error = function (msg, params) {
  return (__subLogger('error', msg, params));
}

console.nino.warning = function (msg, params) {
  return (__subLogger('warning', msg, params));
}

console.nino.debug = function (msg, params) {
  return (__subLogger('debug', msg, params));
}
