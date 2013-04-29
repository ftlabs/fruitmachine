

var templateLayoutB = function(data){
	return "<div class='layout-b_header'>" + (data.child_1||'') + "</div>" +
	"<div class='layout-b_content'>" +
		"<div class='layout-b_body'>" +
			"<div class='layout-b_child-2'>" + (data.child_2||'') + "</div>" +
			"<div class='layout-b_child-3'>" + (data.child_3||'') + "</div>" +
		"</div>" +
	"</div>";
};