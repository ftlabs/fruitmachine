

var templateLayoutB = function(data){
	return "<div class='layout-b_header'>" + (data[1]||'') + "</div>" +
	"<div class='layout-b_content'>" +
		"<div class='layout-b_body'>" +
			"<div class='layout-b_child-2'>" + (data[2]||'') + "</div>" +
			"<div class='layout-b_child-3'>" + (data[3]||'') + "</div>" +
		"</div>" +
	"</div>";
};