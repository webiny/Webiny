const Webiny = require('webiny-cli/lib/webiny');
const Menu = require('webiny-cli/lib/menu');
const Plugin = require('webiny-cli/lib/plugin');

class ServerHelp extends Plugin {
    constructor(program) {
        super(program);

        this.selectApps = false;

        program
            .command('server-help')
            .description('Show server setup help.')
            .action(() => {
                Webiny.runTask('server-help');
            }).on('--help', () => {
            console.log();
            console.log('  Examples:');
            console.log();
            console.log('    $ webiny-cli server-help');
            console.log();
        });
    }

    getMenu() {
        return new Menu('View server setup overview');
    }

    runTask() {
        const Webiny = require('webiny-cli/lib/webiny');
        const chalk = require('chalk');

        const blue = chalk.blue;
        const cyan = chalk.cyan;
        const magenta = chalk.magenta;
        const white = chalk.white;
        const grey = chalk.grey;
        const help = [];

        Webiny.exclamation('\nMake sure you are able to ssh into your remote server without password! (HINT: setup an SSH key)');

        Webiny.info('\nThis is the server folder structure created by our deploy process:');
        help.push(blue('~/www'));
        help.push(white('|-- ') + blue('files') + grey("\t// folder containing static files (e.g. uploads, temp, etc.)"));
        help.push(white('|   `-- ') + blue('production'));
        help.push(white('|-- ') + blue('logs') + grey("\t// folder containing your web server log files"));
        help.push(white('|   `-- yoursite-prod-error.log'));
        help.push(white('|--') + blue('active') + grey('\t// links to active releases. Web server hosts should point here.'));
        help.push(white('|   |-- ') + cyan('production') + white(' -> ') + blue('releases/release-20160719-090143'));
        help.push(white('`-- ') + blue('releases') + grey("\t// folder containing all deployed releases"));
        help.push(white('    |-- ') + blue('release-20160706-090143'));
        help.push(white('    |-- ') + blue('release-20160706-105214'));
        help.push(white('    `-- ') + blue('release-20160706-112349'));

        Webiny.log('----------------------------------------');
        Webiny.log(help.join("\n"));
        Webiny.log('----------------------------------------');

        Webiny.info('\nPoint your web server to one of the following:');
        Webiny.log('  - ' + magenta('~/www/active/production/public_html'));

        return Promise.resolve();
    }
}

ServerHelp.task = 'server-help';

module.exports = ServerHelp;