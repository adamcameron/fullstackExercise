let https = require("https");

let puppeteer = require("puppeteer");

let chai = require("chai");
chai.use(require("chai-string"));
let should = chai.should();

describe.only("Tests of githubProfiles page using github data", function () {
    let browser;
    let page;
    let expectedUserData;

    before("Load the page", async function () {
        this.timeout(10000);

        await loadTestPage();
        expectedUserData = await loadTestUserFromGithub();
    });

    after("Close down the browser", async function () {
        await page.close();
        await browser.close();
    });

    it("should have the expected person's name", async function () {
        let name = await page.$eval("#app>.card>.content>.header", headerElement => headerElement.innerText)
        name.should.equal(expectedUserData.name);
    });

    it("should have the expected person's github page URL", async function () {
        let linkHref = await page.$eval("#app>.card>.content>a.header", headerElement => headerElement.href);
        linkHref.should.equal(expectedUserData.pageUrl);
    });

    it("should have the expected person's avatar", async function () {
        let avatar = await page.$eval("#app>.card>.image>img", avatarElement => avatarElement.src);
        avatar.should.equal(expectedUserData.avatar);
    });

    it("should have the expected person's joining year", async function () {
        const expectedJoiningMessage = `Joined in ${expectedUserData.joinedYear}`;

        let joiningMessage = await page.$eval("#app>.card>.content>.meta>.date", joiningElement => joiningElement.innerText);
        joiningMessage.should.equal(expectedJoiningMessage);
    });

    it("should have the expected person's description", async function () {
        let description = await page.$eval("#app>.card>.content>.description", descriptionElement => descriptionElement.innerText);
        description.should.equal(expectedUserData.description);
    });

    it("should have the expected person's number of friends", async function () {
        const expectedFriendsMessage = `${expectedUserData.friends} Friends`;

        let friendsText = await page.$eval("#app>.card>.extra.content>a", extraContentAnchorElement => extraContentAnchorElement.innerText);
        friendsText.should.containIgnoreSpaces(expectedFriendsMessage);
    });

    it("should have the expected person's friends URL", async function () {
        let linkHref = await page.$eval("#app>.card>.extra.content>a", extraContentAnchorElement => extraContentAnchorElement.href);
        linkHref.should.equal(expectedUserData.friendsPageUrl);
    });

    let loadTestPage = async function () {
        browser = await puppeteer.launch( {args: ["--no-sandbox"]});
        page = await browser.newPage();

        await Promise.all([
            page.goto("http://webserver.backend/githubProfiles.html"),
            page.waitForNavigation({waitUntil: "networkidle0"})
        ]);
    }

    let loadTestUserFromGithub = async function () {
        let githubUserData = await new Promise((resolve, reject) => {
            let request = https.get(
                "https://api.github.com/users/hootlex",
                    {
                        auth: `username: ${process.env.GITHUB_PERSONAL_ACCESS_TOKEN}`,
                        headers: {'user-agent': 'node.js'}
                    }, response => {
                    let rawResponseData = "";

                    response.on("data", data => {
                        rawResponseData += data;
                    }).on("end", () => {
                        resolve(JSON.parse(rawResponseData));
                    }).on("error", error => {
                        reject(error.message);
                    });
                }
            );
            request.end();
        });
        return {
            name : githubUserData.name,
            pageUrl : githubUserData.html_url,
            avatar : githubUserData.avatar_url,
            joinedYear : new Date(githubUserData.created_at).getFullYear(),
            description : githubUserData.bio ?? "",
            friends : githubUserData.followers,
            friendsPageUrl: githubUserData.html_url + "?tab=followers"
        };
    }
});
