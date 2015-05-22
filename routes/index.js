var express = require("express");
var router = express.Router();
var mime = require("mime-types");

var config = require("../config");
var thumbis = require("../thumbis/thumbis");

router.use(function(req, res) {
	thumbis(req.url, function(err, pathname, buffer) {
		if (err) {
			console.log(err, err.stack);
			return res.send(404);
		}
		
		res.set({
			"Content-Type" : mime.lookup(pathname)
		});

		res.send(buffer);
	});
});

module.exports = router;
