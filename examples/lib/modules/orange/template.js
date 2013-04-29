
var templateOrange = Hogan.compile(
	"<div class='orange_date'>{{date}}</div>" +
	"<div class='orange_title'>{{title}}</div>" +
	"<div class='orange_body'>{{{body}}}</div>" +
	"<div class='orange_byline'>by {{author}}</div>"
);