const Plugin = require('webiny/lib/plugin');
const Task = require('./task');

class Develop extends Plugin {
    constructor(program) {
        super(program);

        this.task = 'develop';
        this.title = 'Develop! (watches for file changes and rebuilds apps for you)';
    }

    runTask(config, onFinish) {
        process.env.NODE_ENV = 'development';
        const task = new Task(config);
        return task.run();
    }
}

module.exports = Develop;