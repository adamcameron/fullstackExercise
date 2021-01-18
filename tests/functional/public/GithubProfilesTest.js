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

testVariants.forEach(function (variant) {
    describe.only(variant.describe, function () {
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
            let name = page.$eval("#app>.card>.content>.header", headerElement => headerElement.innerText);
            name.should.eventually.equal(expectedUserData.name);
        });

        it("should have the expected person's github page URL", async function () {
            let linkHref = page.$eval("#app>.card>.content>.header", headerElement => headerElement.href);
            linkHref.should.eventually.equal(expectedUserData.pageUrl);
        });

        it("should have the expected person's avatar", async function () {
            let avatar = page.$eval("#app>.card>.image>img", avatarElement => avatarElement.src);
            avatar.should.eventually.equal(expectedUserData.avatar);
        });

        it("should have the expected person's joining year", async function () {
            const yearPattern = new RegExp(`.*${expectedUserData.joinedYear}.*`);

            let joiningMessage = page.$eval("#app>.card>.content>.meta>.date", joiningElement => joiningElement.innerText);
            joiningMessage.should.eventually.match(yearPattern);
        });

        it("should have the expected person's description", async function () {
            let description = page.$eval("#app>.card>.content>.description", descriptionElement => descriptionElement.innerText);
            description.should.eventually.equal(expectedUserData.description);
        });

        it("should have the expected person's number of friends", async function () {
            const friendsPattern = new RegExp(`.*${expectedUserData.friends}.*`);

            let friendsText = page.$eval("#app>.card>.extra.content>a", extraContentAnchorElement => extraContentAnchorElement.innerText);
            friendsText.should.eventually.match(friendsPattern);
        });

        it("should have the expected person's friends URL", async function () {
            let linkHref = page.$eval("#app>.card>.extra.content>a", extraContentAnchorElement => extraContentAnchorElement.href);
            linkHref.should.eventually.equal(expectedUserData.pageUrl + "?tab=followers");
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
        page.goto(url),
        page.waitForNavigation()
    ]);
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
