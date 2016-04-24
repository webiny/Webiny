export default function executeAction(callback) {
    const config = {};

    const exec = function exec() {
        return callback(config.httpMethod, config.url, config.body, config.query).then(apiResponse => {
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

    return (httpMethod, url, body, query) => {
        _.assign(config, {httpMethod, url, body, query});
        return _.assign(exec, mixin);
    };
}