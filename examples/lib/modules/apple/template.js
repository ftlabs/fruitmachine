
var templateApple = Hogan.compile(
	"{{#items}}" +
		"<div class='apple-item' data-id='{{id}}'>{{title}}</div>" +
	"{{/items}}"
);