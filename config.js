/*jslint node: true */
"use strict";

/**
 * The project's config file
 * @module config
 */
module.exports = {

	/**
	 * AWS config
	 */
	aws : {
		/**
		 * S3 Access Key
		 */
		accessKey : "---ACCESS_KEY---", 
		
		/**
		 * S3 Secret Key
		 */
		secretKey : "---SECRET_KEY---"
	},

	/**
	 * S3 config
	 */
	s3 : {
		/**
		 * S3 url
		 */
		url : "https://[bucket-name].s3.amazonaws.com",

		/**
		 * S3 url bucket param
		 */
		bucketParam : "[bucket-name]",

		/**
		 * S3 bucket
		 */
		bucket : "---bucket-name---",

		/**
		 * Server region
		 */
		region : "us-east-1",

		/**
		 * API version
		 */
		apiVersion : "2012-09-25"
	}
};
