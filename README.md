# till-event
Node events to promises to await till event;

## Install
```
npm i till-event
```
then
```js
const tillEvent = require('till-event'); 
```
OR
```js
const {
    tillEvent, Emitter,
    TimeoutError, DontFinishError, 
    PseudoAbortError, isAbortError, 
} = require('till-event'); 
```

## Usage

### wait till event
```js
await tillEvent(emitter, eventName);
```

OR
```js
const {event, args} = await tillEvent([emitter1, emitter2, ...], [eventName1, eventName2, ...]);
```



### timeout
```js
const {    tillEvent, TimeoutError } = require('till-event'); 
...
try{
    await tillEvent(emitter, eventName, {timeout: msTillReject});
} catch(err){
    if(err instanceof TimeoutError){
        ...
    }
}
```

#### promise.timeout
You can use promise.timeout to set or clear Timeout or get ms till timeout;

```js
promise = tillEvent(emitter, eventName);
console.log(promise.timeout); //Infinity

promise.timeout = 1000; //or promise.setTimeout(1000);
console.log(promise.timeout); //1000

promise.timeout = false; //or promise.clearTimeout();
console.log(promise.timeout); // Infinity

promise.timeout = 900; 
console.log(promise.timeout); // 900

setTimeout(()=>console.log(promise.timeout), 100); //800
```

### filter 
You can ignore some events or rejects or change resolve result 
```js
await tillEvent(emitter, eventName, {
    filter  : function(result, promise){
        const {event, args, emitter} = result;
        if(...){
            return someVar; // promise.resolve(someVar);
        } else if(...){
            throw new Error(...); //promise.reject(new Error(....))
        }
        return false; // promise will not be finished
    }
});
```    

## Example wait till WebSocket open
    * resolve on open event
    * reject 
        - if not open in 10 seconds
        - on close event
        - on error event

```js
const WS = require('ws');
...
function createOpenedWebSocket(url){
    const socket = new WS(url);
    return tillEvent(socket, ['open', 'error', 'close'], {
        timeout : 10000, //10 seconds
        filter  : function(promise, result){
            const {event, args} = result;
            if(event === 'open'){
                return socket;
            } else {
                socket.close();
                if(event === 'close'){
                    throw new Error('Socket closed before open :  '+args[0]+' '+(args[1]||''));
                } else if(event === 'error'){
                    throw ((args[0] instanceof Error) ? args[0] : new Error('Socket open Error: '+args[0]));
                } else throw new Error('Something gone wrong')
            }
        }    
    })    
}
```


## Emitter
Extension of Node.js EventEmitter ('node:events');

new methods: 

    * tillEvent(eventNames, opts={})
    * tillEventOrWas(eventNames, opts={}) if event already was it will resolvs imidiatly 
    * emitOnce(eventNamem, ...args) if event already was it will ignored
    * emitter.getLastEvent(eventNames) return last event 
    * emitter.getLastEventTimestamp(eventNames) return last event timestamp
    
    
### Example

```js
const {Emitter} = require('till-event');
const emitter   = new Emitter();
    
emitter.tillEvent('init').then(()=>console.log('tillEvent:init')); //or tillEvent(emitter, eventName);
setTimeout(emitter.emit('init'), 100)//or emitter.emitOnce('init')
    
emitter.tillEventOrWas('init').then(()=>console.log('tillEventOrWas:init')));
    
emitter.getLastEvent('init'); // or emitter.getLastEvent(['init']);
emitter.getLastEventTimestamp('init'); // or emitter.getLastEventTimestamp(['init']);
```
