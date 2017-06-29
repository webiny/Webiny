const Menu = require('webiny/lib/menu');
const Plugin = require('webiny/lib/plugin');

class Exit extends Plugin {
    constructor(program) {
        super(program);

        this.task = 'exit';
        this.selectApps = false;
    }

    getMenu() {
        return new Menu('Exit').addLineBefore();
    }

    runTask() {
        return process.exit(0);
    }
}

module.exports = Exit;