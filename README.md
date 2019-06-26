# simple-browserstack
A simple wrapper for browserstack node js tests

Here's an example:

```
const simplebs = require('simple-browserstack');
const {Builder, By, Key, until} = require('selenium-webdriver');

// Define the test using the selenium webdriver
async function theTest() {
    await driver.get('https://www.google.com/');
    await driver.findElement(By.name('q')).sendKeys('BrowserStack' + Key.RETURN);
    await driver.wait(until.elementLocated(By.id('resultStats')), 2000);
}

(async function(){
    let config = {
        // For local debugging, if set to true it will execute using a local chrome driver instead of selenium
        local: false,
        // Message that will be recored if the test passes
        messagePassed: 'Google test passed!',
        // Message that will be recored if the test fails
        messageFailed: 'Google test failed :(',
        // Optional parameter to send a slack message to a webhook with the failure or pass message
        slack: {
            webhook: 'https://hooks.slack.com/services/<<SLACK WEBHOOK>>'
        },
        // BrowserStack capabilities, see their documentation: https://www.browserstack.com/automate/capabilities
        capabilities: {
            'browserName' : 'iPhone',
            'device' : 'iPhone 8 Plus',
            'realMobile' : 'true',
            'os_version' : '11',
            'browserstack.user' : '<<USERNAME>>',
            'browserstack.key' : '<<KEY>>',
            'browserstack.debug' : 'false',
            'name' : 'Bstack-[Node] Google iPhone Test'
        }
    };
    // Run the test
    simplebs.runTest(theTest, config);
})()
```
