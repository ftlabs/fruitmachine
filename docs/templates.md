
# Templates

Each module (or view) must have a template assigned with it. This is done when the module is defined (via `FruitMachine.define();`). Each module expects to be given a template function, that when called (and optionally passed a data object) will return html.

```js
var template = Hogan.compile('<div>{{text}}</div>');

var MyModule = FruitMachine.define({
	module: 'myModule',
	template: template
});
```

If the object passed has a render function (somewhat templating convention), then that will be used.
