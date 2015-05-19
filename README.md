# thumbis.js
An opensource node-based thumbnailer server built for the Amazon S3 and CloudFront. It is running on top [gm.js](http://aheckmann.github.io/gm/).

## Standard Usage
The gist of performing thumbnail requests to the server is as follows:

```
http://<server>/$resize/<width>/<height>/$path/<path of the image in the S3 bucket (excluding the bucket name)>
```

Example:
Resize the image to 100x100.

http://d1abpi12089u098.cloudfront.net/$resize/100/100/$path/image.png

## Other Uses

Note that you can perform other functions that [gm.js](http://aheckmann.github.io/gm/) supports. 

### Resize and Flip the image
Resize the image to 100x100 then flip it.
http://d1abpi12089u098.cloudfront.net/$resize/100/100/$flip/$path/image.png

### Crop the image
Crops a 50x50 image at (0,0).
http://d1abpi12089u098.cloudfront.net/$crop/50/50/0/0/$path/image.png

### There are more
Please read the [gm.js documentation](http://aheckmann.github.io/gm/docs.html), and try them out! 
Just remember that the url pattern is '$' prefix + gm function + parameters separated by forward slashes.

So for the border function that has the following spec:

```javascript
gm("img.png").crop(width, height, x, y)
```

It can be translated to...

```javascript
$crop/<width>/<height>/<x>/<y>/$path/img.png
```

## How to Setup
1. Create an S3 bucket and set it as follows:
	* Set its permissions to allow Read/Write using a certain IAM user
2. Create a load balancer.
3. Create a Cloud Front web distribution and set it as follows:
	* Create an origin pointing to the S3 bucket in (1). Ensure that it is allowed access to that bucket.
	* Create an origin pointing to the load balancer in (2)
	* Create the following Behaviours in exactly the order below:
		- ‘\*\*/\*’ - load balancer in (2)
		- ‘\*\*/\*.jpg’ - S3 bucket in (1)
		- ‘\*\*/\*.png’ - S3 bucket in (1)
		- ‘\*\*/\*.jpeg’ - S3 bucket in (1)
4. Create a stack in ops-works for the thumb system
5. Create a Node.js App Server using the load balancer in item (1).
6. Specify the ‘graphicsmagick’ package under the OS Packages of the Node.js App Server layer.
7. Create at least one instance with the following specs:
	Size : t2.small or higher
	Operating System : Ubuntu 14.x7.
8. Create an app for thumbis with the following settings:
	* Repository URL : git@github.com:kbaylosis/thumbis.git
	* Environment Variables :
		- PORT = 80
		- THUMBIS_S3KEY = AWS S3 Access Key
		- THUMBIS_S3SECRET = AWS S3 Secret Key
		- THUMBIS_BUCKETS = AWS S3 Bucket Array i.e. ["bucketA", "bucketB", "bucketC"]
		- THUMBIS_REGION = AWS Bucket region
		- THUMBIS_CFURL = AWS CloudFront distribution url
9. Deploy the app.
10. You may now upload files directly to S3 and read it using the Cloudfront distribution with a thumbnailing capability.

