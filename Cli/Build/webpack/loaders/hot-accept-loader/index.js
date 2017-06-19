'use strict';
module.exports = function (source) {
    if (this.cacheable) {
        this.cacheable();
    }

    if (this.resourcePath.endsWith('/App.js')) {
        if (!/\bimport Webiny\b/.test(source)) {
            source = `import Webiny from 'Webiny';\n${source}`
        }

        return `
            ${source}
            if (module.hot) {
                // Accept update and suppress errors
                module.hot.accept(() => {});
                let lastStatus = 'idle';
                const path = '${this.resourcePath}'.split('/Apps/')[1].split('/');
                module.hot.addStatusHandler(status => {
                    if (lastStatus === 'apply' && status === 'idle') {
                        console.info('[WEBINY] Re-render triggered by', path[0] + '.' + path[2]);
                        Webiny.refresh();
                    }
                    lastStatus = status;
                });
            }`
    }

    if (/\bmodule.hot\b/.test(source)) {
        return source;
    }

    return `
        ${source}
        module.hot.accept(() => {});
    `
};
