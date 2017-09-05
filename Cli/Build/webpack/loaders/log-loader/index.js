'use strict';
const loaderUtils = require("loader-utils");

module.exports = function (source) {
    const options = loaderUtils.getOptions(this);

    if (this.cacheable) {
        this.cacheable();
    }

    if (this.resourcePath.includes('css')) {
        console.log(`[${options.msg || ''}] ${this.resourcePath}`);
    }

    return source;
};
