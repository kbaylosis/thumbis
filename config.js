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
		accessKey : process.env.THUMBIS_S3KEY || "---ACCESS_KEY---", 
		
		/**
		 * S3 Secret Key
		 */
		secretKey : process.env.THUMBIS_S3SECRET || "---SECRET_KEY---",

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
		 * S3 buckets
		 */
		buckets : process.env.THUMBIS_BUCKETS || ["---BUCKET---"],

		/**
		 * Server region
		 */
		region : process.env.THUMBIS_REGION || "---REGION---"
	},
	
	/**
	 * Cloudfront config
	 */
	cloudfront : {
		/**
		 * Cloudfront url
		 */
		url : process.env.THUMBIS_CFURL || "---CLOUDFRONT_URL---",
	}
};

