## Templates

Each module (or view) must have a template assigned with it. This is done when the module is defined (via `fruitmachine.define();`). Each module expects to be given a template function, that when called (and optionally passed a data object) will return html. You template function can just be a plain JavaScript function, but we recommend you use a templating library like [Hogan](http://twitter.github.io/hogan.js/).

The following are equivalent:

```js
var template = function(data) { return '<div>' + data.text + '</div>'; };

var MyModule = fruitmachine.define({
	name: 'myModule',
	template: template
});
```

```js
var template = Hogan.compile('<div>{{text}}</div>');

var MyModule = fruitmachine.define({
	name: 'myModule',
	template: template
});
```

**Note:** If the object passed has a render function (somewhat templating convention), then that will be used as the module's template function.