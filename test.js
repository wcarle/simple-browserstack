const simplebs = require('../simple-browserstack');
const {Builder, By, Key, until} = require('selenium-webdriver');

async function theTest() {
    // Go to a video page
    await driver.get('https://www.google.com/');

    await driver.findElement(By.name('q')).sendKeys('BrowserStack' + Key.RETURN);
    await driver.wait(until.elementLocated(By.id('resultStats')), 2000);
}


async function runTestLocal() {
    let config = {
        local: true,
        messagePassed: 'Google test passed!',
        messageFailed: 'Google test failed :(',
        slack: {
            webhook: 'https://hooks.slack.com/services/<<YOUR WEBHOOK KEY>>'
        }
    };
    simplebs.runTest(theTest, config);
};

async function runTestBrowserStack() {
    let config = {
        local: false,
        messagePassed: 'Google test passed!',
        messageFailed: 'Google test failed :(',
        capabilities: {
            'browserName' : 'iPhone',
            'device' : 'iPhone 8 Plus',
            'realMobile' : 'true',
            'os_version' : '11',
            'browserstack.user' : '<<USERNAME>>',
            'browserstack.key' : '<<KEY>>',
            'browserstack.debug' : 'false',
            'name' : 'Bstack-[Node] My iPhone Test'
        }
    };
    simplebs.runTest(theTest, config);
};

(async function(){
    await runTestLocal();
    // await runTestBrowserStack();
})()