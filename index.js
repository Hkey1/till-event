const { 
	TimeoutError, DontFinishError, 
	PseudoAbortError, isAbortError 
}                = require('hkey-extended-promise');
const tillEvent  = require('./tillEvent.js');
const Emitter    = require('./Emitter.js');
	
module.exports                  = tillEvent;
module.exports.Emitter          = Emitter;
module.exports.tillEvent        = tillEvent.bind(null);
module.exports.TimeoutError     = TimeoutError;
module.exports.DontFinishError  = DontFinishError;
module.exports.PseudoAbortError = PseudoAbortError;
module.exports.isAbortError     = isAbortError;