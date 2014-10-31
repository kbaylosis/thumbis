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
		secretKey : "---SECRET_KEY---",

		/**
		 * API version
		 */
		apiVersion : "2012-09-25"
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
		bucket : "miimove-thumbnails",

		/**
		 * Server region
		 */
		region : "us-east-1"
	},
	
	/**
	 * Cloudfront config
	 */
	cloudfront : {
		/**
		 * Cloudfront url
		 */
		url : "https://dzbg8ac69eg2r.cloudfront.net",
	}
};
