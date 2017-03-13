var errorHandling = function() {
    return {
        error:function (context, status, message) {
            error = {
                status: status,
                message:message
            };
            context.fail(JSON.stringify(error));
        }
    }
};
module.exports = errorHandling;