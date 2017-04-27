const utils = require('webiny/lib/utils');
const path = require('path');

module.exports = (config) => {
    config.resolve.alias['webiny-lodash'] = path.resolve(utils.projectRoot(), 'Apps/Core/Js/Webiny/Vendors/Lodash');
    config.entry['bootstrap'] = ['./Bootstrap'];

    return config;
};