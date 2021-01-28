let puppeteer = require('puppeteer');

let chai = require("chai");
let chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
let should = chai.should();

describe("Baseline test of vue.js working", function () {
    let browser;
    let page;

    const expectedText = "G'day world via Vue";

    before("Load the test document", async function () {
        this.timeout(5000);

        browser = await puppeteer.launch( {args: ["--no-sandbox"]});
        page = await browser.newPage();

        await page.goto("http://fullstackexercise.frontend/gdayWorldViaVue.html");
    });

    after("Close down the browser", async function () {
        await page.close();
        await browser.close();
    });

    it("should return the correct page title", async function () {
        await page.title().should.eventually.equal(expectedText);
    });

    it("should return the correct page heading", async function () {
        let headingText = await page.$eval("h1", headingElement => headingElement.innerText);

        headingText.should.equal(expectedText);
    });

    it("should return the correct page content", async function () {
        let paragraphContent = await page.$eval("p", paragraphElement => paragraphElement.innerText);

        paragraphContent.should.equal(expectedText);
    });
});
