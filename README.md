# fruitmachine

Assembles dynamic views on the client and server.
## Documentation

### View();

View constructor



### create();

Creates a new FruitMachine view
using the options passed.

If a module parameter is passed
we attempt to find a registered
module of that name to intantiate,
else we use a default view instance.

### View#trigger();

Proxies the standard Event.trigger
method so that we can add bubble
functionality.

Options:

  - `propagate` States whether the event
     should bubble through parent views.

### View#id();

Returns a decendent module
by id, or if called with no
arguments, returns this view's id.



### View#child();

Returns the first child
view that matches the query.

Example:

  var child = view.child(<id>);
  var child = view.child(<module>);

### View#children();

Allows three ways to return
a view's children and direct
children, depending on arguments
passed.

Example:

  // Return all direct children
  view.children();

  // Return all children that match query.
  view.children('orange');

### View#each();

Calls the passed function
for each of the view's
children.



### View#remove();

Removes the View's element
from the DOM.



### View#empty();

Destroys all children.



### View#closestElement();

Returns the closest root view
element, walking up the chain
until it finds one.



### View#getElement();

Returns the View's root element.

If a cache is present it is used,
else we search the DOM, else we
find the closest element and
perform a querySelector using
the view._fmid.

### View#setElement();

Sets a root element on a view.
If the view already has a root
element, it is replaced.

IMPORTANT: All descendent root
element caches are purged so that
the new correct elements are retrieved
next time View#getElement is called.

### View#purgeElementCaches();

Recursively purges the
element cache.



### View#data();

A single method for getting
and setting view data.

Example:

  // Getters
  var all = view.data();
  var one = view.data('myKey');

  // Setters
  view.data('myKey', 'my value');
  view.data({
    myKey: 'my value',
    anotherKey: 10
  });

### View#inDOM();

Detects whether a view is in
the DOM (useful for debugging).



### View#toNode();

Templates the whole view and turns
it into a real node.



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



### Model#get();

Gets a value by key

If no key is given, the
whole model is returned.

### module();

Creates and registers a
FruitMachine view constructor.



### clear();

Removes a module
from the module store.

If no module key is passed
the entire store is cleared.

### helper();

Registers a helper



### clear();

Clears one or all
registered helpers.



### templates();

Registers templates, or overwrites
the `getTemplate` method with a
custom template getter function.



### getTemplate();

The default get template method
if FruitMachine.template is passed
a function, this gets overwritten
by that.



### clear();

Clear reference to a module's
template, or clear all template
references and resets the template
getter method.



### FruitMachine();

The main library namespace doubling
as a convenient alias for creating
new views.




## License
Copyright (c) 2012 Wilson Page
Licensed under the MIT license.