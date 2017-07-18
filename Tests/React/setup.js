/**
 * This file is a bootstrap file for React components tests.
 * It contains Webiny specific bootstrap stuff and serves as PROOF OF CONCEPT ONLY.
 *
 * At a later time this will be refactored into a test suite when we decide which way we want to go with testing.
 *
 * @author Pavel Denisjuk <pavel@webiny.com>
 */

require('babel-polyfill');
const path = require('path');
const _ = require('lodash');
const {JSDOM} = require('jsdom');

const {window} = new JSDOM('<!doctype html><html><body></body></html>');

function copyProps(src, target) {
    const props = Object.getOwnPropertyNames(src)
        .filter(prop => typeof target[prop] === 'undefined')
        .map(prop => Object.getOwnPropertyDescriptor(src, prop));
    Object.defineProperties(target, props);
}

global.DEVELOPMENT = true;
global.PRODUCTION = false;
global.window = window;
global.document = window.document;
global.navigator = {
    userAgent: 'node.js',
};

// Expose global libraries (in our regular build this is done via webpack)
_.assign(global, {
    React: require('react'),
    ReactDOM: require('react-dom').ReactDOM,
    $: require('jquery'),
    _: _
});

// Prevent loading of images and CSS/SCSS files
require.extensions['.css'] = _.noop;
require.extensions['.scss'] = _.noop;
require.extensions['.png'] = _.noop;
require.extensions['.jpg'] = _.noop;
require.extensions['.svg'] = _.noop;

copyProps(window, global);

// Intercept module loader to add
const Module = require('module');
const originalRequire = Module.prototype.require;
Module.prototype.require = function () {
    if (arguments[0].startsWith('Assets/')) {
        return originalRequire.apply(this, [path.join(__dirname, '/../../Js/Core/', arguments[0])]);
    }

    if (arguments[0].startsWith('Webiny')) {
        return originalRequire.apply(this, [path.join(__dirname, '/../../Js/Core/Webiny')]);
    }

    return originalRequire.apply(this, arguments);
};

// Load Core app
require('./../../Js/Core/App');

// Create `mount` function to hide Webiny specific implementation from test
const enzymeMount = require('enzyme').mount;
module.exports = {
    mount(element) {
        let done = false;
        return new Promise(resolve => {
            const wrapper = enzymeMount(React.cloneElement(element, {
                onComponentDidMount: () => {
                    done = true;
                }
            }));

            let interval = setInterval(() => {
                clearInterval(interval);
                resolve(wrapper);
            }, 10);
        });
    }
};