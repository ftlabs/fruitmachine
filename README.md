# fruitmachine

Assembles dynamic views on the client and server.
## Documentation

### View();

<p>View constructor</p>

### create();

<p>Creates a new FruitMachine view using the options passed.</p>

### View#trigger();

<p>Proxies the standard Event.trigger method so that we can add bubble functionality.</p>

### View#id();

<p>Returns a decendent module by id, or if called with no arguments, returns this view's id.</p>

### View#child();

<p>Returns the first child view that matches the query.</p>

### View#children();

<p>Allows three ways to return a view's children and direct children, depending on arguments passed.</p>

### View#each();

<p>Calls the passed function for each of the view's children.</p>

### View#remove();

<p>Removes the View's element from the DOM.</p>

### View#empty();

<p>Destroys all children.</p>

### View#closestElement();

<p>Returns the closest root view element, walking up the chain until it finds one.</p>

### View#getElement();

<p>Returns the View's root element.</p>

### View#setElement();

<p>Sets a root element on a view. If the view already has a root element, it is replaced.</p>

### View#purgeElementCaches();

<p>Recursively purges the element cache.</p>

### View#data();

<p>A single method for getting and setting view data.</p>

### View#inDOM();

<p>Detects whether a view is in the DOM (useful for debugging).</p>

### View#toNode();

<p>Templates the whole view and turns it into a real node.</p>

### View#inject();

<p>Empties the destination element and appends the view into it.</p>

### View#appendTo();

<p>Appends the view element into the destination element.</p>

### View#toJSON();

<p>Returns a JSON represention of a FruitMachine View. This can be generated serverside and passed into new FruitMachine(json) to inflate serverside rendered views.</p>

### Model#get();

<p>Gets a value by key</p>

### module();

<p>Creates and registers a FruitMachine view constructor.</p>

### clear();

<p>Removes a module from the module store.</p>

### helper();

<p>Registers a helper</p>

### clear();

<p>Clears one or all registered helpers.</p>

### templates();

<p>Registers templates, or overwrites the <code>getTemplate</code> method with a custom template getter function.</p>

### getTemplate();

<p>The default get template method if FruitMachine.template is passed a function, this gets overwritten by that.</p>

### clear();

<p>Clear reference to a module's template, or clear all template references and resets the template getter method.</p>

### FruitMachine();

<p>The main library namespace doubling as a convenient alias for creating new views.</p>


## License
Copyright (c) 2012 Wilson Page
Licensed under the MIT license.