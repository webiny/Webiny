const Webiny = require('webiny-cli/lib/webiny');
const chalk = require('chalk');
const yaml = require('js-yaml');
const _ = require('lodash');

class InstallApps {
    run(config) {
        return new Promise(resolve => {
            try {
                Webiny.info('Installing ' + chalk.cyan(config.name) + '...');
                if (config.packagist && config.packagist !== '') {
                    Webiny.shellExecute('composer require ' + config.packagist);
                } else {
                    Webiny.shellExecute('cd ' + Webiny.projectRoot('Apps') + ' && git clone --depth=1 ' + config.repository);
                }
                // Activate app in Application.yaml
                const applicationConfig = Webiny.projectRoot('Configs/Base/Application.yaml');
                const appConfig = yaml.safeLoad(Webiny.readFile(applicationConfig));
                const apps = _.get(appConfig, 'Apps', {});
                apps[config.name] = true;
                appConfig.Apps = apps;
                Webiny.writeFile(applicationConfig, yaml.safeDump(appConfig, {indent: 4}));
                // Execute an app installer to install demo data, indexes, etc.
                Webiny.shellExecute('php ' + Webiny.projectRoot('Apps/Webiny/Php/Cli/install.php') + ' ' + config.name);
                Webiny.success(chalk.cyan(config.name) + ' installation finished!');
                resolve(config.name);
            } catch (e) {
                Webiny.failure('Failed to install ' + chalk.cyan(config.name) + '!');
                console.log(e);
                resolve();
            }
        });
    }
}

module.exports = InstallApps;