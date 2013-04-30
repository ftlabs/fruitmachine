## Removing and destroying views

Eventually a view will have to be destroyed. To do this you simply call `myview.destroy()`. This does more than just run your view's defined `destroy` method. When destroy is called on a view it recursively calls `.destroy()` on any descendant views (from the bottom up).

**Destroy does the following:**

1. It runs `.teardown()` to undo any setup logic.
2. It removes the view module from any view it may be nested inside.
3. It removes the view from the DOM.
4. It fires a `destroy` event hook.
5. It sets `view.destroyed` to `true` (useful for checking for destroyed views).
6. It calls `view.off()` to unbind all event listeners.

**NOTE:** Once a view module has been destroyed, it cannot be brought back to life. Like `initialize`, `destroy` can only happen once in the lifetime of a view module.

#### Just removing

You may just want to remove a view from it's current context and drop it somewhere else, without actually destroying it. In this case you will want to use `.remove()`.

Remove will:

- Remove a module from from any view it may be nested inside.
- Remove the module's element (`.el`) from the DOM (if applicable), unless the called with `{ fromDOM: false }`.