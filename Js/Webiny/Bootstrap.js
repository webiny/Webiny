// import Core vendors
import Webiny from 'Webiny';
import Promise from 'bluebird';

window.Promise = Promise;
Promise.config({
    cancellation: true,
    warnings: {
        wForgottenReturn: false
    }
});

// Define global variables
// These are the basic requirements for the system to work and we don't want to import them all the time in every script
window['$'] = window['jQuery'] = require('jquery');
window['React'] = require('react');
window['ReactDOM'] = require('react-dom');
window['_'] = require('lodash');
require('bootstrap-sass');
window['$Webiny'] = Webiny;

const w = window;
// Check if `Webiny` config exists in the window
if (!w.Webiny) {
    console.error('You must define a "Webiny" config to bootstrap your app!');
} else {
    Webiny.run(w.Webiny);
}