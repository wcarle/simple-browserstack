const chrome = require('selenium-webdriver/chrome');
const request = require('request');
const {Builder, By, Key, until} = require('selenium-webdriver');

exports.runTest = async function(theTest, config) {
    var browserstack = !config.local;
    var sessionData = null;
    var statusUrl = null;
    if (browserstack) {
        driver = await new Builder().
        usingServer('http://hub-cloud.browserstack.com/wd/hub').
        withCapabilities(config.capabilities).
        build();
        sessionData = await driver.session_;
        statusUrl = 'https://' + bsCapablities['browserstack.user'] + ':' + bsCapablities['browserstack.key'] + '@api.browserstack.com/automate/sessions/' + sessionData.id_ + '.json';
    }
    else {
        driver = await new Builder().forBrowser('chrome').build();
    }
    try {
        await theTest();
        if (browserstack) {
            request({
                uri: statusUrl,
                method:'PUT',
                form:{ 'status':'passed','reason': 'Success!' }
            });
        }
        else {
            console.log('Test Passed!');
        }
    } catch (ex) {
        if (browserstack) {
            request({
                uri: statusUrl,
                method:'PUT',
                form:{ 'status':'failed','reason': ex.message }
            });
        }
        else {
            console.log('Test Failed: ' + ex.message);
        }
    } finally {
        await driver.quit();
    }

};