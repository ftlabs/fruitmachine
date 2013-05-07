## Rendering

When you have [assembled](view-assembly.md) your view and populated it with the required [data](view-data.md) you can call `.render()`. Render recursively templates the nested view structure from the bottom up, and then turns the output html string into a DOM node (`view.el`).

#### Re-rendering

Often data changes and you need to re-render your views. Render replaces the root element with a newly templated one, this means you can easily keep views up to date.

```js
var model = new FruitMachine.Model({ name: 'Wilson' });
var apple = new Apple({ model: model });

apple
  .render()
  .inject(document.body);

//...some time later

apple.model.set('name', 'Matt');
apple.render();
```