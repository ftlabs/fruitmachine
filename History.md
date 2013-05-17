0.4.0 / 2013-05-17
==================

  * change `slot` now defines placement over `id`
  * change `children` can now be an object (keys as `slot`) or an array.
  * change `id` is optional, used only for queries.
  * change 'LazyViews' can only be instantiated `var view = fruitmachine(layout)` no longer via `fruitmachine.View`.
  * add event hooks on `View` for `'tojson'` and `'inflation'`
  * add events to `fruitmachine` namespace to allow `fruitmachine.on('inflation')`