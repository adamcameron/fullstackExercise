let githubUserCardComponent = {
    template : "#github-user-card-template",
    data : function () {
        return {
            name : "Kristy",
            pageUrl : "http://webserver.backend/GITHUB_PAGE_URL",
            avatar : "https://semantic-ui.com/images/avatar2/large/kristy.png",
            joinedYear : "2013_BREAK_ME",
            description : "Kristy is an art director living in New York.",
            friends : 22,
            friendsPageUrl: "http://webserver.backend/GITHUB_FRIENDS_PAGE_URL"
        };
    }
};

new Vue({
    el: '#app',
    components: {
        "github-user-card" : githubUserCardComponent
    }
});

