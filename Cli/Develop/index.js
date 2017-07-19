const Plugin = require('webiny/lib/plugin');
const Menu = require('webiny/lib/menu');

class Develop extends Plugin {

    getMenu() {
        return new Menu('Develop! (watches for file changes and rebuilds apps for you)').addLineBefore();
    }

    runTask(config, onFinish) {
        const Task = require('./task');
        process.env.NODE_ENV = 'development';
        const task = new Task(config);
        return task.run();
    }
}

Develop.task = 'develop';

module.exports = Develop;