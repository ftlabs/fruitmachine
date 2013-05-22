
var Apple = fruitmachine.define({
  module: 'apple',
  template: function(){ return 'I am an apple'; }
});

var Layout = fruitmachine.define({
  module: 'layout',
  template: function(data){ return data.child1; }
});

var layout = new Layout();
var apple = new Apple({ id: 'child1' });

layout
	.add(apple)
	.render()
	.inject(document.body);