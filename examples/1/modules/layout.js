
var template = Hogan.compile(document.getElementById('template-layout').innerHTML);

var Layout = FruitMachine.module({
	module: 'layout',
	template: template
});