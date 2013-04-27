var jsConsole = document.createElement('div');
var list = document.createElement('ul');

jsConsole.className = 'js-console';
jsConsole.appendChild(list);

// Inject the output console html
document.body.appendChild(jsConsole);

createInput();

/**
 * Inserts a new output item into
 * the output console.
 *
 * @param  {String} string
 * @return void
 */
function log(string) {
	list.insertAdjacentHTML('beforeend', '<li>' + string + '</li>');
}

function exec(command) {
	var output = eval(command.replace('var', ''));
	if (console && console.log) console.log(output);
	log(command + '<br/><i>>> ' + output + '</i>');
}

function createInput() {
	var form = document.createElement('form');
	var field = document.createElement('input');

	field.type = 'text';
	field.placeholder = 'playground console...';
	form.appendChild(field);

	field.focus();

	form.addEventListener('submit', function(event) {
		event.preventDefault();
		var val = field.value;
		field.value = '';
		exec(val);
	});

	jsConsole.appendChild(form);
	field.focus();
}


