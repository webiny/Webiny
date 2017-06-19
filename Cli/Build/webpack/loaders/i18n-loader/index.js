'use strict';
const loaderUtils = require("loader-utils");

const keyRegex = /this\.i18n\.key\s{0,}=\s{0,}['|"|`]([a-zA-Z0-9\.-_:]+)['|"|`]/;
const stringRegex = /this\.i18n\(['|"|`]([a-zA-Z0-9\.\s-{}]+?)['|"|`]/gm;

module.exports = function (source) {
    const options = loaderUtils.getOptions(this);
    if (this.cacheable) {
        this.cacheable();
    }

    let i18nKey;
    if(i18nKey = keyRegex.exec(source)) {
        i18nKey = i18nKey[1];
    } else {
        i18nKey = this.resourcePath.split('Apps/').pop().replace('/Js/', '/').replace(/\.jsx?/, '').replace(/\//g, '.');
    }

    let m;
    while (m = stringRegex.exec(source)) {
        options.addString(this.resourcePath, i18nKey, m[1]);
    }

    return source;
};
