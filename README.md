# till-event

Node events to promises

## Usage

```js
	const tillEvent = require('till-event'); // or const {tillEvent} = require(....)
	await tillEvent(emitter, eventName);// or tillEvent([emitter], [eventName]);
```

```js
	const promise = tillEvent([emitter], [eventName], {
		abort   : new AbortController(), //false, true, abortController, abortSignal,
		timeout : 1000, //1000 ms (1 second)
		filter  : function(result, promise){
			const {event, args} = result;
			if(...){
				return someVar; // promise.resolve(someVar);
			} else if(...){
				throw new Error(...); //promise.reject(new Error(....))
			}
			return false; // promise will not be finished
		}
	});
	//promise have features of 'hkey-exteneded-promise' promise.abort(); promise.resolve(value); promise.reject(new Error()); promise.timeout = 100;
```

## Example wait till WebSocket open

```js
	const WS     = require('ws');
	const socket = new WS(url);
	
	await tillEvent(socket, ['open', 'error', 'close'], {
		timeout : 10000, //10 seconds
		filter  : function(promise, result){
			const {event, args} = result;
			if(event === 'open'){
				return socket;
			} else if(event === 'close'){
				throw new Error('Socket closed before open :  '+args[0]+' '+(args[1]||''));
			} else if(event === 'error'){
				throw ((args[0] instanceof Error) ? args[0] : new Error('Socket open Error: '+args[0]));
			} else throw new Error('Something gone wrong')
		}	
	})	
```

## Emitter
Extension of Node.js EventEmitter ('node:events');

```js
	const {Emitter} = require('till-event');
	const emitter   = new Emitter();
	
	emitter.tillEvent('init').then(()=>console.log('tillEvent:init')); //or tillEvent(emitter, eventName);
	setTimeout(emitter.emit('init'), 100)//or emitter.emitOnce('init')
	
	emitter.tillEventOrWas('init').then(()=>console.log('tillEventOrWas:init')));
	
	emitter.getLastEvent('init'); // or emitter.getLastEvent(['init']);
	emitter.getLastEventTimestamp('init'); // or emitter.getLastEventTimestamp(['init']);
```



