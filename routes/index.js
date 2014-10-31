var express = require("express");
var router = express.Router();
var gm = require("gm");
var fs = require("graceful-fs");
var _ = require("underscore");
_.str = require('underscore.string');
_.mixin(_.str.exports()); 
var AWS = require("aws-sdk");

var config = require("../config");

/* GET home page. */
router.use(function(req, res) {
	var fSign = "$";
	var urlFrag = decodeURIComponent(req.url).split("/");
	var i;

	for (i = 0; i < urlFrag.length; i++) {
		urlFrag[i] = urlFrag[i].trim();
	}

	var actions = {};
	for (i = 0; i < urlFrag.length; i++) {
		if (urlFrag[i] && urlFrag[i].length >= 1 && _.startsWith(urlFrag[i], fSign)) {
			var action = urlFrag[i].slice(1);
			var params = [];
			for (i++; i < urlFrag.length; i++) {
				if (_.startsWith(urlFrag[i], fSign)) {
					i--;
					break;
				}

				var param = urlFrag[i];
				if (!isNaN(param)) {
					param = Number(param);
				} else if (param.toLowerCase() === "true") {
					param = true;
				} else if (param.toLowerCase() === "false") {
					param = false;
				}

				params.push(param); 	
			}

			actions[action] = params;
		}
	}

	var key = actions.path.join("/");
	var s3 = new AWS.S3({
		region : config.s3.region,
		accessKeyId : config.aws.accessKey, 
		secretAccessKey : config.aws.secretKey
	});

	var options = {
		Bucket : "miimove-thumbnails",
		Key : key
	};

	console.log("Retrieving object... " + key);
	s3.getObject(options, function(err, data) {
		if (err) {
			console.log(err, err.stack);
			return res.send(500);
		}

		console.log("Object received.");
		fs.writeFile("./cache/qwerty.png", data.Body, function(err) {
			if (err) {
				console.log(err, err.stack);
				return res.send(500);
			} 

			console.log("Object cached...");
			var file = gm(data.Body, "thumbnail-00001.png"); 
			_.each(actions, function(value, key, list) {
				if (key === "path") {
					return;
				}

				console.log(key);
				console.log(value);

				file = file[key].apply(file, value); 
			});

			file.write("./cache/querty.out.png", function(err) {
				console.log(actions);

				console.log("Object processed...");
				if (err) {
					console.log(err, err.stack);
					return res.send(500);
				}

				options.ACL = "public-read";
				options.Key += "-resized/thumbnail.png";
				fs.readFile("./cache/querty.out.png", function(err, data) {
					console.log("Object ready for upload...");
					options.Body = data;
					console.log(options);
					s3.putObject(options, function(err, data) {
						if (err) {
							console.log(err, err.stack);
							return res.send(500);
						}

						console.log(data);
						console.log("Object sent...");
						res.send(actions);
					});
				});
			});
		});
	});
});

module.exports = router;
