const chrome = require('selenium-webdriver/chrome');
const request = require('request');
const {Builder, By, Key, until} = require('selenium-webdriver');

exports.runTest = async function(theTest, config) {
    var browserstack = !config.local;
    var sessionData = null;
    if (browserstack) {
        driver = await new Builder().
        usingServer('http://hub-cloud.browserstack.com/wd/hub').
        withCapabilities(config.capabilities).
        build();
        sessionData = await driver.session_;
        config.statusUrl = 'https://' + config.capabilities['browserstack.user'] + ':' + config.capabilities['browserstack.key'] + '@api.browserstack.com/automate/sessions/' + sessionData.id_ + '.json';
    }
    else {
        driver = await new Builder().forBrowser('chrome').build();
    }
    try {
        await theTest(driver);

        var messagePassed = config.messagePassed ? config.messagePassed : 'Test Passed!';
        sendNotification(config, true, messagePassed);
    } catch (ex) {
        var messageFailed = config.messageFailed ? config.messageFailed : 'Test Failed';
        sendNotification(config, false, messageFailed + ' - ' + ex.message);
    } finally {
        await driver.quit();
    }
};

function sendNotification(config, pass, message) {
    var status = pass ? 'passed' : 'failed';
    if (config.local) {
        console.log(message);
    }
    else if(config.statusUrl) {
        request({
            uri: config.statusUrl,
            method:'PUT',
            form:{ 'status': status,'reason': message }
        });
    }
    if (config.slack && config.slack.webhook) {
        request({
            uri: config.slack.webhook,
            method:'POST',
            json:{ 'text': message }
        });
    }
}