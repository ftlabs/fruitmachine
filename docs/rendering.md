## Rendering

When you have [assembled](layout-assembly.md) your modules and populated them with the required [data](module-instantiation.md#options) you can call `.render()`. Render recursively renders the the nested module structure by calling each module's render function, from the bottom up, and then turns the output html string into a DOM node (`view.el`). `Module#render()` (like most module methods) returns the module instance (`this`) to allow for chaining.

#### Re-rendering

Often data changes and you need to re-render your modules. Render replaces the root element with a new one, which means you can easily keep Views up to date.

```js
var model = new fruitmachine.Model({ name: 'Wilson' });
var apple = new Apple({ model: model });

apple
  .render()
  .inject(document.body);

//...some time later

apple.model.set('name', 'Matt');
apple.render();
```
