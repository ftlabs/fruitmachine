
var template = Hogan.compile(document.getElementById('template-layout').innerHTML);

var Layout = FruitMachine.define({
	module: 'layout',
	template: template
});