let https = require("https");

let puppeteer = require("puppeteer");

let chai = require("chai");
chai.use(require('chai-match'));
let should = chai.should();

describe("Tests of notification Vue Component", function() {
    let browser;
    let page;
    let clientConsole = [];

    describe("Tests happy path scenarios", function () {
        before("Load the page", async function () {
            this.timeout(5000);
            await loadPage("http://webserver.backend/notification.html");
        });

        after("Close down the browser", async function () {
            await closeBrowser();
        });

        describe("Test of the baseline example notification", function () {
            const expectedType = "error";
            const notificationSelector = `#app>[data-test-id='baseline']>.ui.${expectedType}.message`;

            it("should use the correct type", async function () {
                let notificationSelector = "#app>[data-test-id='baseline']>.ui.message";

                let elementClasses = await page.$eval(notificationSelector, notificationElement => notificationElement.className);

                const hasMessageAndTypePattern = new RegExp(`(?=.*\\bmessage\\b)(?=.*\\b${expectedType}\\b)`);
                elementClasses.should.match(hasMessageAndTypePattern);
            });

            it("should use the correct heading", async function () {
                const headerSelector = `${notificationSelector}>.header`;

                let heading = await page.$eval(headerSelector, headerElement => headerElement.innerText);
                heading.should.equal("You are eligible for a reward");
            });

            it("should display the baseline example notification with the correct content", async function () {
                let messageContent = await page.$eval(notificationSelector, notificationElement => {
                    if (notificationElement.children.length < 3) { // link / heading / message
                        return Promise.reject(`Did not find message content in [${notificationElement.outerHTML}]`);
                    }
                    return Promise.resolve(notificationElement.children[2].outerHTML);
                });
                messageContent.should.equal("<p>Go to the <b>special offers</b> page to see now.</p>");
            });

            it("should hide the notification when the close button is clicked", async function () {
                let isVisibleAtStart = await page.$eval(notificationSelector, notificationElement => {
                    let styling = window.getComputedStyle(notificationElement);

                    return (styling
                        && styling.display !== 'none'
                        && styling.visibility !== 'hidden'
                        && styling.opacity !== '0'
                    );
                });
                isVisibleAtStart.should.be.true;

                let closeButtonSelector = `${notificationSelector}>i.close.icon`;
                let closeButton = await page.$(closeButtonSelector);
                await closeButton.click();

                let isVisibleAfterClick = await page.$eval(notificationSelector, notificationElement => {
                    let styling = window.getComputedStyle(notificationElement);

                    return (styling
                        && styling.display !== 'none'
                        && styling.visibility !== 'hidden'
                        && styling.opacity !== '0'
                    );
                });
                isVisibleAfterClick.should.be.false;
            });
        });

        describe("Test default-values functionality", function () {
            const testContainerSelector = "#app>[data-test-id='default-behaviours']";

            it("should display an INFO notification if no type is provided", async function () {
                let testContainerElement = await page.$(testContainerSelector).then(testContainerElement => {
                    let infoNotificationElements = testContainerElement.$$("div.ui.message.info");

                    return Promise.resolve(infoNotificationElements);
                });

                testContainerElement.should.have.length(1, "There should be one and only one info notification boxes");
            });

            it("should display default heading if no custom heading is provided", async function () {
                const notificationHeadingSelector = `${testContainerSelector}>div.ui.message.info>.header`;
                let notificationText = await page.$eval(notificationHeadingSelector, notificationElement => notificationElement.innerText);

                notificationText.should.equal("Info");
            });

            it("should display not content if no custom content is provided", async function () {
                const notificationSelector = `${testContainerSelector}>div.ui.message.info`;
                let messageContent = await page.$eval(notificationSelector, notificationElement => {
                    if (notificationElement.children.length > 2) { // link / heading / message
                        return Promise.reject(`Found message content when none was expected [${notificationElement.outerHTML}]`);
                    }
                    return Promise.resolve("");
                });
                messageContent.should.be.empty;
            });
        });
    });

    describe("Test notification-type validation", function () {
        before("Load the page", async function () {
            this.timeout(5000);
            await loadPage("http://webserver.backend/invalidNotificationType.html");
        });

        after("Close down the browser", async function () {
            await closeBrowser();
        });

        it("should only allow SUCCESS, INFO, WARNING and ERROR notifications", function () {
            clientConsole.should.not.be.empty;
            clientConsole[0].type().should.equal("error");
            clientConsole[0].text().should.contain("Invalid prop");
            clientConsole[0].text().should.contain('"type"');
        });
    });

    let loadPage = async function (url) {
        clientConsole = [];

        browser = await puppeteer.launch( {args: ["--no-sandbox"]});
        page = await browser.newPage();

        await Promise.all([
            page.on("console", (log) => clientConsole.push(log)),
            page.goto(url),
            page.waitForNavigation()
        ]);
    };

    let closeBrowser = async function () {
        await page.close();
        await browser.close();
    };
});
