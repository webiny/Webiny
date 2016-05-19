jquery-deparam
==============

Extracted $.deparam from Ben Alman's [jquery-bbq](https://github.com/cowboy/jquery-bbq/) with license info included.
Deparam is the inverse of jquery's [$.param method](http://api.jquery.com/jQuery.param/).  It takes a parameterized querystring and converts it back into an object.  The format is in many ways a more compact way to serialize a javascript object over JSON.  For example (from the included tests):

```javascript
var paramStr = 'a[]=4&a[]=5&a[]=6&b[x][]=7&b[y]=8&b[z][]=9&b[z][]=0&b[z][]=true&b[z][]=false&b[z][]=undefined&b[z][]=&c=1';
var paramsObj = {
    a: ['4','5','6'],
    b:{
        x:['7'],
        y:'8',
        z:['9','0','true','false','undefined','']
    },
    c:'1'
};

deparam(paramStr).should.deep.equal(paramsObj);

```

Install
==============
```
bower install jquery-deparam
npm install jquery-deparam
```

Usage
===============
Browser global:
```
<script src="jquery-deparam.js"></script>
```
CommonJS module:
```
var deparam = require('jquery-deparam');
```
AMD Module:
```
define(['deparam'], function(deparam){});

```

Notes
================
`$.param({})`, `$.param([])`, and `$.param('')` serialize into empty strings.  This library will serialize those cases into an empty string.

License
===============
MIT
