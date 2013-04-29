
var templateList = function(data) {
	var string = '';
	var l = data.children.length;
	for (var i = 0; i < l; i++) string += data.children[i].child;
	return string;
};