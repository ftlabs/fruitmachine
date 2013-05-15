
var templateList2 = Hogan.compile(
	"{{#collection}}" +
	  "<li class='list-2_item js-list_item' data-id='{{id}}'>{{title}}</li>" +
	"{{/collection}}"
);