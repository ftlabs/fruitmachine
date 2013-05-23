## Introduction

FruitMachine is used to assemble nested views from defined modules. It can be used solely on the client, server (via Node), or both. Unlike other solutions, FruitMachine doesn't try to architect your application for you, it simply provides you with the tools to assemble and communicate with your view modules.

#### What is a 'module'?

When referring to a module we mean a reusable UI component. For example let's use the common 'tabbed container' component as an example module.

Our tabbed container needs some markup, some styling and some basic JavaScript interactions. We might want to use this module in two different places within our app, but we don't want to have to write the markup, the styling or the interaction logic twice. When writing modular components we only have to write things once!

#### What is a 'layout'?

As far as FruitMachine is concerned there is no difference between layouts and modules, all modules are the same; they are a piece of the UI that has a template, maybe some interaction logic, and perhaps holds some child modules.

When we talk about layout modules we are referring to the core page scaffolding; a module that usually fills the page, and defines gaps for other modules to sit in.

#### Comparisons with the DOM

A collection of FruitMachine modules is like a simplified DOM tree. Like elements, modules have properties, methods and can hold children. There is no limit to how deeply nested modules can be. When an event is fired on a module (`apple.fire('somethinghappened');`, it will bubble right to top of the structure, just like DOM events.

#### What about my data/models?

FruitMachine tries to stay as far away from your data as possible, but of course each module must have data associated with it, and FruitMachine must be able to drop this data into the module's template.

FruitMachine comes with it's own Model class (`fruitmachine.Model`) out of the box, just in case you don't have you own; but we have built FruitMachine such that you can use your own types of Model should you wish. FruitMachine just requires you model to have a .`toJSON()` method so that it send its data into the module's template.

#### What templating language does it use?

FruitMachine doesn't care what type of templates you are using, it just expects to be given a function that will return a string. FruitMachine will pass any model data associated with the model as the first argument to this function. This means you can use any templates you like! We like to use [Hogan](http://twitter.github.io/hogan.js/).
