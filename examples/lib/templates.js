
var templates = {};

templates.layout = Hogan.compile(
	"<div class='layout_header'>{{{title}}}</div>" +
	"<div class='layout_content'>" +
		"<div class='layout_list'>{{{uniqueId1}}}</div>" +
		"<div class='layout_body'>{{{uniqueId2}}}</div>" +
	"</div>"
);

templates.apple = Hogan.compile(
	"{{#items}}" +
		"<div class='apple-item' data-id='{{articleId}}'>{{title}}</div>" +
	"{{/items}}"
);

templates.orange = Hogan.compile(
	"<div class='orange_date'>{{date}}</div>" +
	"<div class='orange_title'>{{title}}</div>" +
	"<div class='orange_body'>{{{body}}}</div>" +
	"<div class='orange_byline'>by {{author}}</div>"
);

