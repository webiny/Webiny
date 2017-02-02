# Emmett

A custom event emitter for Node.js and the browser.

Its aim is to provide its user with a lot of event emitting sugar while remaining lightweight and fast.

## Installation

You can install **Emmett** through npm:

```bash
npm install --save emmett
```

Or you can just drop the [`emmett.min.js`](./emmett.min.js) file in your project (will work with many popular module systems).

## Usage

### Creating an emitter

```js
var Emitter = require('emmett');

var emitter = new Emitter();
```

### Extending the emitter

*Node.js*

```js
var util = require('util'),
    Emitter = require('emmett');

function MyObject() {
	Emitter.call(this);
}

util.inherits(MyObject, Emitter);
```

*ES6 class*

```js
import Emitter from 'emmett';

class MyObject extends Emitter {
	/* ... */
}
```

### Listening to events

```js
// Basic
emitter.on('eventName', callback);

// Once
emitter.once('eventName', callback);

// Using ES6 symbol as event name
const sym = Symbol();
emitter.on(sym, callback);

// Matching event names with a regex
emitter.on(/^event/, callback);

// Options
emitter.on('eventName', callback, {scope: customScope, once: true});

// Polymorphisms
emitter.on(['event1', 'event2'], callback);

emitter.on({
	event1: callback1,
	event2: callback2
});

// Listening to every events
emitter.on(callback);
```

## Event data

Events are objects having the following keys:

* **data**: the data attached to the event.
* **type**: the event type.
* **target**: the event emitter.

```js
emitter.on('myEvent', function(e) {
	console.log(e.data);
});

emitter.emit('myEvent', 'Hello World!');

// Will print "Hello World!" in the console
```

## Removing listeners

```js
// Basic
emitter.off('eventName', callback);

// Removing every listeners attached to the given event
emitter.off('eventName');

// Removing the callback from any event
emitter.off(callback);

// Polymorphisms
emitter.off(['event1', 'event2'], callback);

emitter.off({
	event1: callback1,
	event2: callback2
});

// Removing every listeners
emitter.unbindAll();
```

## Emitting

```js
// Basic
emitter.emit('eventName');

// With data
emitter.emit('eventName', {hello: 'world'});

// Polymorphisms
emitter.emit(['event1', 'event2']);
emitter.emit(['event1', 'event2'], {hello: 'world'});

emitter.emit({
	event1: 'hey',
	event2: 'ho'
});
```

## Retrieving listeners

```js
// Return every matching handlers for a given event name
emitter.listeners('eventName');
```

## Disabling an emitter

While disabled, emitting events won't produce nothing.

```js
emitter.disable();
emitter.enable();
```

## Killing an emitter

Killing an emitter will remove all its listeners and make it inoperant in the future.

```js
emitter.kill();
```

## Contribution

Do not hesitate to contribute to the library. Be sure to add and pass any relevant unit test before submitting any code.

```bash
# Installing the dev version
git clone http://github.com/jacomyal/emmett
cd emmett

# Installing dependencies
npm install

# Running unit tests
npm test

# Build a minified version
npm build

# Lint the code
gulp lint
```
