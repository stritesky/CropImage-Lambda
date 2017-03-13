var errorHandling = require('./errorHandling');
var isUndefinedParameters = function() {
    return {
        isUndefined:function (context, checkUndefined, callback) {
            for(var i in checkUndefined){
                if (typeof checkUndefined[i] === 'undefined'){
                    var errorHandlingObject  = errorHandling();
                    errorHandlingObject.error(context, 422, "undefined parameter "+i);
                    callback (false);
                    break;
                }
            }
            callback (true);
        }
    }
};
module.exports = isUndefinedParameters;