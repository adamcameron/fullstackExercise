module.exports = {
    pages : {
        index: {
            entry: "src/index/main.js",
            template: "public/index.html",
            filename: "index.html",
            title: "Hello World"
        },
        gdayWorld: {
            entry: "src/gdayWorld/main.js",
            template: "public/gdayWorldViaVue.html",
            filename: "gdayWorldViaVue.html"
        },
        workshopRegistration: {
            entry: "src/workshopRegistration/main.js",
            template: "public/workshopRegistration.html",
            filename: "workshopRegistration.html"
        }
    },
    devServer: {
        host: "vuejs.backend",
        disableHostCheck: false,
        port: 8080,
        watchOptions : {
            ignored: /node_modules/,
            poll: 1000
        }
    }
}
