export default function deleteAction(callback) {
    const config = {};

    const exec = function () {
        return callback(config.id).then(data => {
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

    return (id) => {
        config.id = id;
        return _.assign(exec, mixin);
    };
}