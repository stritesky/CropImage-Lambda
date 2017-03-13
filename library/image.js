var checkParameters = require('./checkParameters');
var errorHandling = require('./errorHandling');
var errorHandlingObject  = errorHandling();
var gm = require('gm').subClass({ imageMagick: true });
var AWS = require('aws-sdk');
var s3 = new AWS.S3();

const TEMP = 'temp';

var imageFunction = function() {
    function stringGen(bucket, len, isTemp, ext, callback) {
        var text = "";
        var charset = "abcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < len; i++)
            text += charset.charAt(Math.floor(Math.random() * charset.length));
        var genKey = isTemp ? TEMP + '/' + text + '.' + ext : text + '.' + ext;

        s3.getObject({
            Bucket: bucket,
            Key: genKey
        }, function (err) {
            if (err) {
                return callback(genKey);
            } else {
                stringGen(bucket, len, isTemp, ext, function (call) {
                    return callback(call);
                });
            }
        });
    }

    return {
        getObject:function (context, bucket, keyTemp, callback ) {
            s3.getObject({
                Bucket: bucket,
                Key: keyTemp
            }, function (err, data) {
                if(err) {
                    errorHandlingObject.error(context, 404, err.message ? err.message : "Error getObject from S3.");
                    callback (false);
                }else{
                    callback (data);
                }
            });
        },
        putObject: function (context, bucket, buffer, isTemp, ext) {
            stringGen (bucket, 8, isTemp, ext, function (callback) {
                var key = callback;
                s3.putObject ({
                    ACL: 'public-read',
                    Bucket: bucket,
                    Key: key,
                    Body: buffer
                }, function(err) {
                    if (err) {
                        errorHandlingObject.error (context, 500, err.message ? err.message : "Error putObject to S3.");
                    }else {
                        var result =  {
                            status: "200",
                            message: "",
                            key: key,
                            link: bucket + '/' + key
                        };
                        context.done (null, result);
                    }
                });
            });
        },
        crop:function (context, body, x0, y0, w, h, callback) {
            gm(body)
                .format(function(err,format) {
                    if (err)  {
                        errorHandlingObject.error(context, 500, err);
                        callback (false);
                    } else {
                        this.crop(w, h, x0, y0);
                        this.toBuffer(format,function (err, buffer) {
                            if (err) {
                                errorHandlingObject.error(context, 500, err);
                                callback (false);
                            } else {
                                callback (buffer);
                            }
                        });
                    }
                });
        }
    }
};
module.exports = imageFunction;