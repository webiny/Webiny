/**
 * This function serves as a configuration interface for the actual callback that will be execute when this function is invoked.
 * It's greatest benefit is that you can pass it to, for example, onClick callbacks, and it will be executed only when onClick is triggered.
 *
 * <Ui.Button onClick={actions.execute('GET', 'profile').then(this.showProfile)}/>
 *
 * @param callback
 * @returns {Function}
 */
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