var gm = require("gm");
var fs = require("graceful-fs");
var _ = require("underscore");
_.str = require('underscore.string');
_.mixin(_.str.exports()); 
var AWS = require("aws-sdk");
var url = require("url");
var async = require("async");
var mime = require("mime-types");

var config = require("../config");

function splitUrl(url) {
	console.log(url);
	var urlFrag = decodeURIComponent(url).split("/");
	console.log(urlFrag);
	
	for (var i = 0; i < urlFrag.length; i++) {
		urlFrag[i] = urlFrag[i].trim();
	}

	return urlFrag;
}

function parseActions(urlFrag) {
	var fSign = "$";
	var actions = {};
	for (var i = 0; i < urlFrag.length; i++) {
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

	console.log(actions);
	return actions;
}

function getObject(s3, options, pathname, actions, cb) {
	console.log("Retrieving object... ");
	console.log(options);
	
	s3.getObject(options, function(err, data) {
		if (err) {
			return cb(err);
		}

		console.log("Object received.");
		cb(null, s3, options, pathname, actions, data.Body);
	});
}

function processImage(s3, options, pathname, actions, buffer, cb) {
	console.log("Processing image...");
	var file = gm(buffer, actions.path[actions.path.length - 1]); 
	console.log("Operations to be performed: ");
	console.log(actions);
	_.each(actions, function(value, key, list) {
		if (key === "path") {
			return;
		}

		console.log("Performing " + key + " : " + value);
		file = file[key].apply(file, value); 
	});

	file.toBuffer(function(err, buffer) {
		if (err) {
			return cb(err);
		}

		console.log("Done!");
		cb(null, s3, options, pathname, buffer);
	});
}

function putObject(s3, options, pathname, buffer, cb) {
	console.log("Uploading image...");

	options.ACL = "public-read";
	options.Key = pathname;
	options.Body = buffer;
	options.ContentType = mime.lookup(pathname); 
	console.log(options);
	s3.putObject(options, function(err, data) {
		if (err) {
			return cb(err);
		}

		console.log("Done!");
		cb(null, data, buffer);
	});
}

/* GET home page. */
var thumby = function(urlStr, cb) {
	console.log("Starting thumby process");

	var pathname = url.parse(urlStr).pathname.trim();
	if (pathname[0] === "/") {
		pathname = pathname.slice(1);
	}

	var actions = parseActions(splitUrl(pathname));	
	if (!actions.path) {
		return cb("Missing pathname of image.");
	}

	var ops = async.seq(getObject, processImage, putObject);
	ops(new AWS.S3({
		region : config.s3.region,
		accessKeyId : config.aws.accessKey, 
		secretAccessKey : config.aws.secretKey,
		apiVersion : config.aws.apiVersion
	}), {
		Bucket : config.s3.bucket,
		Key : actions.path.join("/")
	}, 
	pathname,
	actions,
	function(err, data, buffer) {
		if (err) {
			return cb(err);
		}

		console.log(data);
		console.log("Processing all done!");
		cb(null, pathname, buffer);
	});
};

module.exports = thumby;
