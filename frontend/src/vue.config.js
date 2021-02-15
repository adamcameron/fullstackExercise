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
    },
    chainWebpack: config => {
        config.plugin('copy').tap(([options]) => {
            options[0].ignore.push('node_modules/**/*')
            return [options]
        })
    }
}
