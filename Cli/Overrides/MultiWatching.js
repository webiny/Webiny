/*
 MIT License http://www.opensource.org/licenses/mit-license.php
 Originally by Tobias Koppers @sokra
 Changed by Pavel Denisjuk <pavel@webiny.com> to reflect chained execution using promises.
 */
"use strict";

const asyncLib = require("async");

class MultiWatching {
    constructor(watchings, compiler) {
        this.watchings = watchings;
        this.compiler = compiler;
    }

    invalidate() {
        console.log('MultiWatchings INVALIDATE');
        this.watchings.then(watchings => {
            watchings.forEach(watching => watching.invalidate())
        });
    }

    close(callback) {
        console.log('MultiWatchings CLOSE');
        if (callback === undefined) {
            callback = () => {
                /*do nothing*/
            };
        }

        this.watchings.then(watchings => {
            console.log('Closing', watchings);
            asyncLib.forEach(watchings, (watching, finishedCallback) => {
                watching.close(finishedCallback);
            }, err => {
                this.compiler.applyPlugins("watch-close");
                callback(err);
            });
        });
    }
}

module.exports = MultiWatching;
