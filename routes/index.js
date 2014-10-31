var express = require("express");
var router = express.Router();
var config = require("../config");
var thumby = require("../thumby/thumby");

router.use(function(req, res) {
	thumby(req.url, function(err, pathname) {
		if (err) {
			console.log(err, err.stack);
			return res.send(404);
		}
		
		res.redirect([config.cloudfront.url, pathname].join("/"));
	});
});

module.exports = router;
