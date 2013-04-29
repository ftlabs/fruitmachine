
var templateLayoutA = Hogan.compile(
	"<div class='layout-a_header'>{{{child_1}}}</div>" +
	"<div class='layout-a_content'>" +
		"<div class='layout-a_list'>{{{child_2}}}</div>" +
		"<div class='layout-a_body'>{{{child_3}}}</div>" +
	"</div>"
);