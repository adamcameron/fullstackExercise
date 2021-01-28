let puppeteer = require('puppeteer');

let chai = require("chai");
let chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
let should = chai.should();

describe("Baseline tests of click-counter component", function () {
    let browser;
    let page;

    before("Load the test document", async function () {
        this.timeout(5000);

        browser = await puppeteer.launch( {args: ["--no-sandbox"]});
        page = await browser.newPage();

        await Promise.all([
            page.goto("http://fullstackexercise.frontend/button.html"),
            page.waitForNavigation()
        ]);
    });

    after("Close down the browser", async function () {
        await page.close();
        await browser.close();
    });

    it("should start with a counter of zero", async function () {
        await page.reload();

        let counterValue = await page.$eval("#app>button", counterValue => parseInt(counterValue.innerText));

        counterValue.should.equal(0);
    });

    it("should increment when clicked", async function () {
        let counterButton = await page.$("#app>button");

        let getCount = function (counterButton){
            return parseInt(counterButton.innerText);
        };

        let initialCounterValue = await counterButton.evaluate(getCount);

        const clickCount = 3;

        let clicks = Array.from({length:clickCount}).map(()=>{return counterButton.click()});
        await Promise.all(clicks);

        let currentCounterValue = await counterButton.evaluate(getCount);

        currentCounterValue.should.equal(initialCounterValue + clickCount);
    });
});
