# API

### fruitmachine.define()

Defines a module.
\nOptions:

 - `name {String}` the name of the module
 - `tag {String}` the tagName to use for the root element
 - `classes {Array}` a list of classes to add to the root element
 - `template {Function}` the template function to use when rendering
 - `helpers {Array}` a list of helpers to apply to the module
 - `initialize {Function}` custom logic to run when module instance created
 - `setup {Function}` custom logic to run when `.setup()` is called (directly or indirectly)
 - `teardown {Function}` custom logic to unbind/undo anything setup introduced (called on `.destroy()` and sometimes on `.setup()` to avoid double binding events)
 - `destroy {Function}` logic to permanently destroy all references

### Module#Module

Module constructor
\nOptions:

 - `id {String}` a unique id to query by
 - `model {Object|Model}` the data with which to associate this module
 - `tag {String}` tagName to use for the root element
 - `classes {Array}` list of classes to add to the root element
 - `template {Function}` a template to use for rendering
 - `helpers {Array}`a list of helper function to use on this module
 - `children {Object|Array}` list of child modules

### Module#add()

Adds a child view(s) to another Module.
\nOptions:

 - `at` The child index at which to insert
 - `inject` Injects the child's view element into the parent's
 - `slot` The slot at which to insert the child

### Module#remove()

Removes a child view from
its current Module contexts
and also from the DOM unless
otherwise stated.
\nOptions:

 - `fromDOM` Whether the element should be removed from the DOM (default `true`)

*Example:*

    // The following are equal
    // apple is removed from the
    // the view structure and DOM
    layout.remove(apple);
    apple.remove();

    // Apple is removed from the
    // view structure, but not the DOM
    layout.remove(apple, { el: false });
    apple.remove({ el: false });

### Module#id()

Returns a decendent module
by id, or if called with no
arguments, returns this view's id.
\n*Example:*

    myModule.id();
    //=> 'my_view_id'

    myModule.id('my_other_views_id');
    //=> Module

### Module#module()

Returns the first descendent
Module with the passed module type.
If called with no arguments the
Module's own module type is returned.
\n*Example:*

    // Assuming 'myModule' has 3 descendent
    // views with the module type 'apple'

    myModule.modules('apple');
    //=> Module

### Module#modules()

Returns a list of descendent
Modules that match the module
type given (Similar to
Element.querySelectorAll();).
\n*Example:*

    // Assuming 'myModule' has 3 descendent
    // views with the module type 'apple'

    myModule.modules('apple');
    //=> [ Module, Module, Module ]

### Module#each()

Calls the passed function
for each of the view's
children.
\n*Example:*

    myModule.each(function(child) {
        // Do stuff with each child view...
    });

### Module#toHTML()

Templates the view, including
any descendent views returning
an html string. All data in the
views model is made accessible
to the template.
\nChild views are printed into the
parent template by `id`. Alternatively
children can be iterated over a a list
and printed with `{{{child}}}}`.

*Example:*

    <div class="slot-1">{{{<slot>}}}</div>
    <div class="slot-2">{{{<slot>}}}</div>

    // or

    {{#children}}
        {{{child}}}
    {{/children}}

### Module#render()

Renders the view and replaces
the `view.el` with a freshly
rendered node.
\nFires a `render` event on the view.

### Module#setup()

Sets up a view and all descendent
views.
\nSetup will be aborted if no `view.el`
is found. If a view is already setup,
teardown is run first to prevent a
view being setup twice.

Your custom `setup()` method is called

Options:

 - `shallow` Does not recurse when `true` (default `false`)

### Module#teardown()

Tearsdown a view and all descendent
views that have been setup.
\nYour custom `teardown` method is
called and a `teardown` event is fired.

Options:

 - `shallow` Does not recurse when `true` (default `false`)

### Module#destroy()

Completely destroys a view. This means
a view is torn down, removed from it's
current layout context and removed
from the DOM.
\nYour custom `destroy` method is
called and a `destroy` event is fired.

NOTE: `.remove()` is only run on the view
that `.destroy()` is directly called on.

Options:

 - `fromDOM` Whether the view should be removed from DOM (default `true`)

### Module#empty()

Destroys all children.
\nIs this needed?

### Module#inject()

Empties the destination element
and appends the view into it.

### Module#appendTo()

Appends the view element into
the destination element.

### Module#toJSON()

Returns a JSON represention of
a FruitMachine Module. This can
be generated serverside and
passed into new FruitMachine(json)
to inflate serverside rendered
views.

### Module#on()

Registers a event listener.

### Module#fire()

Fires an event on a view.

