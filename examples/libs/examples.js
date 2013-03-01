var outputEl = document.createElement('ul');
outputEl.className = 'output';

// Inject the output console html
document.body.appendChild(outputEl);

/**
 * Inserts a new output item into
 * the output console.
 *
 * @param  {String} string
 * @return void
 */
function log(string) {
	outputEl.insertAdjacentHTML('beforeend', '<li>' + string + '</li>');
}