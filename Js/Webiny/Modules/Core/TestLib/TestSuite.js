/* eslint-disable */
var assert = require('assert');
var webdriver = require('selenium-webdriver');
var _ = require('lodash');
var path = require('path');
var fs = require('fs');
var moment = require('moment');
var mkdirp = require('mkdirp');

class TestSuite {

    constructor() {
        this.testFailing = false;
        this.suiteName = null;
        this.testName = null;
        this.testTempFolder = null;

        this.loadConfig();
        this.initDriver();
        this.setupCallbacks();
    }

    setTestIsFailing() {
        this.testFailing = true;
    }

    getTestIsFailing() {
        return this.testFailing;
    }

    setTestName(suiteName, testName) {
        this.testName = testName;
        this.suiteName = suiteName;

        // each time we update the test name, we have to refresh the test temp folder
        this._createTestTempFolder();
    }

    loadConfig() {
        this.config = {
            "baseUrl": "http://selecto.app:8001/",
            "webdriver": {
                "browser": "chrome",
                "tempFolder": "./Temp"
            },
            "login": {
                "username": "pavel@webiny.com",
                "password": "dev",
                "timeout": 5000
            }
        };
        /*let argv = require('optimist').demand('config').argv;
         let configFilePath = argv.config;

         if (fs.existsSync(configFilePath)) {
         this.config = require('nconf').env().argv().file({file: configFilePath});
         }*/
    }

    getConfig(key) {
        if (_.isUndefined(this.config) || _.isUndefined(this.config[key])) {
            return null;
        }

        return this.config[key];
    }

    initDriver() {
        if (_.isUndefined(this.driver)) {
            let browserName = _.get(this.getConfig('webdriver'), 'browser', 'chrome');
            this.driver = new webdriver.Builder()
                .forBrowser(browserName)
                .build();
        }
    }

    getDriver() {
        return this.driver;
    }

    setupCallbacks() {
        after(function (done) {
            console.log('AFTER CLALLBACK');
            ts.getDriver().quit().then(done);
        });

        afterEach(function () {
            if (this.currentTest.state == 'failed') {
                // mark that the test is failing, so we write the log after the test
                ts.setTestIsFailing();

                ts.setTestName(this.currentTest.parent.fullTitle(), this.currentTest.title);

                // save screenshot and log data
                ts.saveScreenshotAndLogData();
            }
        });
    }

    saveScreenshotAndLogData() {
        let tempFolder = _.get(ts.getConfig('webdriver'), 'tempFolder', false);
        if (!tempFolder) {
            console.log('Unable to save screenshot because webdriver.tempFolder is not defined in mocha config.');

            return false;
        }

        // we only create the test folder when the test is failing
        let testTempFolder = this.testTempFolder
        if (!fs.existsSync(testTempFolder)) {
            mkdirp(testTempFolder);
        }

        let imageName = 'screenshot.png';

        ts.getDriver().takeScreenshot().then(
            (image, err) => {
                require('fs').writeFile(testTempFolder + '/' + imageName, image, 'base64', function (err) {
                    console.log(err);
                });
            }
        );

        let logName = 'console.log';

        ts.getDriver().manage().logs().get('browser', 'debug')
            .then(function (entries) {
                var consoleLog = "";
                entries.forEach(function (entry) {
                    consoleLog += "[" + entry.level.name + "] " + entry.message + "\n";
                });

                require('fs').writeFile(testTempFolder + '/' + logName, consoleLog);
            });
    }

    login() {
        // open login page
        describe('Login Page', function () {

            this.timeout(_.get(ts.getConfig('login'), 'timeout', 2000));

            it('should login into dashboard', function (done) {

                ts.getDriver().get('http://demo.app/admin/login').then(function () {
                    ts.getDriver().wait(webdriver.until.elementLocated({xpath: '/html/body/webiny-app/rad-placeholder/webiny-form-container/div/div/form/layout/div[3]/div/input'})).then(function () {
                        // populate email input
                        var emailInput = ts.getDriver().findElement({xpath: '/html/body/webiny-app/rad-placeholder/webiny-form-container/div/div/form/layout/div[3]/div/input'});
                        emailInput.sendKeys(_.get(ts.getConfig('login'), 'username', 'missing@username'));

                        // populate password input
                        var passwordInput = ts.getDriver().findElement({xpath: '/html/body/webiny-app/rad-placeholder/webiny-form-container/div/div/form/layout/div[4]/div/input'});
                        passwordInput.sendKeys(_.get(ts.getConfig('login'), 'password', 'missing@password'));

                        // submit form
                        ts.getDriver().findElement({className: 'btn btn-lg btn-primary'}).click().then(function () {
                            ts.getDriver().wait(webdriver.until.elementLocated({id: 'left-sidebar'})).then(function () {
                                console.log('LOGIN DONE');
                                done();
                            });
                        });
                    });
                });
            });
        });
    }

    _createTestTempFolder() {
        // based on the test name, we define the tempFolder where we store the screeenshots and the console logs
        let tempFolder = _.get(ts.getConfig('webdriver'), 'tempFolder', false);
        if (!tempFolder) {
            console.log('Temp folder (webdriver.tempFolder) is not defined in mocha config therefore no screenshots and console logs will be saved');

            return false;
        }

        let suiteName = this.suiteName.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-');
        let testName = this.testName.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-');
        this.testTempFolder = tempFolder + '/' + moment().format('YYYY-MM-DD-HH-mm-ss') + '/' + suiteName + '/' + testName;
    }
}


var ts = new TestSuite();

module.exports = {
    TestSuite: ts,
    By: webdriver.By,
    until: webdriver.until
};