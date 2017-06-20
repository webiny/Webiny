const Plugin = require('webiny/lib/plugin');
const Menu = require('webiny/lib/menu');
const Task = require('./task');

class Develop extends Plugin {
    constructor(program) {
        super(program);

        this.task = 'develop';
    }

    getMenu() {
        return new Menu('Develop! (watches for file changes and rebuilds apps for you)').addLineBefore();
    }

    runTask(config, onFinish) {
        process.env.NODE_ENV = 'development';
        const task = new Task(config);
        return task.run();
    }
}

module.exports = Develop;