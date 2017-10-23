const Menu = require('webiny-cli/lib/menu');
const Plugin = require('webiny-cli/lib/plugin');

class Exit extends Plugin {
    getMenu() {
        return new Menu('Exit').addLineBefore().setOrder(0);
    }

    runTask() {
        return process.exit(0);
    }
}

Exit.task = 'exit';

module.exports = Exit;