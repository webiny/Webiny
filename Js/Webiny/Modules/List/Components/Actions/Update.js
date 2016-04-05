export default function updateAction(callback) {
    const config = {};

    const exec = function () {
        return callback(config.id, config.data).then(data => {
            if (config.done) {
                config.done(data);
            }
        });
    };

    const mixin = {
        done: (fn) => {
            config.done = fn;
            return exec;
        }
    };

    return (id, data) => {
        config.id = id;
        config.data = data;
        return _.assign(exec, mixin);
    };
}