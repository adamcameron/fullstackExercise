Vue.component('greeting', {
    props : {
        message : {
            type: String,
            required: true
        }
    },
    template : `
    <div>
        <h1>{{ message }}</h1>
        <p>{{ message }}</p>
    </div>
    `
});


let appData = {message: "G'day world via Vue"};
new Vue({el: '#title', data: appData});
new Vue({el: '#app', data: appData});
