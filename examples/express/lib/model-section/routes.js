var section = require('./server');

exports.get = function(req, res, next) {
	var id = req.params.id;
	section.get(id, function(err, data) {
		if (err) return next(err);
		res.json(data);
	});
};