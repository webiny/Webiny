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

        const configPath = process.env.PWD + '/Tests/config.json';
        if (fs.existsSync(configPath)) {
            this.config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        }

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

    loadData(path) {
        if (fs.existsSync(path)) {
            return JSON.parse(fs.readFileSync(path, 'utf8'));
        }
        return null;
    }

    getConfig(key) {
        if (!key) {
            return this.config;
        }

        if (_.isUndefined(this.config) || _.isUndefined(this.config[key])) {
            return null;
        }

        return this.config[key];
    }

    initDriver() {
        if (_.isUndefined(this.driver)) {
            const browserName = _.get(this.getConfig('webdriver'), 'browser', 'chrome');
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
        const tempFolder = _.get(ts.getConfig('webdriver'), 'tempFolder', false);
        if (!tempFolder) {
            console.log('Unable to save screenshot because webdriver.tempFolder is not defined in mocha config.');

            return false;
        }

        // we only create the test folder when the test is failing
        const testTempFolder = this.testTempFolder;
        if (!fs.existsSync(testTempFolder)) {
            mkdirp(testTempFolder);
        }

        const imageName = 'screenshot.png';

        ts.getDriver().takeScreenshot().then(
            (image, err) => {
                require('fs').writeFile(testTempFolder + '/' + imageName, image, 'base64', function (err) {
                    console.log(err);
                });
            }
        );

        const logName = 'console.log';

        ts.getDriver().manage().logs().get('browser', 'debug')
            .then(function (entries) {
                let consoleLog = "";
                entries.forEach(function (entry) {
                    consoleLog += "[" + entry.level.name + "] " + entry.message + "\n";
                });

                require('fs').writeFile(testTempFolder + '/' + logName, consoleLog);
            });
    }

    _createTestTempFolder() {
        // based on the test name, we define the tempFolder where we store the screeenshots and the console logs
        const tempFolder = _.get(ts.getConfig('webdriver'), 'tempFolder', false);
        if (!tempFolder) {
            console.log('Temp folder (webdriver.tempFolder) is not defined in mocha config therefore no screenshots and console logs will be saved');

            return false;
        }

        const suiteName = this.suiteName.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-');
        const testName = this.testName.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-');
        this.testTempFolder = tempFolder + '/' + moment().format('YYYY-MM-DD-HH-mm-ss') + '/' + suiteName + '/' + testName;
    }
}


const ts = new TestSuite();

module.exports = {
    TestSuite: ts,
    By: webdriver.By,
    until: webdriver.until
};