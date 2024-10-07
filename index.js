const tillEvent = require('./tillEvent.js');
const Emitter   = require('./Emitter.js');

module.exports           = tillEvent;
module.exports.Emitter   = Emitter;
module.exports.tillEvent = tillEvent.bind(null);
