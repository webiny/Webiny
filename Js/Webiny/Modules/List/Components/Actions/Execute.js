export default function executeAction(callback) {
    const config = {};

    const exec = function () {
        return callback(config.httpMethod, config.method, config.body, config.query).then(apiResponse => {
            if (config.done) {
                config.done(apiResponse.getData());
            }
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

        done: (fn) => {
            config.done = fn;
            return exec;
        }
    };

    return (httpMethod, method) => {
        config.httpMethod = httpMethod;
        config.method = method;
        return _.assign(exec, mixin);
    };
}