'use strict';
module.exports = function (source) {
    if (this.cacheable) {
        this.cacheable();
    }

    if (!/\bimport Webiny\b/.test(source)) {
        source = `import Webiny from 'webiny';\n${source}`
    }

    if (this.resourcePath.endsWith('/App.js')) {
        return `
            ${source}
            
            if (module.hot && !Webiny.updating) {
                console.log('Hot updating App.js');
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
        if(!Webiny.updating) {
            console.log('Hot updating');
            //module.hot.accept(() => {});
        }
    `
};
