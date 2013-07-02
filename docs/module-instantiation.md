## Instantiation

There are two ways to instantiate a FruitMachine module:

##### Explicit

```js
var apple = new Apple();
```

##### Lazy

```js
var apple = fruitmachine({ module: 'apple' });
```

Use *Explicit* instantiation over *Lazy* instantiation whenever possible. The *Lazy* instantiation option exists so that you are able to predefine page layouts in JSON form and pass them into the `fruitmachine()` factory method.

When instantiating 'lazily' *FruitMachine* looks at the `module` property and attempts to map it to a module you have defined using [fruitmachine.define()](defining-modules.md). If a match is found, it will `Explictly` instantiate that module with the options you originally passed.

### Options

- `id {String}` Your unique id for this View module
- `module {String}` The module type (only use if using 'Lazy' instantiation)
- `children {Array}` An array of child views to instantiate (can be lazy JSON or view instances)
- `model {Object}` A data model object that will be accessible in your template
- `helpers {Array}` An array of helper functions to be called on instantiation
- `classes {Array}` Classes to be added to the root element
- `template {Function}` A template function that will return HTML (will any existing template)
- `tag {String}` The tag to use for the root element (defaults to 'div')
