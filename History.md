0.5.1 / 2013-05-22
==================

  * change all descendant `model.el` properties set at `Module#render()`
  * change expose `fruitmachine.Events`
  * remove `Module#inDOM()`

0.5.0 / 2013-05-22
==================

  * add support for third party models
  * change `fruitmachine.View` => `fruitmachine.Module`
  * change component.json to bower.json

0.4.2 / 2013-05-20
==================

  * change allow `name` key as an alternative to `module` in module definitions

0.4.1 / 2013-05-17
==================

  * fix bug with delegate event listeners not being passed correct aguments

0.4.0 / 2013-05-17
==================

  * change `slot` now defines placement over `id`
  * change `children` can now be an object (keys as `slot`) or an array.
  * change `id` is optional, used only for queries.
  * change 'LazyViews' can only be instantiated `var view = fruitmachine(layout)` no longer via `fruitmachine.View`.
  * add event hooks on `View` for `'tojson'` and `'inflation'`
  * add events to `fruitmachine` namespace to allow `fruitmachine.on('inflation')`