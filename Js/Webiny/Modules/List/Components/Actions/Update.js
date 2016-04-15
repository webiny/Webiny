export default function updateAction(callback) {
    const config = {};

    const exec = function exec() {
        return callback(config.id, config.data).then(data => {
            if (config.then) {
                return config.then(data);
            }

            return data;
        });
    };

    const mixin = {
        then: (fn) => {
            config.then = fn;
            return exec;
        }
    };

    return (id, data) => {
        config.id = id;
        config.data = data;
        return _.assign(exec, mixin);
    };
}