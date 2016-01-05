# lodash-mixins
A little collection of additional mix-ins for great ```lodash``` library (https://github.com/lodash/lodash). Here you can find quick docs of each mixin - they are organized the same way as in the original ```lodash``` docs - alphabetically and by mixin category (```string```, ```collection```, ```array``` ... ).

## Installation
Install via bower using ```bower install lodash-mixins --save``` or simply download and include ```lodash-mixins.min.js```. Be sure to initialize original lodash before registering these mix-ins. The only dependency to this package is ```lodash``` itself. ES6 is not required.

## Array

### _.in(value, array)
Uses already existing `_.contains` method. Added just to make code more readable in certain cases.

```javascript
_.in(5, [2,3,5,6]);
// produces true
```

## Collection

### _.renameKeys(collection, fromKey, toKey)
Loops over collection of objects and renames a key.

```javascript
_.renameKeys([{a: 2, b:4}, {x: 3, b:3}], 'x', 'a')
// produces [{"a":2,"b":4},{"b":3,"a":3}]
```

## Lang

### _.isDefined(variable)
This is the opposite of ```_.isUndefined```.

```javascript
var a = {b: 1};
console.log(_.isDefined(a.c));
// produces false
```
## Object

### _.id(variable)
Returns an ID from given variable - if string was passed, it assumes that's it, otherwise it returns 'id' field from given object

```javascript
var user = {id: 123, firstName: 'Mike', city: 'New York'};
console.log(_.id(user));
// produces 123
```

## String

### _.connect(...)

Connects all arguments with given string. If one of the argument is an array, it will be considered as an array of values that need to be connected. You can pass any number of arguments, the last argument is the string that will connect everything.

If last argument is a string, then that will be used for connecting each part. Also, instead of a  string, an object can be passed where you can set three parameters, these are the defaults:

```json
{"main": "", "last": "", "strict": "false"}
```

If strict is set to `false` (the default setting), then values like empty strings and `null` will simply be skipped in the final output (examples below).

```javascript
_.connect('Today', 'is', 'a cool', 'day', ' ');
// produces 'Today is a cool day.'

_.connect('Today', 'is', ['a cool', 'day'], '::');
// produces 'Today::is::a::cool::day.'

_.connect('One', ['two','three','four'], null, 'five', 'six', {main: ', ', last:' and ', strict: false})
// produces 'One, two, three, four, five and six'

_.connect('One', ['two','three','four'], null, 'five', 'six', {main: ', ', last:' and ', strict: true})
// produces 'One, two, three, four, null, five and six'
```

Additional _.connect helpers are also included:

```javascript
_.spaced(...); // Connects arguments with a blank space " "
_.dashed(...); // Connects arguments with a dash "-"
_.dotted(...); // Connects arguments with a dot "."
_.slashed(...); // Connects arguments with a forward slash "/"
_.listed(...); // Connects all arguments with a comma, except last one for which 'and' word is used - useful when outputting lists in user interface
```

### _.pluralize(word, count, prependCount)
Transforms given word to its plural form if needed - depending on the given count. It can handle uncountable or irregular nouns too. For convenience, this can also prepend given count in the final output, by passing ```prependCount```.

```javascript
_.pluralize('day', 1);
// produces 'day'

_.pluralize('day', 2);
// produces 'days'

_.pluralize('tomato', 2);
// produces 'tomatoes'

_.pluralize('tomato', 2, true);
// produces '2 tomatoes'
```

### _.toSlug(string)
Transforms given string to  slug.

```javascript
_.toSlug('Today is a nice day');
// produces 'today-is-a-nice-day'
```

### _.toUpperCase(string)
Just a wrapper of the original toString method.

```javascript
_.toUpperCase('very simple');
// produces 'VERY SIMPLE'
```

### _.words(sentence, count, ending)
Returns first N words from given sentence. Optionally, you can append an additional ending to the output ('...' by default).

```javascript
_.words('testing this thing right now', 3);
// produces 'testing this thing...'
```