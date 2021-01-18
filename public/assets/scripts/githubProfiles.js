let githubUserCardComponent = {
    template : "#github-user-card-template",
    props : {
        defaultUserName: {
            type: String,
            required: true
        }
    },
    data (){
        return {
            username : this.$route.query.username ?? this.defaultUserName,
            githubApiUser : this.$route.query.GITHUB_PERSONAL_ACCESS_TOKEN,
            name : null,
            pageUrl : null,
            avatar : null,
            joinedYear : null,
            description : null,
            friends : null,
            friendsPageUrl: null
        };
    },
    created () {
        console.log("BEFORE axios.get");
        axios.get(
            `https://api.github.com/users/${this.username}`,
            {
                auth: {
                    username: this.githubApiUser
                },
                validateStatus: function(status) {
                    return status >= 200 && status < 300;
                }
            }
        )
        .then(response => {
            console.log("IN then");
            this.name = response.data.name;
            this.pageUrl = response.data.html_url;
            this.avatar = response.data.avatar_url;
            this.joinedYear = new Date(response.data.created_at).getFullYear();
            this.description = response.data.bio ?? "";
            this.friends = response.data.followers;
            this.friendsPageUrl = response.data.html_url + "?tab=followers";

            console.log(`USERNAME: [${this.username}]; DATA: [${this.name}][${this.pageUrl}]`);
        })
        .catch(error => {
            console.log(error);
        });
        console.log("AFTER axios.get");
    }
};

let router = new VueRouter({
    mode: 'history',
    routes: []
});

new Vue({
    router,
    el: '#app',
    components: {
        "github-user-card" : githubUserCardComponent
    }
})

