let puppeteer = require("puppeteer");

let chai = require("chai");
let chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
chai.use(require("chai-match"));
let should = chai.should();

let axios = require("axios");

const defaultUserName = "adamcameron";
const githubApiUser = getGithubApiUser();

const testVariants = [
    {
        describe : "Tests of githubProfiles page using default username",
        username : defaultUserName
    },
    {
        describe : "Tests of githubProfiles page using username override from URL",
        username : "hootlex"
    }
];

let browser;
let page;

testVariants.forEach(async function (variant) {
    await describe.only(variant.describe, function () {
        let expectedUserData;

        before("Load the page", async function () {
            this.timeout(5000);

            await loadTestPage(variant.username, githubApiUser);
            expectedUserData = await loadTestUserFromGithub(variant.username, githubApiUser);
        });

        after("Close down the browser", async function () {
            await unloadTestPage();
        });

        it("should have the expected person's name", async function () {
            let name = await page.$eval("#app>.card>.content>.header", headerElement => headerElement.innerText)
            name.should.equal(expectedUserData.name);
        });

        it("should have the expected person's github page URL", async function () {
            let linkHref = await page.$eval("#app>.card>.content>.header", headerElement => headerElement.href);
            linkHref.should.equal(expectedUserData.pageUrl);
        });

        it("should have the expected person's avatar", async function () {
            let avatar = await page.$eval("#app>.card>.image>img", avatarElement => avatarElement.src);
            avatar.should.equal(expectedUserData.avatar);
        });

        it("should have the expected person's joining year", async function () {
            const yearPattern = new RegExp(`.*${expectedUserData.joinedYear}.*`);

            let joiningMessage = await page.$eval("#app>.card>.content>.meta>.date", joiningElement => joiningElement.innerText);
            joiningMessage.should.match(yearPattern);
        });

        it("should have the expected person's description", async function () {
            let description = await page.$eval("#app>.card>.content>.description", descriptionElement => descriptionElement.innerText);
            description.should.equal(expectedUserData.description);
        });

        it("should have the expected person's number of friends", async function () {
            const friendsPattern = new RegExp(`.*${expectedUserData.friends}.*`);

            let friendsText = await page.$eval("#app>.card>.extra.content>a", extraContentAnchorElement => extraContentAnchorElement.innerText);
            friendsText.should.match(friendsPattern);
        });

        it("should have the expected person's friends URL", async function () {
            let linkHref = await page.$eval("#app>.card>.extra.content>a", extraContentAnchorElement => extraContentAnchorElement.href);
            linkHref.should.equal(expectedUserData.pageUrl + "?tab=followers");
        });
    });
});

async function loadTestPage(username, githubApiUser) {
    let url = `http://webserver.backend/githubProfiles.html?GITHUB_PERSONAL_ACCESS_TOKEN=${githubApiUser}`;
    if (username !== defaultUserName) {
        url += `&username=${username}`;
    }

    browser = await puppeteer.launch( {args: ["--no-sandbox"]});
    page = await browser.newPage();

    await Promise.all([
        page.on("console", message => {
            if (message.type() === 'info') return;
            console.log(`pageConsoleMessage: [${message.text()}]`)
        }),
        page.goto(url),
        page.waitForNavigation({waitUntil: "networkidle0"})
    ]).catch(error => console.log(error));
}

async function unloadTestPage() {
    await page.close();
    await browser.close();
}

async function loadTestUserFromGithub(username, githubApiUser){
    return await axios.get(
        `https://api.github.com/users/${username}`,
        {
            auth: {
                username: githubApiUser
            }
        })
        .then(response => {
            return {
                name : response.data.name,
                pageUrl : response.data.html_url,
                avatar : response.data.avatar_url,
                joinedYear : new Date(response.data.created_at).getFullYear(),
                description : response.data.bio ?? "",
                friends : response.data.followers,
                friendsPageUrl: response.data.html_url + "?tab=followers"
            };
        });
}

function getGithubApiUser() {
    return process.env.GITHUB_PERSONAL_ACCESS_TOKEN;
}
