var imageFunction = require('./library/image');
var imageFunctionObject  = imageFunction();
var checkParameters = require('./library/checkParameters');
var checkParametersObject = checkParameters();
var errorHandling = require('./library/errorHandling');
var errorHandlingObject  = errorHandling();
var fileType = require('file-type');



exports.crop = function(event, context) {
        bucketName = 'kurzor.article.example';

        if (event.body.data) {
            var checkUndefined = {
                "key":event.body.data.key,
                "x0":event.body.data.x0,
                "y0":event.body.data.y0,
                "w":event.body.data.w,
                "h":event.body.data.h
            };
            checkParametersObject.isUndefined(context, checkUndefined, function (callback) {
                if (callback) {
                    var key = event.body.data.key,
                        x0 = event.body.data.x0,
                        y0 = event.body.data.y0,
                        w = event.body.data.w,
                        h = event.body.data.h;
                    imageFunctionObject.getObject(context, bucketName, key, function (callback) {
                        if (callback) {
                            var ext = fileType(callback.Body) ? fileType(callback.Body).ext : '';
                            imageFunctionObject.crop(context, callback.Body, x0, y0, w, h, function (callback) {
                                if (callback) {
                                    imageFunctionObject.putObject(context, bucketName, callback, false, ext);
                                }
                            });
                        }
                    });
                } else {
                    errorHandlingObject.error(context, 422, "undefined parameters");
                }
            });
        }else{
            errorHandlingObject.error(context, 422, "undefined data");
        }
};
