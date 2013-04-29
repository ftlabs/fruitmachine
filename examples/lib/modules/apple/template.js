
var templateApple = Hogan.compile(
	"{{#items}}" +
		"<div class='apple-item' data-id='{{articleId}}'>{{title}}</div>" +
	"{{/items}}"
);