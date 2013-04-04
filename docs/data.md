
# Data

#### Set data

```js
var apple = new Apple({ data: { foo: 'bar', baz: 'bap' } });

// or

apple.data('foo', 'bar');
apple.data('baz', 'bap');

// or

apple.data({
  foo: 'bar',
  baz: 'bap'
});
```

### Get data

```js
apple.data('foo');
//=> 'bar'

apple.data();
//=> { foo: 'bar', baz: 'bap' }
```

View data is an instance's internal template data store. It can be defined at the point of instantiation by passing in a `data` object parameter, and/or altered after instantiation using the `View#data()` API. When you call `View#render()` your View (and all nested views) will have it's template function run, passing the entire `data` object as the first argument.
