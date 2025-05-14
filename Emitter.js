const assert           = require('node:assert');
const NodeEvents       = require('node:events');
const ExtendedPromise  = require('hkey-extended-promise'); //const ExtendedPromise  = require('../extended-promise/ExtendedPromise.js');
const tillEvent        = require('./tillEvent.js');

class Emitter extends NodeEvents{
	constructor(emitterOpts={}){
		super();
		this.__lastEvents  = {};
		this.__emitterOpts = emitterOpts;
	}
	tillEvent(events, opts={}){
		return tillEvent(this, events, opts);
	}
	tillEventOrWas(events, opts={}){
		events = Array.isArray(events) ? events : [events];
		opts   = (opts instanceof AbortController || opts instanceof AbortSignal) ? {abort: opts} : opts;

		assert(typeof(opts)!=='function');
		assert(!opts.filter);

		let last = this.getLastEvent(events);//events.find(event=>this.__lastEvents);
		if(last){
			const promise = new ExtendedPromise(opts);//castAbortablePromise(abortSignal, function finish(){});
			process.nextTick(() => promise.resolve(last));
			return promise;
		} else {
			return tillEvent(this, events, opts);
		}
	}
	getLastEvent(...events){
		events   = Array.isArray(events[0]) ? events[0] : events;
		let last = undefined;
		events.forEach(eventName=>{
			const details = this.__lastEvents[eventName];
			if(!last || (details && details.timestamp > last.timestamp)){
				last  = details;
			}
		});
		return last;
	}
	getLastEventTimestamp(...events){
		const last = this.getLastEvent(...events);
		return last ? last.timestamp : 0;
	}
	__onOrOnce(methodName, eventName, cb){
		const type = typeof(eventName);
		if(type==='string' || type==='symbol'){
			return super[methodName](eventName, cb);
		} else assert.equal(type, 'object');
		
		assert(!(eventName instanceof Promise) && !(eventName instanceof Error));
		
		if(Array.isArray(eventName)){
			assert.equal(typeof(cb), 'function')
			eventName.forEach(name=>{
				super[methodName](name, cb);
			})
		} else {
			assert.equal(cb, undefined);
			for(let name in methodName){
				super[methodName](name, methodName[name]);
			}
		}
	}
	on(eventName, cb){
		return this.__onOrOnce('on', eventName, cb);
	}
	once(eventName, cb){
		return this.__onOrOnce('once', eventName, cb);
	}	
	emit(...args){
		const event = args[0];
		const details = {
			event, 
			emitter   : this,
			timestamp : Date.now(),
			isOld     : true,
		};
		if(this.__emitterOpts.storeArgs){
			details.args      = args;
			details.arguments = args;
		}
		this.__lastEvents[event] = details;
		super.emit(...args);
	}
	emitOnce(...args){
		if(!this.__lastEvents[args[0]]){
			this.emit(...args);
		}
	}
};
module.exports = Emitter;