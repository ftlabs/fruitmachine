# fruitmachine

Assembles dynamic views on the client and server.
## Documentation

### View();

<p>View constructor</p>

### create();

<p>Creates a new FruitMachine view<br />using the options passed.</p>

### View#trigger();

<p>Proxies the standard Event.trigger<br />method so that we can add bubble<br />functionality.</p>

### View#id();

<p>Returns a decendent module<br />by id, or if called with no<br />arguments, returns this view's id.</p>

### View#child();

<p>Returns the first child<br />view that matches the query.</p>

### View#children();

<p>Allows three ways to return<br />a view's children and direct<br />children, depending on arguments<br />passed.</p>

### View#each();

<p>Calls the passed function<br />for each of the view's<br />children.</p>

### View#remove();

<p>Removes the View's element<br />from the DOM.</p>

### View#empty();

<p>Destroys all children.</p>

### View#closestElement();

<p>Returns the closest root view<br />element, walking up the chain<br />until it finds one.</p>

### View#getElement();

<p>Returns the View's root element.</p>

### View#setElement();

<p>Sets a root element on a view.<br />If the view already has a root<br />element, it is replaced.</p>

### View#purgeElementCaches();

<p>Recursively purges the<br />element cache.</p>

### View#data();

<p>A single method for getting<br />and setting view data.</p>

### View#inDOM();

<p>Detects whether a view is in<br />the DOM (useful for debugging).</p>

### View#toNode();

<p>Templates the whole view and turns<br />it into a real node.</p>

### View#inject();

<p>Empties the destination element<br />and appends the view into it.</p>

### View#appendTo();

<p>Appends the view element into<br />the destination element.</p>

### View#toJSON();

<p>Returns a JSON represention of<br />a FruitMachine View. This can<br />be generated serverside and<br />passed into new FruitMachine(json)<br />to inflate serverside rendered<br />views.</p>

### Model#get();

<p>Gets a value by key</p>

### module();

<p>Creates and registers a<br />FruitMachine view constructor.</p>

### clear();

<p>Removes a module<br />from the module store.</p>

### helper();

<p>Registers a helper</p>

### clear();

<p>Clears one or all<br />registered helpers.</p>

### templates();

<p>Registers templates, or overwrites<br />the <code>getTemplate</code> method with a<br />custom template getter function.</p>

### getTemplate();

<p>The default get template method<br />if FruitMachine.template is passed<br />a function, this gets overwritten<br />by that.</p>

### clear();

<p>Clear reference to a module's<br />template, or clear all template<br />references and resets the template<br />getter method.</p>

### FruitMachine();

<p>The main library namespace doubling<br />as a convenient alias for creating<br />new views.</p>


## License
Copyright (c) 2012 Wilson Page
Licensed under the MIT license.