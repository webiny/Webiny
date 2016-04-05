export default function executeAction(callback) {
    const config = {};

    const exec = function () {
        return callback(config.httpMethod, config.method, config.body, config.query).then(apiResponse => {
            if (config.then) {
                return config.then(apiResponse);
            }
            return apiResponse;
        });
    };

    const mixin = {
        body: body => {
            config.body = body;
            return exec;
        },

        query: query => {
            config.query = query;
            return exec;
        },

        then: (fn) => {
            config.then = fn;
            return exec;
        }
    };

    return (httpMethod, method) => {
        config.httpMethod = httpMethod;
        config.method = method;
        return _.assign(exec, mixin);
    };
}