# fruitmachine

A modular view layout manager for client and server.

The main advantages of FruitMachine over Backbone:
- No deps
- Can be retrofitted into a parts of a legacy system, it's not a religion
- Serverside has been considered from the start
- It doesn't care how you manage your data
- Modules are designed to be reused in multiple contexts, you create layouts, not fixed views
- A little more structured than Backbone

## Usage

## API

### View();

View constructor



### View#add();

Adds a child view(s) to another View.

Options:

 - `at` The child index at which to insert
 - `inject` Injects the child's view element into the parent's

### View#injectElement();

Injects an element into the
View's root element.

By default the element is appended
but then

Options:

 - `at` The index at which to insert.

### View#id();

Returns a decendent module
by id, or if called with no
arguments, returns this view's id.

*Example:*

    myView.id();
    //=> 'my_view_id'

    myView.id('my_other_views_id');
    //=> View

### View#module();

Returns the first descendent
View with the passed module type.
If called with no arguments the
View's own module type is returned.

*Example:*

    // Assuming 'myView' has 3 descendent
    // views with the module type 'apple'

    myView.modules('apple');
    //=> View

### View#modules();

Returns a list of descendent
Views that match the module
type given (Similar to
Element.querySelectorAll();).

*Example:*

    // Assuming 'myView' has 3 descendent
    // views with the module type 'apple'

    myView.modules('apple');
    //=> [ View, View, View ]

### View#child();

Returns the first child
view that matches the query.

*Example:*

    var child = view.child(<id>);
    var child = view.child(<module>);

### View#children();

Allows three ways to return
a view's children and direct
children, depending on arguments
passed.

*Example:*

    // Return all direct children
    view.children();

    // Return all children that match query.
    view.children('orange');

### View#each();

Calls the passed function
for each of the view's
children.

*Example:*

    myView.each(function(child) {
        // Do stuff with each child view...
    });

### View#toHTML();

Templates the view, including
any descendent views returning
an html string. All data in the
views model is made accessible
to the template.

Child views are printed into the
parent template by `id`. Alternatively
children can be iterated over a a list
and printed with `{{{child}}}}`.

*Example:*

    <div class="slot-1">{{{id_of_child_1}}}</div>
    <div class="slot-2">{{{id_of_child_2}}}</div>

    // or

    {{#children}}
        {{{child}}}
    {{/children}}

### View#render();

Renders the view and replaces
the `view.el` with a freshly
rendered node.

Fires a `render` event on the view.

### View#setup();

Sets up a view and all descendent
views.

Setup will be aborted if no `view.el`
is found. If a view is already setup,
teardown is run first to prevent a
view being setup twice.

Your custom `onSetup()` method is called
and a `setup` event is fired on the view.

### View#teardown();

Tearsdown a view and all descendent
views that have been setup.

Your custom `onTeardown` method is
called and a `teardown` event is fired.

### View#destroy();

Completely destroys a view. This means
a view is torn down, removed from it's
current layout context and removed
from the DOM.

Your custom `onDestroy` method is
called and a `destroy` event is fired.

### View#remove();

Removes the View's element
from the DOM.



### View#empty();

Destroys all children.



### View#data();

A single method for getting
and setting view data.

*Example:*

    // Getters
    var all = view.data();
    var one = view.data('myKey');

    // Setters
    view.data('myKey', 'my value');
    view.data({
        myKey: 'my value',
        anotherKey: 10
    });

### View#inject();

Empties the destination element
and appends the view into it.



### View#appendTo();

Appends the view element into
the destination element.



### View#toJSON();

Returns a JSON represention of
a FruitMachine View. This can
be generated serverside and
passed into new FruitMachine(json)
to inflate serverside rendered
views.



### View#trigger();

Proxies the standard Event.trigger
method so that we can add bubble
functionality.

Options:

 - `propagate` States whether the event should bubble through parent views.



### Model#get();

Gets a value by key

If no key is given, the
whole model is returned.


## License
Copyright (c) 2012 Wilson Page
Licensed under the MIT license.