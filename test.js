const NodeEvents           = require('node:events');
const {tillEvent, Emitter} = require('./index.js');

class NodeEmitter extends NodeEvents {
	constructor(){
		super();
		setTimeout(()=>{
			this.emit('init', 'this is init')
		}, 300);
	}
}
class MyEmitter extends Emitter {
	constructor(){
		super();
		setTimeout(()=>{
			this.emitOnce('init', 'this is init once')
		}, 300);
	}
}

(async function(){
	const nodeEmitter = new NodeEmitter();
	console.log('/1', await tillEvent(nodeEmitter, 'init'));

	const myEmitter   = new MyEmitter();

	console.log('/2', await tillEvent(myEmitter, 'init'));

	console.log('/3', await myEmitter.tillEventOrWas('init'));

	console.log('/4', await myEmitter.getLastEvent('init'));

	console.log('/5', await myEmitter.getLastEventTimestamp(['init']));	
})()


