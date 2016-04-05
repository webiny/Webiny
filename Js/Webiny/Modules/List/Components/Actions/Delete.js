export default function deleteAction(callback) {
    const config = {};

    const exec = function () {
        return callback(config.id).then(data => {
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

    return (id) => {
        config.id = id;
        return _.assign(exec, mixin);
    };
}