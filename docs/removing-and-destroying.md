## Destroying and removing

Eventually a module has to be destroyed. To do this you simply call `mymodule.destroy()`. This does more than just run your module's defined `destroy` logic. When destroy is called on a module it recursively calls `.destroy()` on any descendant modules (from the bottom up).

**Destroy does the following:**

1. It runs `.teardown()` to undo any setup logic.
2. It removes the module from any module it may be nested inside.
3. It removes the module from the DOM.
4. It runs your module's custom destroy logic.
5. It fires a `destroy` event hook.
6. It sets `module.destroyed` to `true` (useful for checking for destroyed views).
7. It calls `module.off()` to unbind all event listeners.

**NOTE:** Once a module module has been destroyed, it cannot be brought back to life. Like `initialize`, `destroy` can only happen once in the lifetime of a module module.

#### Just removing

You may just want to remove a module from it's current context and drop it somewhere else, without actually destroying it. In this case you will want to use `.remove()`.

Remove will:

- Remove a module from from any module it may be nested inside.
- Remove the module's element (`.el`) from the DOM (if applicable), unless the called with `{ fromDOM: false }`.