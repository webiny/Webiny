const utils = require('webiny/lib/utils');
const path = require('path');

module.exports = (config) => {
    config.resolve.alias['webiny-lodash'] = path.resolve(utils.projectRoot(), 'Apps/Webiny/Js/Core/Vendors/Lodash');
    config.entry['bootstrap'] = ['./Bootstrap'];

    return config;
};